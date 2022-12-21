/* Colunas DATA_USUARIO_INC, DATA_USUARIO_ALT e DATA_USUARIO_DEL no final e nesta ordem */

alter table CANDIDATO_PLANTAO modify DATA_USUARIO_INC datetime not null after CANCELADO;

alter table CANDIDATO_PLANTAO modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table CANDIDATO_PLANTAO modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table CONTRATANTE modify DATA_USUARIO_INC datetime not null after UF;

alter table CONTRATANTE modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table CONTRATANTE modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table CONTRATO modify DATA_USUARIO_INC datetime not null after TIPO_SERVICO_ID;

alter table CONTRATO modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table CONTRATO modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table ESCALA modify DATA_USUARIO_INC datetime not null after USUARIO_ID;

alter table ESCALA modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table ESCALA modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table ESPECIALIDADE modify DATA_USUARIO_INC datetime not null after DESCRICAO;

alter table ESPECIALIDADE modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table ESPECIALIDADE modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table MEDICO modify DATA_USUARIO_INC datetime not null after VERSAO_LOGIN;

alter table MEDICO modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table MEDICO modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table MEDICO_ANEXO modify DATA_USUARIO_INC datetime not null after ESPECIALIDADE_ID;

alter table MEDICO_ANEXO modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table MEDICO_ANEXO modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table PLANTAO modify DATA_USUARIO_INC datetime not null after EM_TROCA;

alter table PLANTAO modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table PLANTAO modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table SETOR modify DATA_USUARIO_INC datetime not null after DESCRICAO;

alter table SETOR modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table SETOR modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table TIPO_SERVICO modify DATA_USUARIO_INC datetime not null after DESCRICAO;

alter table TIPO_SERVICO modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table TIPO_SERVICO modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table TROCA_VAGA modify DATA_USUARIO_INC datetime not null after PLANTAO_VAGA_ID;

alter table TROCA_VAGA modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table TROCA_VAGA modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

alter table USUARIO modify DATA_USUARIO_INC datetime not null after TOKEN;

alter table USUARIO modify DATA_USUARIO_ALT datetime not null after DATA_USUARIO_INC;

alter table USUARIO modify DATA_USUARIO_DEL datetime null after DATA_USUARIO_ALT;

/* Ajustes finos na ordem das colunas */

alter table CANDIDATO_PLANTAO modify EXCLUIDO bit not null after CANCELADO;

alter table CANDIDATO_PLANTAO modify USUARIO_INC longtext not null after EXCLUIDO;

alter table CANDIDATO_PLANTAO modify USUARIO_ALT longtext not null after USUARIO_INC;

alter table CANDIDATO_PLANTAO modify USUARIO_DEL longtext null after USUARIO_ALT;

alter table CANDIDATO_PLANTAO modify ACEITO bit null after DOACAO;

alter table CANDIDATO_PLANTAO modify DATA_CANDIDATURA datetime null after PLANTAO_ID;

alter table CONTRATANTE modify USUARIO_INC longtext not null after UF;

alter table CONTRATANTE modify USUARIO_ALT longtext not null after USUARIO_INC;

alter table CONTRATANTE modify USUARIO_DEL longtext null after USUARIO_ALT;

alter table CONTRATANTE modify EXCLUIDO bit not null after USUARIO_DEL;

alter table CONTRATANTE modify CNPJ varchar(18) null after NOME_CONTRATANTE;

alter table CONTRATANTE modify CIDADE varchar(50) null after CNPJ;

alter table CONTRATANTE modify EXCLUIDO bit not null after UF;

alter table CONTRATO modify ANEXO_CONTRATO longblob null after TIPO_ANEXO;

alter table CONTRATO modify CIDADE varchar(100) not null after LOCAL;

alter table CONTRATO modify DATA_VIGENCIA_FIM datetime null after DATA_VIGENCIA_INICIO;

alter table CONTRATO modify ESTADO varchar(100) not null after CIDADE;

alter table CONTRATO modify TAMANHO_ANEXO varchar(50) null after ANEXO_CONTRATO;

alter table CONTRATO modify OBSERVACAO varchar(100) not null after TAMANHO_ANEXO;

alter table CONTRATO modify EXCLUIDO bit not null after OBSERVACAO;

alter table CONTRATO modify USUARIO_INC longtext not null after EXCLUIDO;

alter table CONTRATO modify USUARIO_ALT longtext not null after USUARIO_INC;

alter table CONTRATO modify USUARIO_DEL longtext null after USUARIO_ALT;

alter table CONTRATO modify CONTRATANTE_ID int null after ID;

alter table CONTRATO modify TIPO_SERVICO_ID int null after CONTRATANTE_ID;

alter table CONTRATO modify NOME_CONTRATO varchar(255) null after TIPO_SERVICO_ID;

alter table ESCALA modify EXCLUIDO bit not null after PREVISAO_PAGAMENTO;

alter table ESCALA modify USUARIO_INC longtext not null after EXCLUIDO;

alter table ESCALA modify USUARIO_ALT longtext not null after USUARIO_INC;

alter table ESCALA modify USUARIO_DEL longtext null after USUARIO_ALT;

alter table ESCALA modify PERIODO_FIM datetime null after PERIODO_INICIO;

alter table ESCALA modify CONTRATO_ID int null after ID;

alter table ESCALA modify USUARIO_ID int null after CONTRATO_ID;

alter table ESPECIALIDADE modify USUARIO_INC longtext not null after EXCLUIDO;

alter table ESPECIALIDADE modify DESCRICAO varchar(255) null after ID;

alter table MEDICO modify EXCLUIDO bit not null after VERSAO_LOGIN;

alter table MEDICO modify USUARIO_ALT longtext not null after EXCLUIDO;

alter table MEDICO modify USUARIO_DEL longtext null after USUARIO_ALT;

alter table MEDICO modify USUARIO_INC longtext not null after USUARIO_DEL;

alter table MEDICO modify AGENCIA varchar(50) null after TIPO_RECEBIMENTO;

alter table MEDICO modify CONTA varchar(50) null after AGENCIA;

alter table MEDICO modify BANCO varchar(50) null after CONTA;

alter table MEDICO modify DATA_ALTERACAO_SENHA datetime null after DATA_ULTIMO_LOGIN;

alter table MEDICO modify DATA_EXPIRACAO_TOKEN datetime null after DATA_ALTERACAO_SENHA;

alter table MEDICO modify EMAIL varchar(100) not null after NOME;

alter table MEDICO modify NOME_TITULAR varchar(50) null after TELEFONE;

alter table MEDICO modify EH_CONTA_EMPRESA bit null after NOME_TITULAR;

alter table MEDICO modify CPF varchar(50) null after EH_CONTA_EMPRESA;

alter table MEDICO modify CNPJ varchar(50) null after CPF;

alter table MEDICO modify NUMERO_PIS varchar(50) null after CNPJ;

alter table MEDICO modify OPERACAO varchar(50) null after BANCO;

alter table MEDICO modify SEXO varchar(10) null after STATUS;

alter table MEDICO modify UF_CONSELHO_MEDICO varchar(40) not null after TIPO_ANEXO_FOTO;

alter table MEDICO modify VALIDADO bit null after SENHA;

alter table MEDICO modify OBSERVACOES_VALIDACAO varchar(200) null after VALIDADO;

alter table MEDICO modify IS_CADASTRO_COMPLETO bit null after OBSERVACOES_VALIDACAO;

alter table MEDICO modify CADASTRO_COMPLETO bit null after IS_CADASTRO_COMPLETO;

alter table MEDICO modify EMAIL_VALIDADO bit null after CADASTRO_COMPLETO;

alter table MEDICO modify NUMERO_CRM varchar(20) null after NUMERO_PIS;

alter table MEDICO modify NOME_ANEXO_FOTO varchar(200) null after NUMERO_CRM;

alter table MEDICO modify ANEXO_FOTO longblob null after NOME_ANEXO_FOTO;

alter table MEDICO_ANEXO modify BASE64_ANEXO longblob null after HASH;

alter table MEDICO_ANEXO modify EXCLUIDO bit not null after BASE64_ANEXO;

alter table MEDICO_ANEXO modify USUARIO_INC longtext not null after EXCLUIDO;

alter table MEDICO_ANEXO modify USUARIO_ALT longtext not null after USUARIO_INC;

alter table MEDICO_ANEXO modify USUARIO_DEL longtext null after USUARIO_ALT;

alter table MEDICO_ANEXO modify OBERVACAO_VALIDACAO longtext null after VALIDADO;

alter table MEDICO_ANEXO modify EH_HISTORICO bit null after OBERVACAO_VALIDACAO;

alter table MEDICO_ANEXO modify MEDICO_ID int not null after ID;

alter table MEDICO_ANEXO modify CAMPO_ANEXO_ID int not null after MEDICO_ID;

alter table MEDICO_ANEXO modify ESPECIALIDADE_ID int null after CAMPO_ANEXO_ID;

alter table PLANTAO modify HORA_INICIO datetime null after TURNO;

alter table PLANTAO modify HORA_FIM datetime null after HORA_INICIO;

alter table PLANTAO modify ESCALA_ID int not null after ID;

alter table PLANTAO modify STATUS varchar(50) null after EM_TROCA;

alter table PLANTAO modify EXCLUIDO bit not null after STATUS;

alter table PLANTAO modify USUARIO_INC longtext not null after EXCLUIDO;

alter table PLANTAO modify USUARIO_ALT longtext not null after USUARIO_INC;

alter table PLANTAO modify USUARIO_DEL longtext null after USUARIO_ALT;

alter table PLANTAO modify MEDICO_ID int null after ESCALA_ID;

alter table PLANTAO modify DATA datetime null after MEDICO_ID;

alter table SETOR modify USUARIO_INC longtext not null after EXCLUIDO;

alter table SETOR modify DESCRICAO varchar(255) null after ID;

alter table TIPO_SERVICO modify USUARIO_INC longtext not null after EXCLUIDO;

alter table TIPO_SERVICO modify DESCRICAO longtext not null after ID;

alter table TROCA_VAGA modify USUARIO_INC longtext not null after EXCLUIDO;

alter table TROCA_VAGA modify MEDICO_VAGA_ID int not null after ID;

alter table TROCA_VAGA modify MEDICO_REQUISITANTE_ID int not null after MEDICO_VAGA_ID;

alter table TROCA_VAGA modify PLANTAO_VAGA_ID int not null after MEDICO_REQUISITANTE_ID;

alter table TROCA_VAGA modify PLANTAO_REQUISITANTE_ID int not null after PLANTAO_VAGA_ID;

alter table TROCA_VAGA modify TROCA_EFETUADA bit null after PLANTAO_REQUISITANTE_ID;

alter table USUARIO modify DATA_EXPIRACAO_TOKEN datetime null after TOKEN;

alter table USUARIO modify EXCLUIDO bit not null after DATA_EXPIRACAO_TOKEN;

alter table USUARIO modify USUARIO_INC longtext not null after EXCLUIDO;

alter table USUARIO modify USUARIO_ALT longtext not null after USUARIO_INC;

alter table USUARIO modify USUARIO_DEL longtext null after USUARIO_ALT;

alter table USUARIO modify LOGIN varchar(100) not null after NOME;

alter table USUARIO modify REQUISITADO_NOVA_SENHA bit null after TELEFONE;

alter table USUARIO modify DATA_ALTERACAO_SENHA datetime null after REQUISITADO_NOVA_SENHA;

alter table BLOQUEIO_MEDICO_ESCALA modify MEDICO_ID int not null after ID;

alter table MEDICO modify EMAIL_VALIDADO bit null after VALIDADO;

alter table MEDICO modify USUARIO_INC longtext not null after EXCLUIDO;

alter table MEDICO_ESPECIALIDADE modify MEDICO_ID int not null after ID;

alter table PLANTAO modify DIA varchar(50) null after HORA_FIM;

alter table PLANTAO modify TURNO varchar(50) null after DIA;

alter table PLANTAO_ESPECIALIDADE modify PLANTAO_ID int not null after ID;

alter table USUARIO_TIPO_PERMISSAO modify USUARIO_ID int not null after ID;

/* Coluna excluido no final da tabela */

alter table CANDIDATO_PLANTAO modify EXCLUIDO bit not null after DATA_USUARIO_DEL;

alter table CONTRATANTE modify EXCLUIDO bit not null after DATA_USUARIO_DEL;

alter table CONTRATO modify EXCLUIDO bit not null after DATA_USUARIO_DEL;

alter table ESCALA modify EXCLUIDO bit not null after DATA_USUARIO_DEL;

alter table ESPECIALIDADE modify EXCLUIDO bit not null after DATA_USUARIO_DEL;

alter table MEDICO modify EXCLUIDO bit not null after DATA_USUARIO_DEL;

alter table MEDICO_ANEXO modify EXCLUIDO bit not null after DATA_USUARIO_DEL;

alter table PLANTAO modify EXCLUIDO bit not null after DATA_USUARIO_DEL;

alter table TIPO_SERVICO modify EXCLUIDO bit not null after DATA_USUARIO_DEL;

alter table TROCA_VAGA modify EXCLUIDO bit not null after DATA_USUARIO_DEL;

alter table USUARIO modify EXCLUIDO bit not null after DATA_USUARIO_DEL;
