ALTER TABLE attachment
    modify COLUMN CONTENT_TYPE varchar(100);

ALTER TABLE medico_anexo
    modify COLUMN TIPO_ANEXO varchar(100);
