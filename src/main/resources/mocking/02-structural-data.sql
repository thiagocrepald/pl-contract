INSERT INTO `CAMPO_ANEXO` (`ID`, `DESCRICAO`, `ORDEM`)
VALUES
(1, 'CRM Definitivo', 1),
(2, 'Protocolo', 2),
(3, 'Diploma médico ou declaração de conclusão', 0),
(4, 'RG', 3),
(5, 'CPF', 4),
(6, 'Comprovante de endereço', 6),
(7, 'Títulos de especialidade', 7),
(8, 'Certidão RQE', 8),
(9, 'Certidão de casamento', 9),
(10, 'Carteirinha de cursos ATLS/ACLS/SAVE/PALS, etc.', 10),
(11, 'Contrato social consolidado', 11),
(12, 'Cartão CNPJ da empresa', 12),
(13, 'Certidão simplificada da junta comercial', 13),
(14, 'CNH', 5);

INSERT INTO `ESPECIALIDADE` (`ID`, `DESCRICAO`, `USUARIO_INC`, `USUARIO_ALT`, `USUARIO_DEL`, `DATA_USUARIO_INC`, `DATA_USUARIO_ALT`, `DATA_USUARIO_DEL`, `EXCLUIDO`)
VALUES
(1, 'ACUPUNTURA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(2, 'ALERGIA E IMUNOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(3, 'ANESTESIOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(4, 'ANGIOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(5, 'CANCEROLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(6, 'CARDIOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(7, 'CIRURGIA CARDIOVASCULAR', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(8, 'CIRURGIA DA MÃO', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(9, 'CIRURGIA DE CABEÇA E PESCOÇO', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(10, 'CIRURGIA DO APARELHO DIGESTIVO', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(11, 'CIRURGIA GERAL', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(12, 'CIRURGIA PEDIÁTRICA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(13, 'CIRURGIA PLÁSTICA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(14, 'CIRURGIA TORÁCICA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(15, 'CIRURGIA VASCULAR', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(16, 'CLÍNICA MÉDICA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(17, 'COLOPROCTOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(18, 'DERMATOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(19, 'ENDOCRINOLOGIA E METABOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(20, 'ENDOSCOPIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(21, 'GASTROENTEROLOGIA ', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(22, 'GENÉTICA MÉDICA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(23, 'GERIATRIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(24, 'GINECOLOGIA E OBSTETRÍCIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(25, 'HEMATOLOGIA E HEMOTERAPIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(26, 'HOMEOPATIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(27, 'INFECTOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(28, 'MASTOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(29, 'MEDICINA DE FAMÍLIA E COMUNIDADE', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(30, 'MEDICINA DO TRABALHO', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(31, 'MEDICINA DE TRÁFEGO', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(32, 'MEDICINA ESPORTIVA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(33, 'MEDICINA FÍSICA E REABILITAÇÃO', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(34, 'MEDICINA INTENSIVA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(35, 'MEDICINA LEGAL E PERÍCIA MÉDICA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(36, 'MEDICINA NUCLEAR', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(37, 'MEDICINA PREVENTIVA E SOCIAL', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(38, 'NEFROLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(39, 'NEUROCIRURGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(40, 'NEUROLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(41, 'NUTROLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(42, 'OFTALMOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(43, 'ORTOPEDIA E TRAUMATOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(44, 'OTORRINOLARINGOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(45, 'PATOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(46, 'PATOLOGIA CLÍNICA/MEDICINA LABORATORIAL', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(47, 'PEDIATRIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(48, 'PNEUMOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(49, 'PSIQUIATRIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(50, 'RADIOLOGIA E DIAGNÓSTICO POR IMAGEM', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(51, 'RADIOTERAPIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(52, 'REUMATOLOGIA', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(53, 'UROLOGIA ', '{}', '{}', NULL, '2019-06-13 10:00:00', '2019-06-13 10:00:00', NULL, 0),
(54, 'CLÍNICO GERAL', 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-07-24 21:34:44', '2019-07-24 21:34:44', NULL, 0);

INSERT INTO `SETOR` (`ID`, `DESCRICAO`, `EXCLUIDO`, `USUARIO_INC`, `USUARIO_ALT`, `USUARIO_DEL`, `DATA_USUARIO_INC`, `DATA_USUARIO_ALT`, `DATA_USUARIO_DEL`)
VALUES
(1, 'TESTE SETOR', 0, 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-05-27 13:10:44', '2019-05-27 13:10:44', NULL),
(2, 'EMERGÊNCIA', 0, 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-05-27 13:50:08', '2019-05-27 13:50:08', NULL),
(3, 'CORREDOR ADULTO', 0, 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-05-27 13:51:38', '2019-05-27 13:51:38', NULL),
(4, 'CORREDOR PEDIATRIA', 0, 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-05-27 13:52:34', '2019-05-27 13:52:34', NULL),
(5, 'OBSERVAÇÃO', 0, 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-05-27 13:53:26', '2019-05-27 13:53:26', NULL),
(6, 'FILA ÚNICA', 0, 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-08-23 20:55:47', '2019-08-23 20:55:47', NULL),
(7, 'ATENDIMENTO GERAL ', 0, 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-09-05 16:28:12', '2019-09-05 16:28:12', NULL),
(8, 'CORREDOR', 0, 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-11-22 18:03:24', '2019-11-22 18:03:24', NULL),
(9, 'CORREDOR INTERMEDIÁRIO', 0, 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-11-22 18:06:35', '2019-11-22 18:06:35', NULL);

INSERT INTO `TIPO_CONFIGURACAO` (`ID`, `DESCRICAO`)
VALUES
(1, 'Receber notificações - Cadastros no Aplicativo'),
(2, 'Receber notificações - Gestão de Escala'),
(3, 'Disponibilizar whats para dúvidas/ajuda');

INSERT INTO `TIPO_PERMISSAO` (`ID`, `DESCRICAO`)
VALUES
(1, 'Contratos - Cadastrar/editar/excluir'),
(2, 'Contratantes - Cadastrar/editar/excluir'),
(3, 'Cadastro Escalas - Cadastrar/editar/excluir'),
(4, 'Gestão Escalas - Exportar/Publicar escalas'),
(5, 'Gestão Escalas - Divulgar Plantões Disponíveis'),
(6, 'Plantões/app - Aceitar ou recusar Candidaturas, trocas e doações'),
(7, 'Fechamentos - Exportar'),
(8, 'Indicadores - Filtrar/Exportar'),
(9, 'Cadastros Médicos --> Aprovar documentos enviados pelos médicos, solicitar atualização ao médico, editar e excluir cadastros existentes'),
(10, 'Cadastrar/editar usuários'),
(11, 'Médicos - Apenas visualizar o perfil e realizar download de documentos');

INSERT INTO `TIPO_SERVICO` (`ID`, `DESCRICAO`, `USUARIO_INC`, `USUARIO_ALT`, `USUARIO_DEL`, `DATA_USUARIO_INC`, `DATA_USUARIO_ALT`, `DATA_USUARIO_DEL`, `EXCLUIDO`)
VALUES
(1, 'PLANTÕES MÉDICOS PA', 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-08-01 19:44:31', '2019-08-01 19:44:31', NULL, 0),
(2, 'PLANTÕES MÉDICOS PS', 'Usuário Anônimo', 'Usuário Anônimo', NULL, '2019-08-01 19:45:44', '2019-08-01 19:45:44', NULL, 0);
