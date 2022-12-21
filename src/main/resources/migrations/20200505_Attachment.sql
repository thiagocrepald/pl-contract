CREATE TABLE `ATTACHMENT` (
                                `ID` int(11) NOT NULL AUTO_INCREMENT,
                                `CONTENT_TYPE` varchar(20) DEFAULT NULL,
                                `ATTACHMENT_TYPE` varchar(200) DEFAULT NULL,
                                `NAME` varchar(512) DEFAULT NULL,
                                `FILE_NAME` varchar(512) DEFAULT NULL,
                                `URL` varchar(512) DEFAULT NULL,
                                `ATTACHMENT_KEY` varchar(512) DEFAULT NULL,
                                `PROCESSED` bit(1) DEFAULT NULL,
                                `DOCUMENT_FILE` longblob,
                                PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


alter table CONTRATO_ANEXO
    add ATTACHMENT_ID int default null null;

alter table CONTRATO_ANEXO
    add constraint FK_ATTACHMENT_ID
        foreign key (ATTACHMENT_ID) references ATTACHMENT (ID);


alter table MEDICO_ANEXO
    add ATTACHMENT_ID int default null null;

alter table MEDICO_ANEXO
    add constraint FK_MEDICO_ANEXO_ATTACHMENT_ID
        foreign key (ATTACHMENT_ID) references ATTACHMENT (ID);


alter table MEDICO
    add ATTACHMENT_ID int default null null;

alter table MEDICO
    add constraint FK_MEDICO_ATTACHMENT_ID
        foreign key (ATTACHMENT_ID) references ATTACHMENT (ID);


alter table CONTRATO
    add ATTACHMENT_ID int(11) default null null;

alter table CONTRATO
    add constraint FK_CONTRATO_ATTACHMENT_ID
        foreign key (ATTACHMENT_ID) references ATTACHMENT (ID);


