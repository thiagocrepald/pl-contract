CREATE TABLE `installation` (
                `ID` int(11) NOT NULL AUTO_INCREMENT,
                `alias` varchar(255) DEFAULT NULL,
                `device_token` varchar(255) NOT NULL,
                `device_type` varchar(255) DEFAULT NULL,
                `os_version` varchar(255) DEFAULT NULL,
                `platform` varchar(255) NOT NULL,
                `MEDIC_ID` int(11) NOT NULL,
                PRIMARY KEY (`ID`)
);

alter table installation
    add constraint FK_INSTALLATION_MEDIC_ID
        foreign key (MEDIC_ID) references MEDICO (ID);
