package br.com.plantaomais.job;

import br.com.plantaomais.config.ApplicationProperties;
import br.com.plantaomais.controller.AttachmentController;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.util.logging.Level;
import java.util.logging.Logger;

public class MigrateAttachmentsJob implements Job {

    Logger log = Logger.getLogger("MigrateAttachmentsJob");

    @SuppressWarnings("RedundantThrows")
    @Override
    public void execute(JobExecutionContext pArg0) throws JobExecutionException {
        if (ApplicationProperties.jobsBlocked()) {
            log.log(Level.INFO, "jobs are blocked");
            return;
        }

        try {
            Thread.sleep(10000);
            log.log(Level.INFO, "MigrateAttachmentsJob initiated");
            new AttachmentController().migrateToAttachmentEntities();
        } catch (Exception ex) {
            log.log(Level.SEVERE, ex.getMessage(), ex);
        }

    }

}
