// Armazenamento local para as entrevistas
const STORAGE_KEY = 'entrevistas_sociais';

// Função para salvar dados no localStorage
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Função para carregar dados do localStorage
function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Função para gerar um ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Função para formatar data
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para adicionar uma nova entrevista
function addEntrevista(entrevista) {
    const entrevistas = loadData();
    entrevista.id = generateId();
    entrevista.data_cadastro = new Date().toISOString();
    entrevistas.push(entrevista);
    saveData(entrevistas);
    return entrevista;
}

// Função para obter todas as entrevistas
function getEntrevistas() {
    return loadData();
}

// Função para obter uma entrevista pelo ID
function getEntrevistaById(id) {
    const entrevistas = loadData();
    return entrevistas.find(e => e.id === id);
}

// Função para atualizar uma entrevista
function updateEntrevista(id, entrevistaAtualizada) {
    const entrevistas = loadData();
    const index = entrevistas.findIndex(e => e.id === id);
    if (index !== -1) {
        entrevistas[index] = { ...entrevistas[index], ...entrevistaAtualizada };
        saveData(entrevistas);
        return entrevistas[index];
    }
    return null;
}

// Função para excluir uma entrevista
function deleteEntrevista(id) {
    const entrevistas = loadData();
    const novasEntrevistas = entrevistas.filter(e => e.id !== id);
    saveData(novasEntrevistas);
    return novasEntrevistas.length < entrevistas.length;
}

// Função para exportar dados como CSV
function exportToCSV(entrevistas) {
    if (!entrevistas || entrevistas.length === 0) {
        alert('Não há dados para exportar');
        return;
    }
    
    const headers = Object.keys(entrevistas[0]);
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    
    entrevistas.forEach(entrevista => {
        const row = headers.map(header => {
            let value = entrevista[header];
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            return `"${value}"`;
        }).join(",");
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "entrevistas_sociais.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Inicializar dados de exemplo se não existirem
function initializeData() {
    const entrevistas = loadData();
    if (entrevistas.length === 0) {
        // Adicionar alguns dados de exemplo
        const exemploEntrevista = {
            nome: "Maria Silva",
            data_nascimento: "1980-05-15",
            endereco: "Rua das Flores, 123",
            idade: 42,
            rg: "1234567",
            cpf: "123.456.789-00",
            contatos: "(71) 99999-9999",
            escolaridade: "Ensino Médio",
            estado_civil: "Casada",
            cadastro_cras: true,
            bairro_cras: "Centro",
            atividade_remunerada: true,
            qual_atividade: "Vendedora",
            dias_semana: "Segunda a Sexta",
            turno: "Manhã e Tarde",
            tipo_moradia: "propria",
            abastecimento_agua: "rede_publica",
            iluminacao: "rede_publica",
            recebe_beneficio: true,
            bolsa_familia: true,
            bpc: false,
            aposentadoria: false,
            pensao: false,
            renda_familiar: 1500,
            circunstancia_desemprego: "",
            interesse_curso: "Informática",
            atividades_lazer: "Leitura e caminhada",
            familiares_privacao_liberdade: false,
            adolescentes_medidas: false,
            acolhimento_institucional: false,
            gestantes_idosos: "Sim, uma idosa de 70 anos acompanhada no posto de saúde local",
            fundacao_lar_harmonia: "Um local de apoio e acolhimento para a família",
            encaminhamentos: "Encaminhada para o CRAS para atualização do cadastro",
            observacoes: "",
            tecnico_entrevistador: "João Santos"
        };
        
        addEntrevista(exemploEntrevista);
    }
}

// Inicializar dados quando a página carregar
document.addEventListener('DOMContentLoaded', initializeData);