$(document).ready(function() {
    // Obter ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    
    if (!id) {
        alert('ID da entrevista não fornecido.');
        window.location.href = 'index.html';
        return;
    }
    
    // Carregar dados da entrevista
    const entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
    const entrevista = entrevistas.find(e => e.id === id);
    
    if (!entrevista) {
        alert('Entrevista não encontrada.');
        window.location.href = 'index.html';
        return;
    }
    
    // Configurar botão de editar
    $('#btnEditar').attr('href', `editar.html?id=${id}`);
    
    // Configurar botão de imprimir
    $('#btnImprimir').click(function() {
        window.print();
    });
    
    // Configurar botão de exportar para Excel
    $('#btnExportarExcel').click(function() {
        exportarParaExcel(entrevista);
    });
    
    // Exibir dados da entrevista
    exibirDadosEntrevista(entrevista);
    
    // Esconder spinner de carregamento
    $('#carregando').hide();
    $('#dadosEntrevista').show();
});

function exibirDadosEntrevista(entrevista) {
    // Criar HTML para exibir os dados da entrevista
    let html = `
        <h2>Dados Pessoais</h2>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Nome:</strong> ${entrevista.nome || 'Não informado'}</p>
                <p><strong>Data de Nascimento:</strong> ${formatarData(entrevista.data_nascimento) || 'Não informado'}</p>
                <p><strong>Endereço:</strong> ${entrevista.endereco || 'Não informado'}</p>
                <p><strong>Bairro:</strong> ${entrevista.bairro || 'Não informado'}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Telefone:</strong> ${entrevista.telefone || 'Não informado'}</p>
                <p><strong>Email:</strong> ${entrevista.email || 'Não informado'}</p>
                <p><strong>CPF:</strong> ${entrevista.cpf || 'Não informado'}</p>
                <p><strong>RG:</strong> ${entrevista.rg || 'Não informado'}</p>
            </div>
        </div>
        
        <h2 class="mt-4">Informações Sociais</h2>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Cadastro CRAS:</strong> ${entrevista.cadastro_cras === 'true' ? 'Sim' : 'Não'}</p>
                ${entrevista.cadastro_cras === 'true' ? `<p><strong>Bairro CRAS:</strong> ${entrevista.bairro_cras || 'Não informado'}</p>` : ''}
                
                <p><strong>Recebe Benefício:</strong> ${entrevista.recebe_beneficio === 'true' ? 'Sim' : 'Não'}</p>
                ${entrevista.recebe_beneficio === 'true' ? `
                    <p><strong>Benefícios:</strong> 
                        ${[
                            entrevista.bolsa_familia === 'on' ? 'Bolsa Família' : '',
                            entrevista.bpc === 'on' ? 'BPC' : '',
                            entrevista.aposentadoria === 'on' ? 'Aposentadoria' : '',
                            entrevista.pensao === 'on' ? 'Pensão' : ''
                        ].filter(Boolean).join(', ') || 'Nenhum'}
                    </p>
                    <p><strong>Renda Familiar:</strong> ${entrevista.renda_familiar || 'Não informado'}</p>
                ` : ''}
            </div>
            <div class="col-md-6">
                <p><strong>Tipo de Moradia:</strong> ${entrevista.tipo_moradia || 'Não informado'}</p>
                <p><strong>Abastecimento de Água:</strong> ${entrevista.abastecimento_agua || 'Não informado'}</p>
                <p><strong>Iluminação:</strong> ${entrevista.iluminacao || 'Não informado'}</p>
            </div>
        </div>
        
        <h2 class="mt-4">Situações Específicas</h2>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Familiares em Privação de Liberdade:</strong> ${entrevista.familiares_privacao_liberdade === 'true' ? 'Sim' : 'Não'}</p>
                ${entrevista.familiares_privacao_liberdade === 'true' ? `<p><strong>Detalhes:</strong> ${entrevista.detalhes_privacao || 'Não informado'}</p>` : ''}
                
                <p><strong>Adolescentes em Medidas Socioeducativas:</strong> ${entrevista.adolescentes_medidas === 'true' ? 'Sim' : 'Não'}</p>
                ${entrevista.adolescentes_medidas === 'true' ? `<p><strong>Detalhes:</strong> ${entrevista.detalhes_medidas || 'Não informado'}</p>` : ''}
            </div>
            <div class="col-md-6">
                <p><strong>Acolhimento Institucional:</strong> ${entrevista.acolhimento_institucional === 'true' ? 'Sim' : 'Não'}</p>
                ${entrevista.acolhimento_institucional === 'true' ? `<p><strong>Detalhes:</strong> ${entrevista.detalhes_acolhimento || 'Não informado'}</p>` : ''}
                
                <p><strong>Participa de Atividade Socioeducativa:</strong> ${entrevista.participa_atividade === 'true' ? 'Sim' : 'Não'}</p>
                ${entrevista.participa_atividade === 'true' ? `
                    <p><strong>Qual Atividade:</strong> ${entrevista.qual_atividade || 'Não informado'}</p>
                    <p><strong>Dias da Semana:</strong> ${entrevista.dias_semana || 'Não informado'}</p>
                    <p><strong>Turno:</strong> ${entrevista.turno || 'Não informado'}</p>
                ` : ''}
            </div>
        </div>
    `;
    
    // Adicionar seção de familiares se existir
    if (entrevista.familiares) {
        try {
            const familiares = JSON.parse(entrevista.familiares);
            if (familiares.length > 0) {
                html += `
                    <h2 class="mt-4">Composição Familiar</h2>
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Idade</th>
                                    <th>Data Nascimento</th>
                                    <th>Renda</th>
                                    <th>Escolaridade</th>
                                    <th>Parentesco</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                familiares.forEach(familiar => {
                    html += `
                        <tr>
                            <td>${familiar.nome || '-'}</td>
                            <td>${familiar.idade || '-'}</td>
                            <td>${familiar.dataNasc || '-'}</td>
                            <td>${familiar.renda || '-'}</td>
                            <td>${familiar.escolaridade || '-'}</td>
                            <td>${familiar.parentesco || '-'}</td>
                        </tr>
                    `;
                });
                
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            }
        } catch (e) {
            console.error('Erro ao processar familiares:', e);
        }
    }
    
    // Adicionar seção de demanda e encaminhamentos
    html += `
        <h2 class="mt-4">Demanda e Encaminhamentos</h2>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Demanda Apresentada:</strong></p>
                <div class="p-3 bg-light">${entrevista.demanda_apresentada || 'Não informado'}</div>
            </div>
            <div class="col-md-6">
                <p><strong>Encaminhamentos:</strong></p>
                <div class="p-3 bg-light">${entrevista.encaminhamentos || 'Não informado'}</div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-md-12">
                <p class="text-muted">
                    <small>
                        Entrevista criada em: ${formatarData(entrevista.dataCriacao)}<br>
                        Última atualização: ${formatarData(entrevista.dataModificacao)}
                    </small>
                </p>
            </div>
        </div>
    `;
    
    // Inserir HTML no elemento
    $('#dadosEntrevista').html(html);
}

// Função para formatar data
function formatarData(dataString) {
    if (!dataString) return 'Não informado';
    
    try {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    } catch (e) {
        return dataString;
    }
}

// Função para exportar para Excel
function exportarParaExcel(entrevista) {
    try {
        // Criar um objeto formatado para melhor visualização no Excel
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
        
        // Criar planilha com os dados formatados
        const worksheet = XLSX.utils.json_to_sheet([dadosFormatados]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Entrevista");
        
        // Definir larguras de coluna personalizadas com base no conteúdo
        const wscols = [];
        const keys = Object.keys(dadosFormatados);
        
        // Definir larguras específicas para diferentes tipos de campos
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
        
        // Ajustar altura das linhas para melhor visualização
        const wsrows = [{ hpt: 25 }]; // Altura da primeira linha (cabeçalho)
        worksheet['!rows'] = wsrows;
        
        // Aplicar formatação para melhorar a visualização
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        
        // Formatar células para melhor visualização
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
        
        // Gerar arquivo e fazer download
        const nomeArquivo = `Entrevista_${entrevista.id}_${entrevista.nome || 'Sem_Nome'}.xlsx`;
        XLSX.writeFile(workbook, nomeArquivo);
        
        alert('Dados exportados com sucesso!');
    } catch (error) {
        console.error('Erro ao exportar:', error);
        alert('Erro ao exportar dados: ' + error.message);
    }
}