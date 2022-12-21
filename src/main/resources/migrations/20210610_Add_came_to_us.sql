CREATE TABLE CAME_TO_US (
                            ID bigint(11) NOT NULL AUTO_INCREMENT,
                            GOOGLE_OR_SITE bit(1) NOT NULL,
                            RECRUITMENT bit(1) NOT NULL,
                            COLLEAGUE_INDICATION bit(1) NOT NULL,
                            PROVIDE_SERVICE_AT_WORK bit(1) NOT NULL,
                            SOCIAL_MEDIA bit(1) NOT NULL,
                            OTHER bit(1) NOT NULL,
                            RECRUITER_NAME varchar(255) NULL,
                            OTHER_DESCRIPTION longtext NULL,
                            MEDIC_ID bigint(11) NOT NULL,
                            PRIMARY KEY (ID)

);

alter table CAME_TO_US
    add constraint FK_CAME_TO_US_MEDIC_ID
        foreign key (MEDIC_ID) references MEDICO (ID);

ALTER TABLE CAME_TO_US
    ADD CONSTRAINT UNQ_CAME_TO_US_MEDIC_ID UNIQUE (MEDIC_ID);
