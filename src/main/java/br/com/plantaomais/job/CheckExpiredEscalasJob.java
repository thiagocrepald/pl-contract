package br.com.plantaomais.job;

import br.com.plantaomais.config.ApplicationProperties;
import br.com.plantaomais.controller.EscalaController;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CheckExpiredEscalasJob implements Job {

    @Context
    private SecurityContext context;

    Logger log = Logger.getLogger("CheckExpiredEscalasJob");

    @SuppressWarnings("RedundantThrows")
    @Override
    public void execute(JobExecutionContext pArg0) throws JobExecutionException {

        if (ApplicationProperties.jobsBlocked()) {
            log.log(Level.INFO, "jobs are blocked");
            return;
        }

        try {
            log.log(Level.INFO, "ExpiredEscalasJob initiated");
            new EscalaController().checarEscalasExpiradas();

        } catch (Exception ex) {
            log.log(Level.WARNING, "ExpiredEscalasJob");
        }

    }

}
