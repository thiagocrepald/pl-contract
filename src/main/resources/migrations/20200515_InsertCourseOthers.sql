ALTER TABLE CURSO ADD UNIQUE INDEX NOME_UNIQUE (NOME ASC);

INSERT INTO CURSO
(DATA_USUARIO_ALT, DATA_USUARIO_INC, USUARIO_INC, USUARIO_ALT, EXCLUIDO, NOME)
VALUES
(now(), now(), 'system', 'system', b'0', 'Outros');

