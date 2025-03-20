-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_entrevistas;
USE sistema_entrevistas;

-- Tabela de entrevistados
CREATE TABLE IF NOT EXISTS entrevistados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    endereco TEXT,
    rg VARCHAR(20),
    cpf VARCHAR(14),
    idade INT,
    contatos VARCHAR(255),
    escolaridade VARCHAR(100),
    estado_civil VARCHAR(50),
    cadastro_cras TINYINT(1) DEFAULT 0,
    bairro_cras VARCHAR(100),
    atividade_remunerada TINYINT(1) DEFAULT 0,
    qual_atividade VARCHAR(255),
    dias_semana VARCHAR(100),
    turno VARCHAR(50),
    tipo_moradia VARCHAR(50),
    abastecimento_agua VARCHAR(50),
    outro_abastecimento VARCHAR(100),
    iluminacao VARCHAR(50),
    outro_iluminacao VARCHAR(100),
    recebe_beneficio TINYINT(1) DEFAULT 0,
    bolsa_familia TINYINT(1) DEFAULT 0,
    bpc TINYINT(1) DEFAULT 0,
    aposentadoria TINYINT(1) DEFAULT 0,
    pensao TINYINT(1) DEFAULT 0,
    renda_familiar DECIMAL(10,2),
    circunstancia_desemprego TEXT,
    interesse_curso TEXT,
    atividades_lazer TEXT,
    familiares_privacao_liberdade TINYINT(1) DEFAULT 0,
    detalhes_privacao TEXT,
    adolescentes_medidas TINYINT(1) DEFAULT 0,
    detalhes_medidas TEXT,
    acolhimento_institucional TINYINT(1) DEFAULT 0,
    detalhes_acolhimento TEXT,
    gestantes_idosos TEXT,
    fundacao_lar_harmonia TEXT,
    encaminhamentos TEXT,
    observacoes TEXT,
    data_cadastro DATE,
    tecnico_entrevistador VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de membros da família
CREATE TABLE IF NOT EXISTS membros_familia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entrevistado_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    idade INT,
    data_nascimento DATE,
    renda VARCHAR(100),
    escolaridade VARCHAR(100),
    parentesco VARCHAR(100),
    FOREIGN KEY (entrevistado_id) REFERENCES entrevistados(id) ON DELETE CASCADE
);

-- Tabela de meio de chegada
CREATE TABLE IF NOT EXISTS meio_chegada (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entrevistado_id INT NOT NULL,
    busca_ativa TINYINT(1) DEFAULT 0,
    vara_infancia TINYINT(1) DEFAULT 0,
    procura_espontanea TINYINT(1) DEFAULT 0,
    saude TINYINT(1) DEFAULT 0,
    educacao TINYINT(1) DEFAULT 0,
    conselho_tutelar TINYINT(1) DEFAULT 0,
    conselhos_direitos TINYINT(1) DEFAULT 0,
    cras TINYINT(1) DEFAULT 0,
    creas TINYINT(1) DEFAULT 0,
    outras_politicas TINYINT(1) DEFAULT 0,
    quais_politicas TEXT,
    outros_meios TINYINT(1) DEFAULT 0,
    quais_outros_meios TEXT,
    delegacia TINYINT(1) DEFAULT 0,
    FOREIGN KEY (entrevistado_id) REFERENCES entrevistados(id) ON DELETE CASCADE
);

-- Tabela de documentos encaminhados
CREATE TABLE IF NOT EXISTS documentos_encaminhados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entrevistado_id INT NOT NULL,
    relatorio_caso TINYINT(1) DEFAULT 0,
    termo_aplicacao TINYINT(1) DEFAULT 0,
    guia_acolhimento TINYINT(1) DEFAULT 0,
    pia TINYINT(1) DEFAULT 0,
    outros TINYINT(1) DEFAULT 0,
    quais_outros TEXT,
    FOREIGN KEY (entrevistado_id) REFERENCES entrevistados(id) ON DELETE CASCADE
);

-- Tabela de saúde da família
CREATE TABLE IF NOT EXISTS saude_familia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entrevistado_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    parentesco VARCHAR(100),
    medicamento TEXT,
    FOREIGN KEY (entrevistado_id) REFERENCES entrevistados(id) ON DELETE CASCADE
);