$(document).ready(function() {
    // Carregar entrevistas do localStorage
    const entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
    
    if (entrevistas.length === 0) {
        $('#semRegistros').show();
        return;
    }
    
    // Preencher a tabela com os dados
    entrevistas.forEach(function(entrevista) {
        const dataCadastro = new Date(entrevista.dataCriacao).toLocaleDateString('pt-BR');
        
        const row = `
            <tr data-id="${entrevista.id}">
                <td>${entrevista.nome || 'Não informado'}</td>
                <td>${dataCadastro}</td>
                <td>${entrevista.idade || 'Não informado'}</td>
                <td>${entrevista.contatos || 'Não informado'}</td>
                <td>
                    <button class="btn btn-sm btn-info visualizar-entrevista">Visualizar</button>
                    <button class="btn btn-sm btn-danger excluir-entrevista">Excluir</button>
                </td>
            </tr>
        `;
        
        $('#tabelaEntrevistas tbody').append(row);
    });
    
    // Visualizar entrevista
    $(document).on('click', '.visualizar-entrevista', function() {
        const id = $(this).closest('tr').data('id');
        window.location.href = `visualizar.html?id=${id}`;
    });
    
    // Excluir entrevista
    $(document).on('click', '.excluir-entrevista', function() {
        if (confirm('Tem certeza que deseja excluir esta entrevista?')) {
            const id = $(this).closest('tr').data('id');
            const entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
            const novasEntrevistas = entrevistas.filter(e => e.id !== id);
            
            localStorage.setItem('entrevistas', JSON.stringify(novasEntrevistas));
            $(this).closest('tr').remove();
            
            if (novasEntrevistas.length === 0) {
                $('#semRegistros').show();
            }
        }
    });
});


// Adicione esta função ao arquivo index.js
function exportarTodasEntrevistas() {
    try {
        // Carregar todas as entrevistas do localStorage
        const entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
        
        if (entrevistas.length === 0) {
            alert('Não há entrevistas para exportar.');
            return;
        }
        
        // Criar uma planilha para cada entrevista
        const workbook = XLSX.utils.book_new();
        
        // Adicionar uma planilha com resumo de todas as entrevistas
        const resumoData = entrevistas.map(entrevista => ({
            'ID': entrevista.id,
            'Nome': entrevista.nome || '',
            'Data de Nascimento': entrevista.data_nascimento ? new Date(entrevista.data_nascimento).toLocaleDateString('pt-BR') : '',
            'Telefone': entrevista.telefone || '',
            'CPF': entrevista.cpf || '',
            'Bairro': entrevista.bairro || '',
            'Cadastro CRAS': entrevista.cadastro_cras === 'true' ? 'Sim' : 'Não',
            'Recebe Benefício': entrevista.recebe_beneficio === 'true' ? 'Sim' : 'Não',
            'Data de Criação': entrevista.dataCriacao ? new Date(entrevista.dataCriacao).toLocaleDateString('pt-BR') : '',
            'Última Atualização': entrevista.dataModificacao ? new Date(entrevista.dataModificacao).toLocaleDateString('pt-BR') : ''
        }));
        
        // Criar planilha de resumo
        const resumoSheet = XLSX.utils.json_to_sheet(resumoData);
        XLSX.utils.book_append_sheet(workbook, resumoSheet, "Resumo");
        
        // Formatar cabeçalhos da planilha de resumo
        formatarCabecalhos(resumoSheet);
        
        // Adicionar planilha detalhada para cada entrevista
        entrevistas.forEach(entrevista => {
            // Criar objeto formatado para a entrevista
            const dadosFormatados = formatarDadosEntrevista(entrevista);
            
            // Criar planilha para a entrevista
            const worksheet = XLSX.utils.json_to_sheet([dadosFormatados]);
            
            // Definir larguras de coluna
            definirLargurasColunas(worksheet, dadosFormatados);
            
            // Formatar cabeçalhos
            formatarCabecalhos(worksheet);
            
            // Adicionar planilha ao workbook
            const nomeSheet = `ID ${entrevista.id} - ${entrevista.nome || 'Sem Nome'}`.substring(0, 31);
            XLSX.utils.book_append_sheet(workbook, worksheet, nomeSheet);
        });
        
        // Gerar arquivo e fazer download
        const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        const nomeArquivo = `Todas_Entrevistas_${dataAtual}.xlsx`;
        XLSX.writeFile(workbook, nomeArquivo);
        
        alert(`${entrevistas.length} entrevistas exportadas com sucesso!`);
    } catch (error) {
        console.error('Erro ao exportar entrevistas:', error);
        alert('Erro ao exportar entrevistas: ' + error.message);
    }
}

// Função auxiliar para formatar os dados de uma entrevista
function formatarDadosEntrevista(entrevista) {
    const dadosFormatados = {
        'ID': entrevista.id,
        'Nome': entrevista.nome || '',
        'Data de Nascimento': entrevista.data_nascimento ? new Date(entrevista.data_nascimento).toLocaleDateString('pt-BR') : '',
        'Endereço': entrevista.endereco || '',
        'Bairro': entrevista.bairro || '',
        'Telefone': entrevista.telefone || '',
        'Email': entrevista.email || '',
        'CPF': entrevista.cpf || '',
        'RG': entrevista.rg || '',
        'Cadastro CRAS': entrevista.cadastro_cras === 'true' ? 'Sim' : 'Não',
        'Bairro CRAS': entrevista.bairro_cras || '',
        'Recebe Benefício': entrevista.recebe_beneficio === 'true' ? 'Sim' : 'Não',
        'Bolsa Família': entrevista.bolsa_familia === 'on' ? 'Sim' : 'Não',
        'BPC': entrevista.bpc === 'on' ? 'Sim' : 'Não',
        'Aposentadoria': entrevista.aposentadoria === 'on' ? 'Sim' : 'Não',
        'Pensão': entrevista.pensao === 'on' ? 'Sim' : 'Não',
        'Renda Familiar': entrevista.renda_familiar || '',
        'Tipo de Moradia': entrevista.tipo_moradia || '',
        'Abastecimento de Água': entrevista.abastecimento_agua || '',
        'Iluminação': entrevista.iluminacao || '',
        'Familiares em Privação de Liberdade': entrevista.familiares_privacao_liberdade === 'true' ? 'Sim' : 'Não',
        'Detalhes Privação': entrevista.detalhes_privacao || '',
        'Adolescentes em Medidas Socioeducativas': entrevista.adolescentes_medidas === 'true' ? 'Sim' : 'Não',
        'Detalhes Medidas': entrevista.detalhes_medidas || '',
        'Acolhimento Institucional': entrevista.acolhimento_institucional === 'true' ? 'Sim' : 'Não',
        'Detalhes Acolhimento': entrevista.detalhes_acolhimento || '',
        'Participa de Atividade Socioeducativa': entrevista.participa_atividade === 'true' ? 'Sim' : 'Não',
        'Qual Atividade': entrevista.qual_atividade || '',
        'Dias da Semana': entrevista.dias_semana || '',
        'Turno': entrevista.turno || '',
        'Demanda Apresentada': entrevista.demanda_apresentada || '',
        'Encaminhamentos': entrevista.encaminhamentos || '',
        'Data de Criação': entrevista.dataCriacao ? new Date(entrevista.dataCriacao).toLocaleDateString('pt-BR') : '',
        'Última Atualização': entrevista.dataModificacao ? new Date(entrevista.dataModificacao).toLocaleDateString('pt-BR') : ''
    };
    
    // Adicionar familiares em colunas separadas
    if (entrevista.familiares) {
        try {
            const familiares = JSON.parse(entrevista.familiares);
            familiares.forEach((familiar, index) => {
                dadosFormatados[`Familiar ${index+1} - Nome`] = familiar.nome || '';
                dadosFormatados[`Familiar ${index+1} - Idade`] = familiar.idade || '';
                dadosFormatados[`Familiar ${index+1} - Data Nascimento`] = familiar.dataNasc || '';
                dadosFormatados[`Familiar ${index+1} - Renda`] = familiar.renda || '';
                dadosFormatados[`Familiar ${index+1} - Escolaridade`] = familiar.escolaridade || '';
                dadosFormatados[`Familiar ${index+1} - Parentesco`] = familiar.parentesco || '';
            });
        } catch (e) {
            console.error('Erro ao processar familiares:', e);
        }
    }
    
    return dadosFormatados;
}

// Função auxiliar para definir larguras de colunas
function definirLargurasColunas(worksheet, dadosFormatados) {
    const wscols = [];
    const keys = Object.keys(dadosFormatados);
    
    keys.forEach(key => {
        let width = 15; // Largura padrão
        
        if (key.includes('Nome') || key.includes('Endereço')) {
            width = 25; // Campos de texto longos
        } else if (key.includes('Detalhes') || key.includes('Demanda') || key.includes('Encaminhamentos')) {
            width = 35; // Campos de texto muito longos
        } else if (key.includes('Data') || key.includes('Telefone') || key.includes('CPF') || key.includes('RG')) {
            width = 15; // Campos de data e números
        } else if (key.includes('Sim') || key.includes('Não') || key === 'ID') {
            width = 10; // Campos curtos
        }
        
        wscols.push({ wch: width });
    });
    
    worksheet['!cols'] = wscols;
}

// Função auxiliar para formatar cabeçalhos
function formatarCabecalhos(worksheet) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1"; // Endereço da célula de cabeçalho
        if (!worksheet[address]) continue;
        
        // Formatar cabeçalhos
        worksheet[address].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4F81BD" } },
            alignment: { horizontal: "center", vertical: "center", wrapText: true }
        };
    }
    
    // Ajustar altura da linha de cabeçalho
    worksheet['!rows'] = [{ hpt: 25 }];
}

// Adicionar evento ao botão quando o documento estiver pronto
$(document).ready(function() {
    // Adicionar evento ao botão de exportar todas as entrevistas
    $('#btnExportarTodas').click(function() {
        exportarTodasEntrevistas();
    });
});