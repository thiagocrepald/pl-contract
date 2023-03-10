
UPDATE MEDICO_ANEXO
SET
    NOME_ANEXO = CONCAT(NOME_ANEXO, '.jpg')
WHERE
	TIPO_ANEXO = 'image/jpeg' AND
	NOME_ANEXO NOT LIKE "%jpg";

UPDATE ATTACHMENT
SET
	NAME = CONCAT(NAME, '.jpg'),
    FILE_NAME = CONCAT(FILE_NAME, '.jpg')
WHERE
    CONTENT_TYPE = 'image/jpeg' AND
    FILE_NAME NOT LIKE "%jpg";