CREATE TABLE `PAYMENT_DATA` (
                                `ID` int(11) NOT NULL AUTO_INCREMENT,
                                `BANK` varchar(50) DEFAULT NULL,
                                `AGENCY` varchar(50) DEFAULT NULL,
                                `TRANSACTION` varchar(50) DEFAULT NULL,
                                `BANK_ACCOUNT` varchar(50) DEFAULT NULL,
                                `CPF` varchar(50) DEFAULT NULL,
                                `CNPJ` varchar(50) DEFAULT NULL,
                                `ACCOUNT_OWNER_NAME` varchar(50) DEFAULT NULL,
                                `PIS_NUMBER` varchar(50) DEFAULT NULL,
                                `PAYMENT_TYPE` varchar(50) NOT NULL,
                                `IS_COMPANY_ACCOUNT` bit(1) NOT NULL,
                                `MEDIC_ID` int(11) NOT NULL,
                                PRIMARY KEY (`ID`)
);

alter table PAYMENT_DATA
    add constraint FK_PAYMENT_DATA_MEDIC_ID
        foreign key (MEDIC_ID) references MEDICO (ID);