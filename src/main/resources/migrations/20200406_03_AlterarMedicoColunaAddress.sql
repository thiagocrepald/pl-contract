ALTER TABLE `bd_plantaomais`.`MEDICO`
ADD COLUMN `ADDRESS_ID` BIGINT(20) NULL AFTER `VERSAO_LOGIN`, ADD INDEX `FK_MEDICO_ADDRESS_idx` (`ADDRESS_ID` ASC);

ALTER TABLE `bd_plantaomais`.`MEDICO`
ADD CONSTRAINT `FK_MEDICO_ADDRESS` FOREIGN KEY (`ADDRESS_ID`) REFERENCES `bd_plantaomais`.`ADDRESS` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
