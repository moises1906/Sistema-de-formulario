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
    // Código de exportação para Excel (já implementado)
    // ...
}