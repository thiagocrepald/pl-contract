import React, { useState, useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Row } from 'reactstrap';
import AnexoImg from '../../../../assets/img/svg/anexo.svg';
import CloseImg from '../../../../assets/img/svg/fechar-gray.svg';
import UploadImg from '../../../../assets/img/svg/upload-file.svg';
import ShowFileContainer from '../../../../components/download-container/download-container';
import { Document } from '../../../../model/document';
import '../../../../components/main.scss';
import { Contract } from '../../../../model/contract';
import { ContractAttachmentType } from '../../../../model/enums/contract-attachment-type';
import '../contract-register.scss';

interface Props {
    contract: Contract;
    setContract: (contract: Contract) => void;
}

export const FilesForm = (props: Props) => {
    const { setContract, contract } = props;
    const { t } = useTranslation();
    const i18nDefaultPath = 'contractRegister.body.files';
    const [uploadedAttachments, setUploadedAttachments] = useState<Document[]>([]);
    const [uploadedInformations, setUploadedInformations] = useState<Document[]>([]);
    const [draggedFile, setDraggedFile] = useState<any>({});
    const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

    const dropRef = useRef() as React.MutableRefObject<HTMLDivElement>;
    const dropRefInfo = useRef() as React.MutableRefObject<HTMLDivElement>;
    const [dragging, setDragging] = useState<boolean>(false);
    const [draggingInfo, setDraggingInfo] = useState<boolean>(false);
    const [dragCounter, setDragCounter] = useState<number>(0);
    const [newFilesList, setNewFilesList] = useState<any>([]);
    const [newFileName, setNewFileName] = useState<string>('');

    useEffect(() => {
        getUploadedFiles();
        setNewFilesList([...contract.contractAttachments!]);
    }, []);

    useEffect(() => {
        getUploadedFiles();
        setNewFilesList([...contract.contractAttachments!]);
    }, [contract]);

    useEffect(() => {
        if (shouldUpdate && !isEmpty(draggedFile)) {
            setShouldUpdate(false);
            const files = [...newFilesList, draggedFile];
            setContract({ ...contract, contractAttachments: files });
            setDraggedFile({});
            setNewFileName('');
        } else if (!isEmpty(draggedFile)) {
            handleNewFileName(draggedFile.attachment.fileName);
        }
    }, [draggedFile]);

    useEffect(() => {
        if (!isEmpty(newFileName) && !isEmpty(draggedFile)) {
            setShouldUpdate(true);
            setDraggedFile({ ...draggedFile, attachment: { ...draggedFile.attachment, fileName: newFileName } });
        }
    }, [newFileName]);

    const handleDrag = e => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(dragCounter + 1);
    };

    const handleDragIn = e => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(dragCounter + 1);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragging(true);
        }
    };

    const handleDragInInfo = e => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(dragCounter + 1);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDraggingInfo(true);
        }
    };

    const handleDragOut = e => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(dragCounter - 1);
        if (dragCounter === 0) {
            setDragging(false);
        }
    };

    const handleDragOutInfo = e => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(dragCounter - 1);
        if (dragCounter === 0) {
            setDraggingInfo(false);
        }
    };

    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUploadDraggedFile(e, ContractAttachmentType.CONTRACT_ATTACHMENT);
            setDragCounter(0);
            // firefox does not support modifications after dragging
            // e.dataTransfer.clearData();
        }
    };

    const handleDropInfo = e => {
        e.preventDefault();
        e.stopPropagation();
        setDraggingInfo(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUploadDraggedFile(e, ContractAttachmentType.CONTRACT_INFORMATION);
            setDragCounter(0);
            // firefox does not support modifications after dragging
            // e.dataTransfer.clearData();
        }
    };

    useEffect(() => {
        dropRef.current.addEventListener('dragenter', handleDragIn);
        dropRef.current.addEventListener('dragleave', handleDragOut);
        dropRef.current.addEventListener('dragover', handleDrag);
        dropRef.current.addEventListener('drop', handleDrop);

        dropRefInfo.current.addEventListener('dragenter', handleDragInInfo);
        dropRefInfo.current.addEventListener('dragleave', handleDragOutInfo);
        dropRefInfo.current.addEventListener('dragover', handleDrag);
        dropRefInfo.current.addEventListener('drop', handleDropInfo);

        return () => {
            dropRef.current.removeEventListener('dragenter', handleDragIn);
            dropRef.current.removeEventListener('dragleave', handleDragOut);
            dropRef.current.removeEventListener('dragover', handleDrag);
            dropRef.current.removeEventListener('drop', handleDrop);

            dropRefInfo.current.removeEventListener('dragenter', handleDragInInfo);
            dropRefInfo.current.removeEventListener('dragleave', handleDragOutInfo);
            dropRefInfo.current.removeEventListener('dragover', handleDrag);
            dropRefInfo.current.removeEventListener('drop', handleDropInfo);
        };
    }, []);

    const onUploadFile = (event: any, label: string) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile == null) return;
        const reader = new FileReader();

        reader.onload = (ev: any) => {
            if (label === 'attachment') {
                newFilesList.push({
                    attachment: {
                        id: undefined,
                        fileName: handleNewFileName(uploadedFile.name),
                        contentType: uploadedFile.type,
                        file: ev.target.result.split(',')[1]
                    },
                    contractAttachmentType: ContractAttachmentType.CONTRACT_ATTACHMENT
                });
            } else {
                newFilesList.push({
                    attachment: {
                        id: undefined,
                        fileName: handleNewFileName(uploadedFile.name),
                        contentType: uploadedFile.type,
                        file: ev.target.result.split(',')[1]
                    },
                    contractAttachmentType: ContractAttachmentType.CONTRACT_INFORMATION
                });
            }
            setContract({ ...contract, contractAttachments: newFilesList });
        };
        reader.readAsDataURL(uploadedFile);
        event.target.value = null;
    };

    const onUploadDraggedFile = (event: any, label: string) => {
        const uploadedFile = event.dataTransfer.files[0];
        if (uploadedFile == null) return;
        const reader = new FileReader();

        reader.onload = (ev: any) => {
            let newFile = {};

            newFile = {
                attachment: {
                    id: undefined,
                    fileName: uploadedFile.name,
                    contentType: uploadedFile.type,
                    file: ev.target.result.split(',')[1]
                },
                contractAttachmentType: label
            };
            setDraggedFile(newFile);
        };
        reader.readAsDataURL(uploadedFile);

        setDragging(false);
        setDraggingInfo(false);
    };

    const handleNewFileName = (name: string) => {
        const counter = newFilesList.filter(attachment => attachment.attachment.fileName === name).length;

        if (counter === 0) {
            setNewFileName(name);
            return name;
        }

        if (counter > 0) {
            const partialName = name
                .split('.')
                .slice(0, -1)
                .join('.');
            const re = new RegExp('^.*_[1-9][0-9]?$');
            let newName: string = '';

            if (re.test(partialName)) {
                const index = partialName.split('_').slice(-1)[0];
                newName = `${name
                    .split('_')
                    .slice(0, -1)
                    .join('_')}_${parseInt(index) + 1}.${name.split('.').slice(-1)}`;
            } else {
                newName = `${name
                    .split('.')
                    .slice(0, -1)
                    .join('.')}_${counter}.${name.split('.').slice(-1)}`;
            }

            return handleNewFileName(newName);
        }
    };

    const onRemoveFile = (file: Document, type: string) => {
        const newAttachments = newFilesList?.filter(attachment => attachment.attachment.fileName !== file.fileName);
        if (newAttachments) {
            setContract({ ...contract, contractAttachments: newAttachments });
        }
    };

    const showUploadedName = (type: ContractAttachmentType) => {
        if (type === ContractAttachmentType.CONTRACT_ATTACHMENT) {
            const attachment = contract?.contractAttachments?.filter(it => it.contractAttachmentType === ContractAttachmentType.CONTRACT_ATTACHMENT)[0];
            if (attachment == null) {
                return t(`${i18nDefaultPath}.textField.attach`);
            }
            return attachment.attachment?.fileName;
        }
        const information = contract?.contractAttachments?.filter(
            attachment => attachment.contractAttachmentType === ContractAttachmentType.CONTRACT_INFORMATION
        )[0];
        if (information == null) {
            return t(`${i18nDefaultPath}.textField.attachContract`);
        }
        return information.attachment?.fileName;
    };

    const getUploadedFiles = () => {
        const filteredAttachments = contract?.contractAttachments?.filter(item => item.contractAttachmentType === ContractAttachmentType.CONTRACT_ATTACHMENT);
        if (filteredAttachments) {
            const attachmentsList: any[] = [];
            for (let i = 0; i < filteredAttachments!.length; i++) {
                attachmentsList.push(filteredAttachments[i].attachment);
            }
            setUploadedAttachments(attachmentsList);
        } else {
            setUploadedAttachments([]);
        }

        const filteredInformations = contract?.contractAttachments?.filter(item => item.contractAttachmentType === ContractAttachmentType.CONTRACT_INFORMATION);
        if (filteredInformations) {
            const informationsList: any[] = [];
            for (let i = 0; i < filteredInformations!.length; i++) {
                informationsList.push(filteredInformations[i].attachment);
            }
            setUploadedInformations(informationsList);
        } else {
            setUploadedInformations([]);
        }
    };

    return (
        <>
            <div className="contract-register__container--body-title">{t(`${i18nDefaultPath}.title`)}</div>
            <Row>
                <div id="attachment" className="contract-request__fileUpload" ref={dropRef}>
                    {dragging && (
                        <div className="contract-request__fileUpload--drag-box-wrapper">
                            <div className="contract-request__fileUpload--drag-box-content">
                                <div className="contract-request__fileUpload--drag-box-icon">
                                    <img alt="upload" style={{ width: '24px' }} src={UploadImg} />
                                </div>
                            </div>
                        </div>
                    )}
                    {uploadedAttachments ? (
                        <div
                            className={dragging ? 'disabled contract-register__fileUpload--wrapper' : 'contract-register__fileUpload--wrapper'}
                            style={{ display: 'flex', width: '100%' }}
                        >
                            <p className={dragging ? 'disabled contract-request__fileUpload--label-upper' : 'contract-request__fileUpload--label-upper'}>
                                {t(`${i18nDefaultPath}.textField.attach`)}
                            </p>
                            {uploadedAttachments.map((item, index) => (
                                <div key={index} className={dragging ? 'disabled contract-request__fileUpload--tag' : 'contract-request__fileUpload--tag'}>
                                    <ShowFileContainer<Document> item={item}>
                                        <span style={{ paddingRight: '32px', marginLeft: '0px' }}>{item.fileName ?? ''}</span>
                                    </ShowFileContainer>
                                    <span
                                        className="contract-request__fileUpload--tag-delete"
                                        onClick={() => onRemoveFile(item, ContractAttachmentType.CONTRACT_ATTACHMENT)}
                                    >
                                        <img alt="close" style={{ width: '16px' }} src={CloseImg} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        showUploadedName(ContractAttachmentType.CONTRACT_ATTACHMENT)
                    )}
                    <label htmlFor="upload1" style={{ width: '85px' }}>
                        <div className={dragging ? 'disabled contract-request__fileUpload--upload-button' : 'contract-request__fileUpload--upload-button'}>
                            <input id="upload1" onChange={e => onUploadFile(e, 'attachment')} type={'file'} multiple={false} />
                            <img className="anexo-img" alt={'upload'} src={AnexoImg} />
                            {t(`${i18nDefaultPath}.textField.button`)}
                        </div>
                    </label>
                </div>
            </Row>
            <Row>
                <div id="contractInformation" className="contract-request__fileUpload" ref={dropRefInfo}>
                    {draggingInfo && (
                        <div className="contract-request__fileUpload--drag-box-wrapper">
                            <div className="contract-request__fileUpload--drag-box-content">
                                <div className="contract-request__fileUpload--drag-box-icon">
                                    <img alt="upload" style={{ width: '24px' }} src={UploadImg} />
                                </div>
                            </div>
                        </div>
                    )}
                    {uploadedInformations ? (
                        <div
                            className={draggingInfo ? 'disabled contract-register__fileUpload--wrapper' : 'contract-register__fileUpload--wrapper'}
                            style={{ display: 'flex', width: '100%' }}
                        >
                            <p className={draggingInfo ? 'disabled contract-request__fileUpload--label-upper' : 'contract-request__fileUpload--label-upper'}>
                                {t(`${i18nDefaultPath}.textField.attachContract`)}
                            </p>
                            {uploadedInformations.map((item, index) => (
                                <div key={index} className={draggingInfo ? 'disabled contract-request__fileUpload--tag' : 'contract-request__fileUpload--tag'}>
                                    <ShowFileContainer<Document> item={item}>
                                        <span style={{ paddingRight: '32px', marginLeft: '0px' }}>{item.fileName ?? ''}</span>
                                    </ShowFileContainer>
                                    <span
                                        className="contract-request__fileUpload--tag-delete"
                                        onClick={() => onRemoveFile(item, ContractAttachmentType.CONTRACT_INFORMATION)}
                                    >
                                        <img alt="close" style={{ width: '16px' }} src={CloseImg} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        showUploadedName(ContractAttachmentType.CONTRACT_INFORMATION)
                    )}
                    <label htmlFor="upload2" style={{ width: '85px' }}>
                        <div className={draggingInfo ? 'disabled contract-request__fileUpload--upload-button' : 'contract-request__fileUpload--upload-button'}>
                            <input id="upload2" onChange={e => onUploadFile(e, 'contractInformation')} type={'file'} multiple={false} />
                            <img className="anexo-img" alt={'upload'} src={AnexoImg} />
                            {t(`${i18nDefaultPath}.textField.button`)}
                        </div>
                    </label>
                </div>
            </Row>
        </>
    );
};
