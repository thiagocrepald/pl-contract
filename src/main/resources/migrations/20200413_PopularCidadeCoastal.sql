
UPDATE 
	CITY C
JOIN 
	STATE S ON C.STATE_ID = S.ID
SET
	C.COASTAL = 1
WHERE
	(C.NAME LIKE 'Acaraú' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Alcobaça' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Alcântara' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Amapá' AND S.NAME LIKE 'Amapá') OR 
	(C.NAME LIKE 'Amontada' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Anchieta' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Angra dos Reis' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Apicum-Açu' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Aquiraz' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Aracaju' AND S.NAME LIKE 'Sergipe') OR 
	(C.NAME LIKE 'Aracati' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Aracruz' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Araioses' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Araquari' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Araranguá' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Araruama' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Areia Branca' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Armação dos Búzios' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Arraial do Cabo' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Augusto Corrêa' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Bacuri' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Balneário Arroio do Silva' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Balneário Barra do Sul' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Balneário Camboriú' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Balneário Gaivota' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Balneário Pinhal' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Balneário Rincão' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Barra Velha' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Barra de Santo Antônio' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Barra de São Miguel' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Barra dos Coqueiros' AND S.NAME LIKE 'Sergipe') OR 
	(C.NAME LIKE 'Barreirinhas' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Barreiros' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Barroquinha' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Baía Formosa' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Baía da Traição' AND S.NAME LIKE 'Paraíba') OR 
	(C.NAME LIKE 'Beberibe' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Belmonte' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Bertioga' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Biguaçu' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Bombinhas' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Bragança' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Brejo Grande' AND S.NAME LIKE 'Sergipe') OR 
	(C.NAME LIKE 'Cabedelo' AND S.NAME LIKE 'Paraíba') OR 
	(C.NAME LIKE 'Cabo Frio' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Cabo de Santo Agostinho' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Cairu' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Caiçara do Norte' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Cajueiro da Praia' AND S.NAME LIKE 'Piauí') OR 
	(C.NAME LIKE 'Calçoene' AND S.NAME LIKE 'Amapá') OR 
	(C.NAME LIKE 'Camaçari' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Camocim' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Campos dos Goytacazes' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Cananéia' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Canavieiras' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Candeias' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Canguaretama' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Capão da Canoa' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Caraguatatuba' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Carapebus' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Caravelas' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Carutapera' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Cascavel' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Casimiro de Abreu' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Caucaia' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Ceará-Mirim' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Cedral' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Chaves' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Cidreira' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Conceição da Barra' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Conde' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Conde' AND S.NAME LIKE 'Paraíba') OR 
	(C.NAME LIKE 'Coruripe' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Cruz' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Cururupu' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Curuçá' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Cândido Mendes' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Duque de Caxias' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Entre Rios' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Esplanada' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Estância' AND S.NAME LIKE 'Sergipe') OR 
	(C.NAME LIKE 'Extremoz' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Feliz Deserto' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Fernando de Noronha' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Florianópolis' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Fortaleza' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Fortim' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Fundão' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Galinhos' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Garopaba' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Godofredo Viana' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Goiana' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Governador Celso Ramos' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Grossos' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Guamaré' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Guapimirim' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Guarapari' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Guaraqueçaba' AND S.NAME LIKE 'Paraná') OR 
	(C.NAME LIKE 'Guaratuba' AND S.NAME LIKE 'Paraná') OR 
	(C.NAME LIKE 'Guarujá' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Guimarães' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Humberto de Campos' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Icapuí' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Icatu' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Igarassu' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Igrapiúna' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Iguape' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Ilha Comprida' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Ilha Grande' AND S.NAME LIKE 'Piauí') OR 
	(C.NAME LIKE 'Ilha de Itamaracá' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Ilhabela' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Ilhéus' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Imbituba' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Imbé' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Ipojuca' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Itaboraí' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Itacaré' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Itaguaí' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Itajaí' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Itanhaém' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Itaparica' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Itapema' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Itapemirim' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Itapipoca' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Itaporanga d`Ajuda' AND S.NAME LIKE 'Sergipe') OR 
	(C.NAME LIKE 'Itapoá' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Itarema' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Ituberá' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Jaboatão dos Guararapes' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Jaguaripe' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Jaguaruna' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Jandaíra' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Japaratinga' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Jequiá da Praia' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Jijoca de Jericoacoara' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'João Pessoa' AND S.NAME LIKE 'Paraíba') OR 
	(C.NAME LIKE 'Laguna' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Lauro de Freitas' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Linhares' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Lucena' AND S.NAME LIKE 'Paraíba') OR 
	(C.NAME LIKE 'Luís Correia' AND S.NAME LIKE 'Piauí') OR 
	(C.NAME LIKE 'Luís Domingues' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Macapá' AND S.NAME LIKE 'Amapá') OR 
	(C.NAME LIKE 'Macau' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Macaé' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Maceió' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Madre de Deus' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Magalhães Barata' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Magé' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Mangaratiba' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Maracanã' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Maragogi' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Marapanim' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Marataízes' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Maraú' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Marcação' AND S.NAME LIKE 'Paraíba') OR 
	(C.NAME LIKE 'Marechal Deodoro' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Maricá' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Mata de São João' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Mataraca' AND S.NAME LIKE 'Paraíba') OR 
	(C.NAME LIKE 'Matinhos' AND S.NAME LIKE 'Paraná') OR 
	(C.NAME LIKE 'Maxaranguape' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Mongaguá' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Mostardas' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Mucuri' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Natal' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Navegantes' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Nilo Peçanha' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Niterói' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Nova Viçosa' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Nísia Floresta' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Oiapoque' AND S.NAME LIKE 'Amapá') OR 
	(C.NAME LIKE 'Olinda' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Osório' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Pacatuba' AND S.NAME LIKE 'Sergipe') OR 
	(C.NAME LIKE 'Palhoça' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Palmares do Sul' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Paracuru' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Paraipaba' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Paranaguá' AND S.NAME LIKE 'Paraná') OR 
	(C.NAME LIKE 'Parati' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Paripueira' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Parnamirim' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Parnaíba' AND S.NAME LIKE 'Piauí') OR 
	(C.NAME LIKE 'Passo de Camaragibe' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Passo de Torres' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Paulino Neves' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Paulista' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Paulo Lopes' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Paço do Lumiar' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Pedra Grande' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Penha' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Peruíbe' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Piaçabuçu' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Pirambu' AND S.NAME LIKE 'Sergipe') OR 
	(C.NAME LIKE 'Pitimbu' AND S.NAME LIKE 'Paraíba') OR 
	(C.NAME LIKE 'Piçarras' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Piúma' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Pontal do Paraná' AND S.NAME LIKE 'Paraná') OR 
	(C.NAME LIKE 'Porto Belo' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Porto Rico do Maranhão' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Porto Seguro' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Porto de Pedras' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Porto do Mangue' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Prado' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Praia Grande' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Presidente Kennedy' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Primeira Cruz' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Quatipuru' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Quissamã' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Raposa' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Recife' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Rio Grande' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Rio Tinto' AND S.NAME LIKE 'Paraíba') OR 
	(C.NAME LIKE 'Rio das Ostras' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Rio de Janeiro' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Rio do Fogo' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Roteiro' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'Salinas da Margarida' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Salinópolis' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Salvador' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Santa Cruz Cabrália' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Santa Rita' AND S.NAME LIKE 'Paraíba') OR 
	(C.NAME LIKE 'Santa Vitória do Palmar' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Santo Amaro do Maranhão' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Santos' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Saquarema' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'Saubara' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Senador Georgino Avelino' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Serra' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Serrano do Maranhão' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Sirinhaém' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Soure' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'São Bento do Norte' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'São Caetano de Odivelas' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'São Francisco de Itabapoana' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'São Francisco do Conde' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'São Francisco do Sul' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'São Gonçalo' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'São Gonçalo do Amarante' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'São José' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'São José da Coroa Grande' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'São José de Ribamar' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'São José do Norte' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'São João da Barra' AND S.NAME LIKE 'Rio de Janeiro') OR 
	(C.NAME LIKE 'São João de Pirabas' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'São Luís' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'São Mateus' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'São Miguel de Touros' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'São Miguel dos Milagres' AND S.NAME LIKE 'Alagoas') OR 
	(C.NAME LIKE 'São Sebastião' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'São Vicente' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Tamandaré' AND S.NAME LIKE 'Pernambuco') OR 
	(C.NAME LIKE 'Tavares' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Terra de Areia' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Tibau' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Tibau do Sul' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Tijucas' AND S.NAME LIKE 'Santa Catarina') OR 
	(C.NAME LIKE 'Touros' AND S.NAME LIKE 'Rio Grande do Norte') OR 
	(C.NAME LIKE 'Tracuateua' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Trairi' AND S.NAME LIKE 'Ceará') OR 
	(C.NAME LIKE 'Tramandaí' AND S.NAME LIKE 'Rio Grande do Sul') OR 
	(C.NAME LIKE 'Turiaçu' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Tutóia' AND S.NAME LIKE 'Maranhão') OR 
	(C.NAME LIKE 'Ubatuba' AND S.NAME LIKE 'São Paulo') OR 
	(C.NAME LIKE 'Una' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Uruçuca' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Valença' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Vera Cruz' AND S.NAME LIKE 'Bahia') OR 
	(C.NAME LIKE 'Vila Velha' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Viseu' AND S.NAME LIKE 'Pará') OR 
	(C.NAME LIKE 'Vitória' AND S.NAME LIKE 'Espírito Santo') OR 
	(C.NAME LIKE 'Xangri-lá' AND S.NAME LIKE 'Rio Grande do Sul')
;

UPDATE STATE
SET COASTAL = 1
WHERE
(
	(NAME LIKE 'Alagoas') OR
	(NAME LIKE 'Amapá') OR
	(NAME LIKE 'Bahia') OR
	(NAME LIKE 'Ceará') OR
	(NAME LIKE 'Espírito Santo') OR
	(NAME LIKE 'Maranhão') OR
	(NAME LIKE 'Pará') OR
	(NAME LIKE 'Paraíba') OR
	(NAME LIKE 'Pernambuco') OR
	(NAME LIKE 'Piauí') OR
	(NAME LIKE 'Paraná') OR
	(NAME LIKE 'Rio de Janeiro') OR
	(NAME LIKE 'Rio Grande do Norte') OR
	(NAME LIKE 'Rio Grande do Sul') OR
	(NAME LIKE 'Santa Catarina') OR
	(NAME LIKE 'Sergipe') OR
	(NAME LIKE 'São Paulo')
);

UPDATE STATE
SET COASTAL = 0
WHERE COASTAL IS NULL;

UPDATE CITY
SET COASTAL = 0
WHERE COASTAL IS NULL;

UPDATE CITY
SET CAPITAL = 0
WHERE CAPITAL IS NULL;
