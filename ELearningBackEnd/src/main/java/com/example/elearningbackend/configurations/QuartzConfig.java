package com.example.elearningbackend.configurations;

import com.example.elearningbackend.job.CleanupBackupJob;
import com.example.elearningbackend.job.DatabaseBackupJob;
import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail backupJobDetail() {
        return JobBuilder.newJob(DatabaseBackupJob.class)
                .withIdentity("DatabaseBackupJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger backupJobTrigger() {
        return TriggerBuilder.newTrigger()
                .forJob(backupJobDetail())
                .withIdentity("BackupTrigger")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 0 1 * * ?"))
                .build();
    }

    @Bean
    public JobDetail cleanupJobDetail() {
        return JobBuilder.newJob(CleanupBackupJob.class)
                .withIdentity("CleanupJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger cleanupJobTrigger() {
        return TriggerBuilder.newTrigger()
                .forJob(cleanupJobDetail())
                .withIdentity("CleanupTrigger")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 0 9 * * ?"))
                .build();
    }


    @Bean
    public Scheduler scheduler() throws Exception {
        SchedulerFactory schedulerFactory = new StdSchedulerFactory();
        Scheduler scheduler = schedulerFactory.getScheduler();

        if (!scheduler.isStarted()) {
            scheduler.start();
        }

        scheduler.scheduleJob(backupJobDetail(), backupJobTrigger());
        scheduler.scheduleJob(cleanupJobDetail(), cleanupJobTrigger());




        return scheduler;
    }

}
