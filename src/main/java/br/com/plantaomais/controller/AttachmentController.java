package br.com.plantaomais.controller;

import br.com.nextage.persistence_2.classes.Propriedade;
import br.com.nextage.persistence_2.dao.GenericDao;
import br.com.plantaomais.config.ApplicationProperties;
import br.com.plantaomais.entitybean.Attachment;
import br.com.plantaomais.entitybean.ContratoAnexo;
import br.com.plantaomais.entitybean.MedicoAnexo;
import br.com.plantaomais.entitybean.enums.AttachmentCompressionType;
import br.com.plantaomais.entitybean.enums.AttachmentType;
import br.com.plantaomais.util.Util;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.google.common.io.ByteStreams;
import com.google.common.io.Files;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Query;
import org.hibernate.Session;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static br.com.nextage.persistence_2.util.HibernateUtil.getSession;
import static br.com.plantaomais.config.AmazonS3Configuration.getBucket;
import static br.com.plantaomais.config.AmazonS3Configuration.getS3Instance;
import static java.util.UUID.randomUUID;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;

@SuppressWarnings("unchecked")
public class AttachmentController extends Controller {

    private final Executor executor = Executors.newFixedThreadPool(10);

    public void delete(Attachment document) {

        var future = new CompletableFuture<>();

        try {
            future
                    .thenApplyAsync(o -> {
                        AmazonS3 s3Instance = getS3Instance();
                        s3Instance.deleteObject(getBucket(), document.getKey());
                        document.setUrl(null);
                        document.setKey(null);
                        document.setFile(null);
                        var transaction = getSession().beginTransaction();
                        transaction.begin();
                        getSession().delete(document);
                        transaction.commit();
                        return document;
                    })
                    .get(30, TimeUnit.SECONDS);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            e.printStackTrace();
        }

    }

    @SuppressWarnings("unchecked")
    public void uploadPending() {
        var processed = (List<Attachment>) getSession()
                .createQuery("select o from Attachment o where o.processed is null or o.processed = :processed ")
                .setBoolean("processed", false)
                .list();
        var pendingItems = processed.stream().map(Attachment::getId).collect(Collectors.toList());
        uploadByAttachmentIds(pendingItems);

    }

    public Attachment findById(Integer id) {

        var attachment = (Attachment) getSession().createQuery("select o from Attachment o where o.id = :id")
                .setInteger("id", id)
                .uniqueResult();

        var s3Instance = getS3Instance();
        var url = s3Instance.generatePresignedUrl(getBucket(), attachment.getKey(), Date.from(Instant.now().plusSeconds(120)));
        attachment.setUrl(url.toString());
        return attachment;
    }

    public Attachment generateMapZipFileFromAttachments(Map<String, List<Integer>> mapAttachmentIds, String prefixName) {

        if (mapAttachmentIds == null) {
            throw new IllegalArgumentException("Empty document id list received. Unable to process zip file");
        }

        var attachment = new Attachment();
        attachment.setProcessed(false);
        attachment.setType(AttachmentType.ZIP);

        var name = randomUUID().toString();
        if (prefixName != null) {
            name = prefixName + name;
        }

        var key = generateDocumentKey(name+"zip");

        attachment.setFileName(name.concat(".zip"));
        attachment.setName(name.concat(".zip"));
        attachment.setKey(key);

        Session session = getSession();
        var transaction = session.beginTransaction();
        transaction.begin();
        session.saveOrUpdate(attachment);
        transaction.commit();
        session.flush();

        uploadMapZipAsync(attachment, mapAttachmentIds);

        return attachment;
    }

    private void uploadMapZipAsync(Attachment attachment, Map<String, List<Integer>> mapAttachments) {
        CompletableFuture
                .supplyAsync(() -> {
                    List<Attachment> collect = mapAttachments.entrySet()
                            .stream()
                            .flatMap(entry -> {
                                List<Attachment> medicAttachments = entry.getValue().stream()
                                        .map(it -> (Attachment) getSession()
                                            .createQuery("select o from Attachment o where o.id = :id")
                                            .setInteger("id", it)
                                            .uniqueResult())
                                        .filter(it -> it != null)
                                        .filter(it -> it.getKey() != null)
                                        .peek(it -> {
                                            if (!entry.getKey().isEmpty()) {
                                                var newName = String.format("%s/%s", entry.getKey(), it.getFileName());
                                                it.setFileName(newName);
                                            }
                                        })
                                        .collect(Collectors.toList());
                                return medicAttachments.stream();
                            })
                            .peek(it -> {
                                try {
                                    InputStream in = getS3Instance().getObject(ApplicationProperties.getInstance().getProperty("aws.bucket"), it.getKey()).getObjectContent();
                                    if (in != null) {
                                        @SuppressWarnings("UnstableApiUsage") byte[] bytes = ByteStreams.toByteArray(in);
                                        it.setFile(bytes);
                                    }
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            })
                            .collect(Collectors.toList());

                    try {
                        byte[] bytes = listBytesToZip(collect);

                        var initialStream = new ByteArrayInputStream(bytes);

                        var metadata = new ObjectMetadata();
                        metadata.setContentType("application/zip");

                        var s3Instance = getS3Instance();

                        s3Instance.putObject(new PutObjectRequest(getBucket(), attachment.getKey(), initialStream, metadata));

                        var url = s3Instance.getUrl(getBucket(), attachment.getKey());
                        attachment.setUrl(url.toString());
                        attachment.setProcessed(true);
                        attachment.setFile(null);
                        attachment.setContentType(metadata.getContentType());

                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return attachment;
                })
                .whenCompleteAsync((o, throwable) -> {

                    try {
                        if (throwable == null) {
                            attachment.setProcessed(true);
                            attachment.setFile(null);
                        } else {
                            throwable.printStackTrace();
                            return;
                        }
                        Session session = getSession();
                        var transaction = session.beginTransaction();
                        transaction.begin();
                        session.saveOrUpdate(attachment);
                        transaction.commit();
                        session.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                });
    }

    public Attachment generateZipFileFromAttachments(List<Integer> attachmentIds) {

        return generateZipFileFromAttachments(attachmentIds, null);
    }

    public Attachment generateZipFileFromAttachments(List<Integer> attachmentIds, String prefixName) {

        if (attachmentIds == null) {
            throw new IllegalArgumentException("Empty document id list received. Unable to process zip file");
        }

        var attachment = new Attachment();
        attachment.setProcessed(false);
        attachment.setType(AttachmentType.ZIP);

        var name = randomUUID().toString();
        if (prefixName != null) {
            name = prefixName + name;
        }

        var key = generateDocumentKey(name + "zip");

        attachment.setFileName(name.concat(".zip"));
        attachment.setName(name.concat(".zip"));
        attachment.setKey(key);

        Session session = getSession();
        var transaction = session.beginTransaction();
        transaction.begin();
        session.saveOrUpdate(attachment);
        transaction.commit();
        session.flush();

        uploadZipAsync(attachment, attachmentIds);

        return attachment;

    }

    private void uploadZipAsync(Attachment attachment, List<Integer> attachments) {
        CompletableFuture
                .supplyAsync(() -> {
                    List<Attachment> collect = attachments
                            .stream()
                            .map(it -> (Attachment) getSession()
                                    .createQuery("select o from Attachment o where o.id = :id")
                                    .setInteger("id", it)
                                    .uniqueResult())
                            .filter(it -> it != null)
                            .filter(it -> it.getKey() != null)
                            .peek(it -> {
                                try {
                                    InputStream in = getS3Instance().getObject(ApplicationProperties.getInstance().getProperty("aws.bucket"), it.getKey()).getObjectContent();
                                    if (in != null) {
                                        @SuppressWarnings("UnstableApiUsage") byte[] bytes = ByteStreams.toByteArray(in);
                                        it.setFile(bytes);
                                    }
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            })
                            .collect(Collectors.toList());

                    try {
                        byte[] bytes = listBytesToZip(collect);

                        var initialStream = new ByteArrayInputStream(bytes);

                        var metadata = new ObjectMetadata();
                        metadata.setContentType("application/zip");

                        var s3Instance = getS3Instance();

                        s3Instance.putObject(new PutObjectRequest(getBucket(), attachment.getKey(), initialStream, metadata));

                        var url = s3Instance.getUrl(getBucket(), attachment.getKey());
                        attachment.setUrl(url.toString());
                        attachment.setProcessed(true);
                        attachment.setFile(null);
                        attachment.setContentType(metadata.getContentType());

                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return attachment;
                })
                .whenCompleteAsync((o, throwable) -> {

                    try {
                        if (throwable == null) {
                            attachment.setProcessed(true);
                            attachment.setFile(null);
                        } else {
                            throwable.printStackTrace();
                            return;
                        }
                        Session session = getSession();
                        var transaction = session.beginTransaction();
                        transaction.begin();
                        session.saveOrUpdate(attachment);
                        transaction.commit();
                        session.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                });
    }

    private List<Attachment> removeDuplicateEntry (List<Attachment> items) {
        Map<String, List<Attachment>> hashItems = items.stream()
                .collect(Collectors.groupingBy(Attachment::getFileName));

        // if have duplicate entry
        if (hashItems.entrySet().stream().anyMatch(entry -> entry.getValue().size() > 1)) {

            List<Attachment> collect = hashItems.entrySet().stream()
                    .peek(entry -> {
                        if (entry.getValue().size() > 1) {
                            for (int i = 1; i < entry.getValue().size(); i++) {
                                var attachment = entry.getValue().get(i);
                                var fileName = attachment.getFileName();
                                var fileExtension = Files.getFileExtension(fileName);
                                fileName = fileName.replace("."+fileExtension, "");
                                var newFileName = String.format("%s (%d).%s", fileName, i, fileExtension);
                                attachment.setFileName(newFileName);
                            }
                        }
                    })
                    .flatMap(entry -> entry.getValue().stream())
                    .collect(Collectors.toList());

            return collect;
        }

        return items;
    }

    protected byte[] listBytesToZip(List<Attachment> items) throws IOException {

        items = removeDuplicateEntry(items);

        var stream = new ByteArrayOutputStream();
        var zos = new ZipOutputStream(stream);
        for (Attachment item : items) {
            if (item.getFile() == null) {
                continue;
            }
            ZipEntry entry = new ZipEntry(item.getFileName());
            entry.setSize(item.getFile().length);
            zos.putNextEntry(entry);
            zos.write(item.getFile());
        }
        zos.closeEntry();
        zos.close();
        return stream.toByteArray();
    }

    public void uploadByAttachmentIds(List<Integer> attachments) {

        attachments
                .forEach(it ->
                        CompletableFuture
                                .supplyAsync(() -> (Attachment) getSession()
                                                .createQuery("select o from Attachment o where o.id = :id")
                                                .setInteger("id", it)
                                                .uniqueResult(),
                                        executor)
                                .thenApply(this::uploadToS3)
                                .whenComplete((attachment, throwable) -> {
                                    try {
                                        if (throwable == null) {
                                            attachment.setProcessed(true);
                                            attachment.setFile(null);
                                        } else {
                                            throwable.printStackTrace();
                                            return;
                                        }
                                        Session session = getSession();
                                        var transaction = session.beginTransaction();
                                        transaction.begin();
                                        session.saveOrUpdate(attachment);
                                        transaction.commit();
                                        session.flush();
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                })
                                .exceptionally(throwable -> null));
    }

    private String filterCharacterSafetyToS3Key(String str) {
        String regex = "[^0-9a-zA-Z!\\-_\\.,\\*\\(\\)]";
        return StringUtils.stripAccents(str).replaceAll(regex, "");
    }

    private String generateDocumentKey(String fileName) {
        return randomAlphanumeric(10)
                .concat("/")
                .concat(randomUUID().toString())
                .concat("/")
                .concat(filterCharacterSafetyToS3Key(fileName));
    }

    private Attachment uploadToS3(Attachment document) {
        if (document == null) {
            throw new IllegalArgumentException("No document found");
        }

        if (document.getFile() == null) {
            return document;
        }
        
        var initialStream = new ByteArrayInputStream(document.getFile());

        var metadata = new ObjectMetadata();
        var mediaType = document.getContentType();

        metadata.setContentType(mediaType);

        var s3Instance = getS3Instance();
        var documentKey = generateDocumentKey(document.getFileName());

        document.setKey(documentKey);

        s3Instance.putObject(new PutObjectRequest(getBucket(), documentKey, initialStream, metadata));
        var url = s3Instance.getUrl(getBucket(), documentKey);

        document.setUrl(url.toString());
        document.setFile(null);
        document.setProcessed(true);

        return document;
    }


    private List<Propriedade> getProps() {
        try {
            var props = new ArrayList<Propriedade>();
            props.add(new Propriedade(Attachment.class.getDeclaredField("id").getName()));
            return props;
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        return new ArrayList<>(1);
    }

    public void migrateToAttachmentEntities() throws Exception {

        var dao = new GenericDao();
        dao.beginTransaction();
        List<MedicoAnexo> nonMigratedMedicalEntities = (List<MedicoAnexo>) getSession()
                .createQuery("select o from MedicoAnexo o where o.base64Anexo <> null and o.attachment is null")
                .setMaxResults(30)
                .list();

        nonMigratedMedicalEntities
                .stream()
                .map(it -> {
                    var attachment = new Attachment();
                    attachment.setFile(it.getBase64Anexo());
                    attachment.setContentType(it.getTipoAnexo());
                    attachment.setProcessed(false);
                    attachment.setName(it.getNomeAnexo());
                    attachment.setFileName(it.getNomeAnexo());
                    attachment.setType(AttachmentType.DOCUMENT);

                    var documentKey = generateDocumentKey(attachment.getFileName());

                    attachment.setKey(documentKey);
                    
                    it.setBase64Anexo(null);
                    getSession().save(attachment);
                    it.setAttachment(attachment);
                    try {
                        dao.persistWithCurrentTransaction(attachment);
                        dao.update(it);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    return attachment;
                })
                .map(this::uploadToS3)
                .filter(Attachment::getProcessed)
                .forEach(it -> {
                    getSession().saveOrUpdate(it);

                });

//        List<Contrato> nonMigrateContractEntities = (List<Contrato>) getSession()
//                .createQuery("select o from Contrato o where o.anexoContrato <> null and o.attachment is null")
//                .setMaxResults(30)
//                .list();

//        nonMigrateContractEntities
//                .stream()
//                .map(it -> {
//                    var attachment = new Attachment();
//                    attachment.setFile(it.getAnexoContrato());
//                    attachment.setContentType(it.getTipoAnexo());
//                    attachment.setProcessed(false);
//                    attachment.setName(it.getNomeAnexo());
//                    attachment.setFileName(it.getNomeAnexo());
//                    attachment.setType(AttachmentType.DOCUMENT);
//
//                    var documentKey = generateDocumentKey(attachment.getFileName());
//
//                    attachment.setKey(documentKey);
//
//                    getSession().save(attachment);
//                    it.setAttachment(attachment);
//                    it.setAnexoContrato(null);
//
//                    try {
//                        dao.persistWithCurrentTransaction(attachment);
//                        dao.update(it);
//                    } catch (Exception e) {
//                        e.printStackTrace();
//                    }
//
//                    return attachment;
//                })
//                .map(this::uploadToS3)
//                .filter(Attachment::getProcessed)
//                .forEach(it -> {
//                    getSession().saveOrUpdate(it);
//                });

        List<ContratoAnexo> nonMigrateContractAttachmentEntities = (List<ContratoAnexo>) getSession()
                .createQuery("select o from ContratoAnexo o where o.base64Anexo <> null and o.attachment is null")
                .setMaxResults(30)
                .list();

        nonMigrateContractAttachmentEntities
                .stream()
                .map(it -> {
                    var attachment = new Attachment();
                    attachment.setFile(it.getBase64Anexo());
                    attachment.setContentType(it.getTipoAnexo());
                    attachment.setProcessed(false);
                    attachment.setName(it.getNomeAnexo());
                    attachment.setFileName(it.getNomeAnexo());
                    attachment.setType(AttachmentType.DOCUMENT);

                    var documentKey = generateDocumentKey(attachment.getFileName());

                    attachment.setKey(documentKey);

                    getSession().save(attachment);
                    it.setAttachment(attachment);
                    it.setBase64Anexo(null);

                    try {
                        dao.persistWithCurrentTransaction(attachment);
                        dao.update(it);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    return attachment;
                })
                .map(this::uploadToS3)
                .filter(Attachment::getProcessed)
                .forEach(it -> {
                    getSession().saveOrUpdate(it);

                });

        dao.commitCurrentTransaction();
    }

    public Attachment generateZipFromType(AttachmentCompressionType type, Optional<Integer> id, String ativo, String status, String estado, String especialidade, List<Integer> medicosId, String startDate, String endDate) throws IllegalArgumentException, IllegalStateException {

        if (type.equals(AttachmentCompressionType.MEDIC)) {

            if (id.isPresent()) {
                var medicId = id.get();

                var prefixName = (String) getSession()
                        .createQuery("select m.nome from Medico m where id = :id")
                        .setInteger("id", medicId)
                        .uniqueResult();

                if (prefixName != null) {
                    prefixName = "Medico-" + prefixName + "-";
                }

                var ids = findIdsByMedic(medicId);

                if (Util.isNullOrEmpty(ids)) {
                    throw new IllegalStateException("Arquivos não encontrado para o médico "+prefixName);
                }

                return generateZipFileFromAttachments(ids, prefixName);
            }
            else {

                var mapDirectoryAttachmentIds = findMapIdsOfAllMedics(ativo, status, estado, especialidade, medicosId, startDate, endDate);

                if (mapDirectoryAttachmentIds == null || mapDirectoryAttachmentIds.size() == 0) {
                    throw new IllegalStateException("Erro ao selecionar todos os arquivos de todos médicos.");
                }

                return generateMapZipFileFromAttachments(mapDirectoryAttachmentIds, "Todos-Medicos-");
            }
        }
        else if (type.equals(AttachmentCompressionType.CONTRACT)) {

            return generateZipFileFromContract(id);
        }

        throw new IllegalArgumentException("Tipo de seleção não encontrado.");
    }

    private Attachment generateZipFileFromContract(Optional<Integer> id) throws IllegalArgumentException, IllegalStateException {

        if (id.isPresent()) {
            var contractId = id.get();

            var prefixName = (String) getSession()
                    .createQuery("select c.contractNumber from Contract c where id = :id")
                    .setInteger("id", contractId)
                    .uniqueResult();

            if (prefixName != null) {
                prefixName = "Contrato-" + prefixName + "-";
            }

            Map<String, List<Integer>> mapDirectoryAttachmentIds = findMapIdsByContract(contractId);

            if (mapDirectoryAttachmentIds == null || mapDirectoryAttachmentIds.size() == 0) {
                throw new IllegalStateException("Arquivos não encontrados pra o contrato " + prefixName);
            }


            return generateMapZipFileFromAttachments(mapDirectoryAttachmentIds, prefixName);
        }
        else {

            throw new IllegalArgumentException("ID do contrato não encontrado.");
        }
    }

    private Map<String, List<Integer>> findMapIdsOfAllMedics(String ativo, String status, String estado, String especialidade, List<Integer> medicosId, String startDate, String endDate) {
        Map<String, List<Integer>> map = new HashMap<>();

        String queryString = "select ma from MedicoAnexo as ma " +
                "join ma.medico m where m.excluido = false ";

        if (medicosId != null && medicosId.size() > 0) {
            queryString += " and m.id in :medicosId";
        }

        if (ativo != null) {
            queryString += " and m.ativo = " + ativo.equals("ATIVOS");
        }

        if (status != null) {
            queryString += " and m.status = '" + status + "'";
        }

        if (estado != null) {
            queryString += " and m.ufConselhoMedico = '" + estado + "'";
        }

        if (especialidade != null) {
            queryString += " and m.id in (select me.medico.id from MedicoEspecialidade me where me.especialidade.descricao = '" + especialidade + "')";
        }

        if (startDate != null) {
            queryString += " and m.dataUsuarioInc >= '" + startDate + "'";
        }

        if (endDate != null) {
            queryString += " and m.dataUsuarioInc <= '" + endDate + "'";
        }

        Query query = getSession()
                .createQuery(queryString);
        if (medicosId != null && medicosId.size() > 0) {
            query.setParameterList("medicosId", medicosId);
        }

        var allMedicAttachments = (List<MedicoAnexo>) query
            .list();

        allMedicAttachments.stream()
                .filter(medicoAnexo -> medicoAnexo.getAttachment() != null && medicoAnexo.getBase64Anexo() == null)
                .collect(Collectors.groupingBy(it -> it.getMedico()))
                .forEach((medic, medicAttachments) -> {
                    var attachments = medicAttachments.stream().map(MedicoAnexo::getAttachment).collect(Collectors.toList());
                    attachments = removeDuplicateEntry(attachments);

                    var medicName = medic.getNome();
                    if (map.containsKey(medicName)) {
                        medicName = findNameAvailable(map, medicName);
                    }
                    map.put(medicName, attachments.stream().map(Attachment::getId).collect(Collectors.toList()));
                });

        return map;
    }

    private List<Integer> findIdsByMedic(Integer medicId) {

        return (List<Integer>) getSession()
            .createQuery(
                "select a.id from MedicoAnexo as ma inner join ma.attachment as a where " +
                "ma.excluido = false and ma.medico.id = :id")
            .setInteger("id", medicId)
            .list();
    }

    private Map<String, List<Integer>> findMapIdsByContract(Integer contractId) {
        Map<String, List<Integer>> map = new HashMap<>();

        var id = (Integer) getSession()
            .createQuery("select a.id from Attachment a where id in " +
                "(select c.attachment.id from Contract c where c.id = :id)")
            .setInteger("id", contractId)
            .uniqueResult();

        var idsContract = new ArrayList<Integer>();
        Optional.ofNullable(id).ifPresent(it -> idsContract.add(it));


        var idsContractAttachments = (List<Integer>) getSession()
            .createQuery("select a.id from ContratoAnexo ca inner join ca.attachment a where " +
                    "ca.excluido = false and ca.contrato.id = :id")
            .setInteger("id", contractId)
            .list();
        idsContract.addAll(idsContractAttachments.stream().filter(it -> it != null).collect(Collectors.toList()));
        map.put("", idsContract);

        var allMedicAttachments = (List<MedicoAnexo>) getSession()
            .createQuery("select ma from BloqueioMedicoContrato bmc, MedicoAnexo ma where " +
                "ma.excluido = false and bmc.medico.id = ma.medico.id and bmc.contrato.id = :id")
            .setInteger("id", contractId)
            .list();

        allMedicAttachments.stream()
                .filter(medicoAnexo -> medicoAnexo.getAttachment() != null && medicoAnexo.getBase64Anexo() == null)
                .collect(Collectors.groupingBy(it -> it.getMedico()))
                .forEach((medic, medicAttachments) -> {
                    var attachments = medicAttachments.stream().map(MedicoAnexo::getAttachment).collect(Collectors.toList());
                    attachments = removeDuplicateEntry(attachments);

                    var medicName = medic.getNome();
                    if (map.containsKey(medicName)) {
                        medicName = findNameAvailable(map, medicName);
                    }
                    map.put(medicName, attachments.stream().map(Attachment::getId).collect(Collectors.toList()));
                });

        return map;
    }

    private String findNameAvailable(Map<String, List<Integer>> map, String medicName) {
        return findNameAvailable(map, medicName, 1);
    }

    private String findNameAvailable(Map<String, List<Integer>> map, String medicName, int count) {

        String availableName = String.format("%s (%d)", medicName, count);

        if (!map.containsKey(availableName)) {
            return availableName;
        }

        return findNameAvailable(map, medicName, count + 1);
    }

}
