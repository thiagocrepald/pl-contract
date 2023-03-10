ALTER TABLE CURSO
CHANGE COLUMN `DESCRICAO` `NOME` VARCHAR(255) NULL DEFAULT NULL ;

ALTER TABLE `CURSO`
DROP COLUMN `DATA_VENCIMENTO`;

ALTER TABLE `MEDICO_CURSO`
ADD COLUMN `DATA_VENCIMENTO` DATETIME NOT NULL AFTER `CURSO_ID`;

ALTER TABLE `MEDICO_ANEXO`
CHANGE COLUMN `CURSO_ID` `MEDICO_CURSO_ID` INT(11) NULL DEFAULT NULL ;

INSERT INTO CURSO
(DATA_USUARIO_ALT, DATA_USUARIO_INC, USUARIO_ALT, USUARIO_INC, EXCLUIDO, NOME) VALUES
(now(), now(), 'sistema', 'sistema', b'0', 'ATLS'),
(now(), now(), 'sistema', 'sistema', b'0', 'ACLS'),
(now(), now(), 'sistema', 'sistema', b'0', 'SAVE'),
(now(), now(), 'sistema', 'sistema', b'0', 'PALS');
