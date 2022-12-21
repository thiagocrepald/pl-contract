CREATE TABLE `PIX` (
                                `ID` int(11) NOT NULL AUTO_INCREMENT,
                                `PIX_KEY` varchar(50) DEFAULT NULL,
                                `PIX_KEY_TYPE` varchar(50) DEFAULT NULL,
                                PRIMARY KEY (`ID`)
);

alter table PAYMENT_DATA
    add PIX_ID int default null null;

alter table PAYMENT_DATA
    add constraint FK_PAYMENT_DATA_PIX_ID
        foreign key (PIX_ID) references PIX (ID);