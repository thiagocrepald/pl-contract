/*
Item 7.4
Criar permissão exclusiva para visualizar/baixar docs.
*/

INSERT INTO `TIPO_PERMISSAO` (`ID`, `DESCRICAO`) VALUES ('11', 'Médicos - Criar, editar e deletar documentos');
SELECT * FROM `TIPO_PERMISSAO` LIMIT 0,16000;
