UPDATE
	CITY C
JOIN 
	STATE S ON C.STATE_ID = S.ID
SET
	CAPITAL = 1
WHERE    
	(C.NAME LIKE 'Rio Branco' AND S.NAME LIKE 'Acre') OR
	(C.NAME LIKE 'Maceió' AND S.NAME LIKE 'Alagoas') OR
	(C.NAME LIKE 'Macapá' AND S.NAME LIKE 'Amapá') OR
	(C.NAME LIKE 'Manaus' AND S.NAME LIKE 'Amazonas') OR
	(C.NAME LIKE 'Salvador' AND S.NAME LIKE 'Bahia') OR
	(C.NAME LIKE 'Fortaleza' AND S.NAME LIKE 'Ceará') OR
	(C.NAME LIKE 'Brasília' AND S.NAME LIKE 'Distrito Federal') OR
	(C.NAME LIKE 'Vitória' AND S.NAME LIKE 'Espírito Santo') OR
	(C.NAME LIKE 'Goiânia' AND S.NAME LIKE 'Goiás') OR
	(C.NAME LIKE 'São Luís' AND S.NAME LIKE 'Maranhão') OR
	(C.NAME LIKE 'Cuiabá' AND S.NAME LIKE 'Mato Grosso') OR
	(C.NAME LIKE 'Campo Grande' AND S.NAME LIKE 'Mato Grosso do Sul') OR
	(C.NAME LIKE 'Belo Horizonte' AND S.NAME LIKE 'Minas Gerais') OR
	(C.NAME LIKE 'Belém' AND S.NAME LIKE 'Pará') OR
	(C.NAME LIKE 'João Pessoa' AND S.NAME LIKE 'Paraíba') OR
	(C.NAME LIKE 'Curitiba' AND S.NAME LIKE 'Paraná') OR
	(C.NAME LIKE 'Recife' AND S.NAME LIKE 'Pernambuco') OR
	(C.NAME LIKE 'Teresina' AND S.NAME LIKE 'Piauí') OR
	(C.NAME LIKE 'Rio de Janeiro' AND S.NAME LIKE 'Rio de Janeiro') OR
	(C.NAME LIKE 'Natal' AND S.NAME LIKE 'Rio Grande do Norte') OR
	(C.NAME LIKE 'Porto Alegre' AND S.NAME LIKE 'Rio Grande do Sul') OR
	(C.NAME LIKE 'Porto Velho' AND S.NAME LIKE 'Rondônia') OR
	(C.NAME LIKE 'Boa Vista' AND S.NAME LIKE 'Roraima') OR
	(C.NAME LIKE 'Florianópolis' AND S.NAME LIKE 'Santa Catarina') OR
	(C.NAME LIKE 'São Paulo' AND S.NAME LIKE 'São Paulo') OR
	(C.NAME LIKE 'Aracaju' AND S.NAME LIKE 'Sergipe') OR
	(C.NAME LIKE 'Palmas' AND S.NAME LIKE 'Tocantins')
;