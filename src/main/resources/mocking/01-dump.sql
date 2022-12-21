# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.23)
# Database: bd_plantaomais
# Generation Time: 2020-02-28 15:26:01 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table BLOQUEIO_MEDICO_ESCALA
# ------------------------------------------------------------

DROP TABLE IF EXISTS `BLOQUEIO_MEDICO_ESCALA`;

CREATE TABLE `BLOQUEIO_MEDICO_ESCALA` (
                                          `ID` int(11) NOT NULL AUTO_INCREMENT,
                                          `MEDICO_ID` int(11) NOT NULL,
                                          `ESCALA_ID` int(11) NOT NULL,
                                          PRIMARY KEY (`ID`),
                                          KEY `FKD8D27B9AD0410793` (`ESCALA_ID`),
                                          KEY `FKD8D27B9A130AA293` (`MEDICO_ID`),
                                          CONSTRAINT `FKD8D27B9A130AA293` FOREIGN KEY (`MEDICO_ID`) REFERENCES `MEDICO` (`ID`),
                                          CONSTRAINT `FKD8D27B9AD0410793` FOREIGN KEY (`ESCALA_ID`) REFERENCES `ESCALA` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table CAMPO_ANEXO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `CAMPO_ANEXO`;

CREATE TABLE `CAMPO_ANEXO` (
                               `ID` int(11) NOT NULL AUTO_INCREMENT,
                               `DESCRICAO` varchar(255) DEFAULT NULL,
                               `ORDEM` int(11) DEFAULT NULL,
                               PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table CANDIDATO_PLANTAO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `CANDIDATO_PLANTAO`;

CREATE TABLE `CANDIDATO_PLANTAO` (
                                     `ID` int(11) NOT NULL AUTO_INCREMENT,
                                     `MEDICO_ID` int(11) NOT NULL,
                                     `PLANTAO_ID` int(11) NOT NULL,
                                     `DATA_CANDIDATURA` datetime DEFAULT NULL,
                                     `DOACAO` bit(1) DEFAULT NULL,
                                     `ACEITO` bit(1) DEFAULT NULL,
                                     `CANCELADO` bit(1) DEFAULT NULL,
                                     `USUARIO_INC` longtext NOT NULL,
                                     `USUARIO_ALT` longtext NOT NULL,
                                     `USUARIO_DEL` longtext,
                                     `DATA_USUARIO_INC` datetime NOT NULL,
                                     `DATA_USUARIO_ALT` datetime NOT NULL,
                                     `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                                     `EXCLUIDO` bit(1) NOT NULL,
                                     PRIMARY KEY (`ID`),
                                     KEY `FK220312E7130AA293` (`MEDICO_ID`),
                                     KEY `FK220312E7D0A1C4C1` (`PLANTAO_ID`),
                                     CONSTRAINT `FK220312E7130AA293` FOREIGN KEY (`MEDICO_ID`) REFERENCES `MEDICO` (`ID`),
                                     CONSTRAINT `FK220312E7D0A1C4C1` FOREIGN KEY (`PLANTAO_ID`) REFERENCES `PLANTAO` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table CONFIGURACAO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `CONFIGURACAO`;

CREATE TABLE `CONFIGURACAO` (
                                `ID` int(11) NOT NULL AUTO_INCREMENT,
                                `TIPO_CONFIGURACAO_ID` int(11) NOT NULL,
                                `USUARIO_ID` int(11) NOT NULL,
                                PRIMARY KEY (`ID`),
                                KEY `FKCFE681AF246288A1` (`USUARIO_ID`),
                                KEY `FKCFE681AFB9FDF7DC` (`TIPO_CONFIGURACAO_ID`),
                                CONSTRAINT `FKCFE681AF246288A1` FOREIGN KEY (`USUARIO_ID`) REFERENCES `USUARIO` (`ID`),
                                CONSTRAINT `FKCFE681AFB9FDF7DC` FOREIGN KEY (`TIPO_CONFIGURACAO_ID`) REFERENCES `TIPO_CONFIGURACAO` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table CONTRATANTE
# ------------------------------------------------------------

DROP TABLE IF EXISTS `CONTRATANTE`;

CREATE TABLE `CONTRATANTE` (
                               `ID` int(11) NOT NULL AUTO_INCREMENT,
                               `NOME_CONTRATANTE` varchar(100) DEFAULT NULL,
                               `CNPJ` varchar(18) DEFAULT NULL,
                               `CIDADE` varchar(50) DEFAULT NULL,
                               `UF` varchar(10) DEFAULT NULL,
                               `USUARIO_INC` longtext NOT NULL,
                               `USUARIO_ALT` longtext NOT NULL,
                               `USUARIO_DEL` longtext,
                               `DATA_USUARIO_INC` datetime NOT NULL,
                               `DATA_USUARIO_ALT` datetime NOT NULL,
                               `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                               `EXCLUIDO` bit(1) NOT NULL,
                               PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table CONTRATO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `CONTRATO`;

CREATE TABLE `CONTRATO` (
                            `ID` int(11) NOT NULL AUTO_INCREMENT,
                            `CONTRATANTE_ID` int(11) DEFAULT NULL,
                            `TIPO_SERVICO_ID` int(11) DEFAULT NULL,
                            `NOME_CONTRATO` varchar(255) DEFAULT NULL,
                            `CODIGO` varchar(100) NOT NULL,
                            `CONTRATADA` varchar(200) NOT NULL,
                            `DATA_VIGENCIA` datetime DEFAULT NULL,
                            `DATA_VIGENCIA_INICIO` datetime DEFAULT NULL,
                            `DATA_VIGENCIA_FIM` datetime DEFAULT NULL,
                            `LOCAL` varchar(200) NOT NULL,
                            `CIDADE` varchar(100) NOT NULL,
                            `ESTADO` varchar(100) NOT NULL,
                            `NOME_ANEXO` varchar(200) DEFAULT NULL,
                            `TIPO_ANEXO` varchar(20) DEFAULT NULL,
                            `ANEXO_CONTRATO` longblob,
                            `TAMANHO_ANEXO` varchar(50) DEFAULT NULL,
                            `OBSERVACAO` varchar(100) NOT NULL,
                            `USUARIO_INC` longtext NOT NULL,
                            `USUARIO_ALT` longtext NOT NULL,
                            `USUARIO_DEL` longtext,
                            `DATA_USUARIO_INC` datetime NOT NULL,
                            `DATA_USUARIO_ALT` datetime NOT NULL,
                            `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                            `EXCLUIDO` bit(1) NOT NULL,
                            PRIMARY KEY (`ID`),
                            KEY `FKCDB031CE471E41` (`CONTRATANTE_ID`),
                            KEY `FKCDB031C7CDA2398` (`TIPO_SERVICO_ID`),
                            CONSTRAINT `FKCDB031C7CDA2398` FOREIGN KEY (`TIPO_SERVICO_ID`) REFERENCES `TIPO_SERVICO` (`ID`),
                            CONSTRAINT `FKCDB031CE471E41` FOREIGN KEY (`CONTRATANTE_ID`) REFERENCES `CONTRATANTE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table ESCALA
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ESCALA`;

CREATE TABLE `ESCALA` (
                          `ID` int(11) NOT NULL AUTO_INCREMENT,
                          `CONTRATO_ID` int(11) DEFAULT NULL,
                          `USUARIO_ID` int(11) DEFAULT NULL,
                          `NOME_ESCALA` varchar(100) NOT NULL,
                          `PERIODO_INICIO` datetime DEFAULT NULL,
                          `PERIODO_FIM` datetime DEFAULT NULL,
                          `PREVISAO_PAGAMENTO` datetime DEFAULT NULL,
                          `USUARIO_INC` longtext NOT NULL,
                          `USUARIO_ALT` longtext NOT NULL,
                          `USUARIO_DEL` longtext,
                          `DATA_USUARIO_INC` datetime NOT NULL,
                          `DATA_USUARIO_ALT` datetime NOT NULL,
                          `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                          `EXCLUIDO` bit(1) NOT NULL,
                          PRIMARY KEY (`ID`),
                          KEY `FK7A6F74018CDDF373` (`CONTRATO_ID`),
                          KEY `FK7A6F7401246288A1` (`USUARIO_ID`),
                          CONSTRAINT `FK7A6F7401246288A1` FOREIGN KEY (`USUARIO_ID`) REFERENCES `USUARIO` (`ID`),
                          CONSTRAINT `FK7A6F74018CDDF373` FOREIGN KEY (`CONTRATO_ID`) REFERENCES `CONTRATO` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table ESPECIALIDADE
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ESPECIALIDADE`;

CREATE TABLE `ESPECIALIDADE` (
                                 `ID` int(11) NOT NULL AUTO_INCREMENT,
                                 `DESCRICAO` varchar(255) DEFAULT NULL,
                                 `USUARIO_INC` longtext NOT NULL,
                                 `USUARIO_ALT` longtext NOT NULL,
                                 `USUARIO_DEL` longtext,
                                 `DATA_USUARIO_INC` datetime NOT NULL,
                                 `DATA_USUARIO_ALT` datetime NOT NULL,
                                 `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                                 `EXCLUIDO` bit(1) NOT NULL,
                                 PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table MEDICO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `MEDICO`;

CREATE TABLE `MEDICO` (
                          `ID` int(11) NOT NULL AUTO_INCREMENT,
                          `NOME` varchar(100) NOT NULL,
                          `EMAIL` varchar(100) NOT NULL,
                          `SENHA` varchar(100) NOT NULL,
                          `VALIDADO` bit(1) DEFAULT NULL,
                          `EMAIL_VALIDADO` bit(1) DEFAULT NULL,
                          `OBSERVACOES_VALIDACAO` varchar(200) DEFAULT NULL,
                          `IS_CADASTRO_COMPLETO` bit(1) DEFAULT NULL,
                          `CADASTRO_COMPLETO` bit(1) DEFAULT NULL,
                          `STATUS` varchar(50) DEFAULT NULL,
                          `SEXO` varchar(10) DEFAULT NULL,
                          `TELEFONE` varchar(40) NOT NULL,
                          `NOME_TITULAR` varchar(50) DEFAULT NULL,
                          `EH_CONTA_EMPRESA` bit(1) DEFAULT NULL,
                          `CPF` varchar(50) DEFAULT NULL,
                          `CNPJ` varchar(50) DEFAULT NULL,
                          `NUMERO_PIS` varchar(50) DEFAULT NULL,
                          `NUMERO_CRM` varchar(20) DEFAULT NULL,
                          `NOME_ANEXO_FOTO` varchar(200) DEFAULT NULL,
                          `ANEXO_FOTO` longblob,
                          `TIPO_ANEXO_FOTO` varchar(20) DEFAULT NULL,
                          `UF_CONSELHO_MEDICO` varchar(40) NOT NULL,
                          `TIPO_RECEBIMENTO` varchar(10) DEFAULT NULL,
                          `AGENCIA` varchar(50) DEFAULT NULL,
                          `CONTA` varchar(50) DEFAULT NULL,
                          `BANCO` varchar(50) DEFAULT NULL,
                          `OPERACAO` varchar(50) DEFAULT NULL,
                          `TOKEN` text,
                          `TOKEN_PUSH_NOTIFICATION` varchar(100) DEFAULT NULL,
                          `DATA_ULTIMO_LOGIN` datetime DEFAULT NULL,
                          `DATA_ALTERACAO_SENHA` datetime DEFAULT NULL,
                          `DATA_EXPIRACAO_TOKEN` datetime DEFAULT NULL,
                          `VERSAO_LOGIN` varchar(20) DEFAULT NULL,
                          `USUARIO_INC` longtext NOT NULL,
                          `USUARIO_ALT` longtext NOT NULL,
                          `USUARIO_DEL` longtext,
                          `DATA_USUARIO_INC` datetime NOT NULL,
                          `DATA_USUARIO_ALT` datetime NOT NULL,
                          `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                          `EXCLUIDO` bit(1) NOT NULL,
                          PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table MEDICO_ANEXO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `MEDICO_ANEXO`;

CREATE TABLE `MEDICO_ANEXO` (
                                `ID` int(11) NOT NULL AUTO_INCREMENT,
                                `MEDICO_ID` int(11) NOT NULL,
                                `CAMPO_ANEXO_ID` int(11) NOT NULL,
                                `ESPECIALIDADE_ID` int(11) DEFAULT NULL,
                                `NOME_ANEXO` varchar(200) DEFAULT NULL,
                                `TIPO_ANEXO` varchar(20) DEFAULT NULL,
                                `VALIDADO` bit(1) DEFAULT NULL,
                                `OBERVACAO_VALIDACAO` longtext,
                                `EH_HISTORICO` bit(1) DEFAULT NULL,
                                `EH_VERSO` bit(1) DEFAULT NULL,
                                `HASH` bigint(20) DEFAULT NULL,
                                `BASE64_ANEXO` longblob,
                                `USUARIO_INC` longtext NOT NULL,
                                `USUARIO_ALT` longtext NOT NULL,
                                `USUARIO_DEL` longtext,
                                `DATA_USUARIO_INC` datetime NOT NULL,
                                `DATA_USUARIO_ALT` datetime NOT NULL,
                                `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                                `EXCLUIDO` bit(1) NOT NULL,
                                PRIMARY KEY (`ID`),
                                KEY `FKC5E88439F1A125F6` (`CAMPO_ANEXO_ID`),
                                KEY `FKC5E88439130AA293` (`MEDICO_ID`),
                                KEY `FKC5E884392C2A8D41` (`ESPECIALIDADE_ID`),
                                CONSTRAINT `FKC5E88439130AA293` FOREIGN KEY (`MEDICO_ID`) REFERENCES `MEDICO` (`ID`),
                                CONSTRAINT `FKC5E884392C2A8D41` FOREIGN KEY (`ESPECIALIDADE_ID`) REFERENCES `ESPECIALIDADE` (`ID`),
                                CONSTRAINT `FKC5E88439F1A125F6` FOREIGN KEY (`CAMPO_ANEXO_ID`) REFERENCES `CAMPO_ANEXO` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table MEDICO_ESPECIALIDADE
# ------------------------------------------------------------

DROP TABLE IF EXISTS `MEDICO_ESPECIALIDADE`;

CREATE TABLE `MEDICO_ESPECIALIDADE` (
                                        `ID` int(11) NOT NULL AUTO_INCREMENT,
                                        `MEDICO_ID` int(11) NOT NULL,
                                        `ESPECIALIDADE_ID` int(11) NOT NULL,
                                        PRIMARY KEY (`ID`),
                                        KEY `FK6F9064DD2C2A8D41` (`ESPECIALIDADE_ID`),
                                        KEY `FK6F9064DD130AA293` (`MEDICO_ID`),
                                        CONSTRAINT `FK6F9064DD130AA293` FOREIGN KEY (`MEDICO_ID`) REFERENCES `MEDICO` (`ID`),
                                        CONSTRAINT `FK6F9064DD2C2A8D41` FOREIGN KEY (`ESPECIALIDADE_ID`) REFERENCES `ESPECIALIDADE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table PLANTAO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `PLANTAO`;

CREATE TABLE `PLANTAO` (
                           `ID` int(11) NOT NULL AUTO_INCREMENT,
                           `ESCALA_ID` int(11) NOT NULL,
                           `MEDICO_ID` int(11) DEFAULT NULL,
                           `DATA` datetime DEFAULT NULL,
                           `HORA_INICIO` datetime DEFAULT NULL,
                           `HORA_FIM` datetime DEFAULT NULL,
                           `DIA` varchar(50) DEFAULT NULL,
                           `TURNO` varchar(50) DEFAULT NULL,
                           `VALOR` double DEFAULT NULL,
                           `NUMERO_VAGA` int(11) DEFAULT NULL,
                           `BLOQUEADO` bit(1) DEFAULT NULL,
                           `DISPONIVEL` bit(1) DEFAULT NULL,
                           `VAGA` bit(1) DEFAULT NULL,
                           `EM_TROCA` bit(1) DEFAULT NULL,
                           `STATUS` varchar(50) DEFAULT NULL,
                           `USUARIO_INC` longtext NOT NULL,
                           `USUARIO_ALT` longtext NOT NULL,
                           `USUARIO_DEL` longtext,
                           `DATA_USUARIO_INC` datetime NOT NULL,
                           `DATA_USUARIO_ALT` datetime NOT NULL,
                           `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                           `EXCLUIDO` bit(1) NOT NULL,
                           PRIMARY KEY (`ID`),
                           KEY `FKD5B83B9D0410793` (`ESCALA_ID`),
                           KEY `FKD5B83B9130AA293` (`MEDICO_ID`),
                           CONSTRAINT `FKD5B83B9130AA293` FOREIGN KEY (`MEDICO_ID`) REFERENCES `MEDICO` (`ID`),
                           CONSTRAINT `FKD5B83B9D0410793` FOREIGN KEY (`ESCALA_ID`) REFERENCES `ESCALA` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table PLANTAO_ESPECIALIDADE
# ------------------------------------------------------------

DROP TABLE IF EXISTS `PLANTAO_ESPECIALIDADE`;

CREATE TABLE `PLANTAO_ESPECIALIDADE` (
                                         `ID` int(11) NOT NULL AUTO_INCREMENT,
                                         `PLANTAO_ID` int(11) NOT NULL,
                                         `ESPECIALIDADE_ID` int(11) NOT NULL,
                                         PRIMARY KEY (`ID`),
                                         KEY `FKA2ED634D2C2A8D41` (`ESPECIALIDADE_ID`),
                                         KEY `FKA2ED634DD0A1C4C1` (`PLANTAO_ID`),
                                         CONSTRAINT `FKA2ED634D2C2A8D41` FOREIGN KEY (`ESPECIALIDADE_ID`) REFERENCES `ESPECIALIDADE` (`ID`),
                                         CONSTRAINT `FKA2ED634DD0A1C4C1` FOREIGN KEY (`PLANTAO_ID`) REFERENCES `PLANTAO` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table SETOR
# ------------------------------------------------------------

DROP TABLE IF EXISTS `SETOR`;

CREATE TABLE `SETOR` (
                         `ID` int(11) NOT NULL AUTO_INCREMENT,
                         `DESCRICAO` varchar(255) DEFAULT NULL,
                         `EXCLUIDO` bit(1) NOT NULL,
                         `USUARIO_INC` longtext NOT NULL,
                         `USUARIO_ALT` longtext NOT NULL,
                         `USUARIO_DEL` longtext,
                         `DATA_USUARIO_INC` datetime NOT NULL,
                         `DATA_USUARIO_ALT` datetime NOT NULL,
                         `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                         PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table TIPO_CONFIGURACAO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `TIPO_CONFIGURACAO`;

CREATE TABLE `TIPO_CONFIGURACAO` (
                                     `ID` int(11) NOT NULL AUTO_INCREMENT,
                                     `DESCRICAO` varchar(255) DEFAULT NULL,
                                     PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table TIPO_PERMISSAO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `TIPO_PERMISSAO`;

CREATE TABLE `TIPO_PERMISSAO` (
                                  `ID` int(11) NOT NULL AUTO_INCREMENT,
                                  `DESCRICAO` varchar(255) DEFAULT NULL,
                                  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table TIPO_SERVICO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `TIPO_SERVICO`;

CREATE TABLE `TIPO_SERVICO` (
                                `ID` int(11) NOT NULL AUTO_INCREMENT,
                                `DESCRICAO` longtext NOT NULL,
                                `USUARIO_INC` longtext NOT NULL,
                                `USUARIO_ALT` longtext NOT NULL,
                                `USUARIO_DEL` longtext,
                                `DATA_USUARIO_INC` datetime NOT NULL,
                                `DATA_USUARIO_ALT` datetime NOT NULL,
                                `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                                `EXCLUIDO` bit(1) NOT NULL,
                                PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table TROCA_VAGA
# ------------------------------------------------------------

DROP TABLE IF EXISTS `TROCA_VAGA`;

CREATE TABLE `TROCA_VAGA` (
                              `ID` int(11) NOT NULL AUTO_INCREMENT,
                              `MEDICO_VAGA_ID` int(11) NOT NULL,
                              `MEDICO_REQUISITANTE_ID` int(11) NOT NULL,
                              `PLANTAO_VAGA_ID` int(11) NOT NULL,
                              `PLANTAO_REQUISITANTE_ID` int(11) NOT NULL,
                              `TROCA_EFETUADA` bit(1) DEFAULT NULL,
                              `USUARIO_INC` longtext NOT NULL,
                              `USUARIO_ALT` longtext NOT NULL,
                              `USUARIO_DEL` longtext,
                              `DATA_USUARIO_INC` datetime NOT NULL,
                              `DATA_USUARIO_ALT` datetime NOT NULL,
                              `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                              `EXCLUIDO` bit(1) NOT NULL,
                              PRIMARY KEY (`ID`),
                              KEY `FK110D555C688B7FC` (`MEDICO_REQUISITANTE_ID`),
                              KEY `FK110D555B39E1DEF` (`PLANTAO_VAGA_ID`),
                              KEY `FK110D55547C0ECA1` (`MEDICO_VAGA_ID`),
                              KEY `FK110D555CA6A594A` (`PLANTAO_REQUISITANTE_ID`),
                              CONSTRAINT `FK110D55547C0ECA1` FOREIGN KEY (`MEDICO_VAGA_ID`) REFERENCES `MEDICO` (`ID`),
                              CONSTRAINT `FK110D555B39E1DEF` FOREIGN KEY (`PLANTAO_VAGA_ID`) REFERENCES `PLANTAO` (`ID`),
                              CONSTRAINT `FK110D555C688B7FC` FOREIGN KEY (`MEDICO_REQUISITANTE_ID`) REFERENCES `MEDICO` (`ID`),
                              CONSTRAINT `FK110D555CA6A594A` FOREIGN KEY (`PLANTAO_REQUISITANTE_ID`) REFERENCES `PLANTAO` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table USUARIO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `USUARIO`;

CREATE TABLE `USUARIO` (
                           `ID` int(11) NOT NULL AUTO_INCREMENT,
                           `NOME` varchar(100) NOT NULL,
                           `LOGIN` varchar(100) NOT NULL,
                           `SENHA` varchar(50) NOT NULL,
                           `TELEFONE` varchar(255) DEFAULT NULL,
                           `REQUISITADO_NOVA_SENHA` bit(1) DEFAULT NULL,
                           `DATA_ALTERACAO_SENHA` datetime DEFAULT NULL,
                           `TOKEN` text,
                           `DATA_EXPIRACAO_TOKEN` datetime DEFAULT NULL,
                           `USUARIO_INC` longtext NOT NULL,
                           `USUARIO_ALT` longtext NOT NULL,
                           `USUARIO_DEL` longtext,
                           `DATA_USUARIO_INC` datetime NOT NULL,
                           `DATA_USUARIO_ALT` datetime NOT NULL,
                           `DATA_USUARIO_DEL` datetime DEFAULT NULL,
                           `EXCLUIDO` bit(1) NOT NULL,
                           PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table USUARIO_TIPO_PERMISSAO
# ------------------------------------------------------------

DROP TABLE IF EXISTS `USUARIO_TIPO_PERMISSAO`;

CREATE TABLE `USUARIO_TIPO_PERMISSAO` (
                                          `ID` int(11) NOT NULL AUTO_INCREMENT,
                                          `USUARIO_ID` int(11) NOT NULL,
                                          `TIPO_PERMISSAO_ID` int(11) NOT NULL,
                                          PRIMARY KEY (`ID`),
                                          KEY `FKBC769F6DEA973718` (`TIPO_PERMISSAO_ID`),
                                          KEY `FKBC769F6D246288A1` (`USUARIO_ID`),
                                          CONSTRAINT `FKBC769F6D246288A1` FOREIGN KEY (`USUARIO_ID`) REFERENCES `USUARIO` (`ID`),
                                          CONSTRAINT `FKBC769F6DEA973718` FOREIGN KEY (`TIPO_PERMISSAO_ID`) REFERENCES `TIPO_PERMISSAO` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
