ALTER TABLE ESCALA ADD COLUMN `ATIVO` BIT(1) DEFAULT 1;

UPDATE ESCALA
SET ATIVO = 1
WHERE ATIVO IS NULL