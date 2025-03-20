$(document).ready(function() {
    // Obter ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    
    if (!id) {
        showAlert('danger', 'ID da entrevista não fornecido.', true);
        $('#entrevistaForm').hide();
        return;
    }
    
    // Carregar dados da entrevista
    const entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
    const entrevista = entrevistas.find(e => e.id === id);
    
    if (!entrevista) {
        showAlert('danger', 'Entrevista não encontrada.', true);
        $('#entrevistaForm').hide();
        return;
    }
    
    // Preencher o formulário com os dados da entrevista
    preencherFormulario(entrevista);
    
    // Configurar eventos para campos condicionais
    setupConditionalFields();
    
    // Configurar tabela de familiares
    setupFamiliaresTable(entrevista);
    
    // Configurar modal de familiares
    setupFamiliarModal();
    
    // Limpar formulário
    $('#limparForm').click(function() {
        if(confirm('Tem certeza que deseja limpar todos os campos? As alterações não salvas serão perdidas.')) {
            preencherFormulario(entrevista);
        }
    });
    
    // Processar o formulário
    $('#entrevistaForm').submit(function(e) {
        e.preventDefault();
        salvarEntrevista(id);
    });
});

function showAlert(type, message, withBackLink = false) {
    let html = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}`;
        
    if (withBackLink) {
        html += ` <a href="index.html">Voltar para a lista</a>`;
    }
    
    html += `<button type="button" class="close" data-dismiss="alert" aria-label="Fechar">
        <span aria-hidden="true">&times;</span>
    </button>
    </div>`;
    
    $('#alertContainer').html(html);
}

function preencherFormulario(entrevista) {
    // Preencher ID
    $('#id').val(entrevista.id);
    
    // Preencher campos de texto simples
    for (const key in entrevista) {
        const $campo = $(`#${key}`);
        if ($campo.length && !$campo.is(':checkbox') && !$campo.is(':radio')) {
            $campo.val(entrevista[key]);
        }
    }
    
    // Preencher campos de data
    if (entrevista.data_nascimento) {
        $('#data_nascimento').val(entrevista.data_nascimento.split('T')[0]);
    }
    
    // Preencher checkboxes
    if (entrevista.bolsa_familia === 'on') $('#bolsa_familia').prop('checked', true);
    if (entrevista.bpc === 'on') $('#bpc').prop('checked', true);
    if (entrevista.aposentadoria === 'on') $('#aposentadoria').prop('checked', true);
    if (entrevista.pensao === 'on') $('#pensao').prop('checked', true);
    
    // Preencher radio buttons
    if (entrevista.cadastro_cras) {
        $(`input[name="cadastro_cras"][value="${entrevista.cadastro_cras}"]`).prop('checked', true);
    }
    
    if (entrevista.recebe_beneficio) {
        $(`input[name="recebe_beneficio"][value="${entrevista.recebe_beneficio}"]`).prop('checked', true);
    }
    
    if (entrevista.familiares_privacao_liberdade) {
        $(`input[name="familiares_privacao_liberdade"][value="${entrevista.familiares_privacao_liberdade}"]`).prop('checked', true);
    }
    
    if (entrevista.adolescentes_medidas) {
        $(`input[name="adolescentes_medidas"][value="${entrevista.adolescentes_medidas}"]`).prop('checked', true);
    }
    
    if (entrevista.acolhimento_institucional) {
        $(`input[name="acolhimento_institucional"][value="${entrevista.acolhimento_institucional}"]`).prop('checked', true);
    }
    
    if (entrevista.participa_atividade) {
        $(`input[name="participa_atividade"][value="${entrevista.participa_atividade}"]`).prop('checked', true);
    }
    
    // Adicionar eventos para os campos de atividades socioeducativas
    $('#atividade_sim').change(function() {
        if($(this).is(':checked')) {
            $('.atividade-fields').show();
        }
    });
    
    $('#atividade_nao').change(function() {
        if($(this).is(':checked')) {
            $('.atividade-fields').hide();
            $('#qual_atividade, #dias_semana, #turno').val('');
        }
    });
    
    // Verificar se há dados de atividades para exibir os campos
    if (entrevista.qual_atividade || entrevista.dias_semana || entrevista.turno) {
        $('#atividade_sim').prop('checked', true).trigger('change');
    }
}

function setupConditionalFields() {
    // Mostrar/esconder campos condicionais
    $('#cras_sim').change(function() {
        if($(this).is(':checked')) {
            $('.cras-field').show();
        }
    });
    
    $('#cras_nao').change(function() {
        if($(this).is(':checked')) {
            $('.cras-field').hide();
            $('#bairro_cras').val('');
        }
    });
    
    $('#beneficio_sim').change(function() {
        if($(this).is(':checked')) {
            $('.beneficios-fields').show();
        }
    });
    
    $('#beneficio_nao').change(function() {
        if($(this).is(':checked')) {
            $('.beneficios-fields').hide();
            $('#bolsa_familia, #bpc, #aposentadoria, #pensao').prop('checked', false);
            $('#renda_familiar').val('');
        }
    });
    
    $('#privacao_sim').change(function() {
        if($(this).is(':checked')) {
            $('.privacao-field').show();
        }
    });
    
    $('#privacao_nao').change(function() {
        if($(this).is(':checked')) {
            $('.privacao-field').hide();
            $('#detalhes_privacao').val('');
        }
    });
    
    $('#medidas_sim').change(function() {
        if($(this).is(':checked')) {
            $('.medidas-field').show();
        }
    });
    
    $('#medidas_nao').change(function() {
        if($(this).is(':checked')) {
            $('.medidas-field').hide();
            $('#detalhes_medidas').val('');
        }
    });
    
    $('#acolhimento_sim').change(function() {
        if($(this).is(':checked')) {
            $('.acolhimento-field').show();
        }
    });
    
    $('#acolhimento_nao').change(function() {
        if($(this).is(':checked')) {
            $('.acolhimento-field').hide();
            $('#detalhes_acolhimento').val('');
        }
    });
    
    $('#abastecimento_agua').change(function() {
        if($(this).val() === 'outro') {
            $('.outro-abastecimento').show();
        } else {
            $('.outro-abastecimento').hide();
            $('#outro_abastecimento').val('');
        }
    });
    
    $('#iluminacao').change(function() {
        if($(this).val() === 'outro') {
            $('.outro-iluminacao').show();
        } else {
            $('.outro-iluminacao').hide();
            $('#outro_iluminacao').val('');
        }
    });
    
    // Adicionar evento para atividades socioeducativas
    $('#atividade_sim').change(function() {
        if($(this).is(':checked')) {
            $('.atividade-fields').show();
        }
    });
    
    $('#atividade_nao').change(function() {
        if($(this).is(':checked')) {
            $('.atividade-fields').hide();
            $('#qual_atividade, #dias_semana, #turno').val('');
        }
    });
}

function setupFamiliaresTable(entrevista) {
    // Adicionar familiar
    $('#addFamiliar').click(function() {
        $('#familiarModal').modal('show');
    });
    
    // Salvar familiar
    $('#salvarFamiliar').click(function() {
        const nome = $('#familiar_nome').val();
        if (!nome) {
            alert('O nome do familiar é obrigatório!');
            return;
        }
        
        const idade = $('#familiar_idade').val();
        const dataNasc = $('#familiar_data_nasc').val();
        const renda = $('#familiar_renda').val();
        const escolaridade = $('#familiar_escolaridade').val();
        const parentesco = $('#familiar_parentesco').val();
        
        const row = `
            <tr>
                <td>${nome}</td>
                <td>${idade || '-'}</td>
                <td>${dataNasc || '-'}</td>
                <td>${renda ? 'R$ ' + parseFloat(renda).toFixed(2) : '-'}</td>
                <td>${escolaridade || '-'}</td>
                <td>${parentesco || '-'}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger remover-familiar">Remover</button>
                </td>
            </tr>
        `;
        
        $('#tabelaFamilia tbody').append(row);
        
        // Limpar o formulário
        $('#familiarForm')[0].reset();
        $('#familiarModal').modal('hide');
    });
    
    // Remover familiar
    $(document).on('click', '.remover-familiar', function() {
        $(this).closest('tr').remove();
    });
    
    // Preencher tabela de familiares
    if (entrevista.familiares) {
        try {
            const familiares = JSON.parse(entrevista.familiares);
            familiares.forEach(familiar => {
                const row = `
                    <tr>
                        <td>${familiar.nome}</td>
                        <td>${familiar.idade || '-'}</td>
                        <td>${familiar.dataNasc || '-'}</td>
                        <td>${familiar.renda || '-'}</td>
                        <td>${familiar.escolaridade || '-'}</td>
                        <td>${familiar.parentesco || '-'}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-danger remover-familiar">Remover</button>
                        </td>
                    </tr>
                `;
                
                $('#tabelaFamilia tbody').append(row);
            });
        } catch (e) {
            console.error('Erro ao carregar familiares:', e);
        }
    }
}

function salvarEntrevista(id) {
    // Coletar dados do formulário
    const formData = new FormData(document.getElementById('entrevistaForm'));
    
    // Adicionar dados da tabela de familiares
    const familiares = [];
    $('#tabelaFamilia tbody tr').each(function() {
        const cells = $(this).find('td');
        familiares.push({
            nome: $(cells[0]).text(),
            idade: $(cells[1]).text(),
            dataNasc: $(cells[2]).text(),
            renda: $(cells[3]).text(),
            escolaridade: $(cells[4]).text(),
            parentesco: $(cells[5]).text()
        });
    });
    
    // Converter FormData para objeto
    const entrevistaAtualizada = {};
    for (const [key, value] of formData.entries()) {
        entrevistaAtualizada[key] = value;
    }
    
    // Adicionar familiares
    entrevistaAtualizada.familiares = JSON.stringify(familiares);
    
    // Atualizar entrevista no localStorage
    const entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
    const index = entrevistas.findIndex(e => e.id === id);
    
    if (index !== -1) {
        // Manter a data de criação original
        entrevistaAtualizada.dataCriacao = entrevistas[index].dataCriacao;
        // Atualizar data de modificação
        entrevistaAtualizada.dataModificacao = new Date().toISOString();
        
        entrevistas[index] = entrevistaAtualizada;
        localStorage.setItem('entrevistas', JSON.stringify(entrevistas));
        
        showAlert('success', 'Entrevista atualizada com sucesso!');
        
        // Redirecionar para a página de visualização após 2 segundos
        setTimeout(() => {
            window.location.href = `visualizar.html?id=${id}`;
        }, 2000);
    } else {
        showAlert('danger', 'Erro ao atualizar entrevista. Registro não encontrado.');
    }
}

// Função para cancelar edição e voltar para visualização
function cancelarEdicao(id) {
    if(confirm('Tem certeza que deseja cancelar a edição? Todas as alterações serão perdidas.')) {
        window.location.href = `visualizar.html?id=${id}`;
    }
}

// Remover a função de adicionar botões na página de edição
// Comentando esta parte para não adicionar os botões na página de edição
/*
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    
    // Adicionar botão de cancelar após o botão limpar
    $('#limparForm').after(`<button type="button" class="btn btn-danger mr-2" id="cancelarEdicao">Cancelar</button>`);
    
    // Adicionar botão de exportar
    $('.btn-primary').before(`<button type="button" class="btn btn-success mr-2" id="exportarExcel">Exportar para Excel</button>`);
    
    // Configurar evento do botão cancelar
    $('#cancelarEdicao').click(function() {
        cancelarEdicao(id);
    });
    
    // Configurar evento do botão exportar
    $('#exportarExcel').click(function() {
        exportarParaExcel(id);
    });
});
*/

// Manter apenas a função de exportar para Excel
function exportarParaExcel(id) {
    // Carregar dados da entrevista
    const entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
    const entrevista = entrevistas.find(e => e.id === id);
    
    if (!entrevista) {
        showAlert('danger', 'Entrevista não encontrada para exportação.');
        return;
    }
    
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
        
        // Ajustar largura das colunas
        const wscols = Object.keys(dadosFormatados).map(() => ({ wch: 30 }));
        worksheet['!cols'] = wscols;
        
        // Gerar arquivo e fazer download
        const nomeArquivo = `Entrevista_${entrevista.id}_${entrevista.nome || 'Sem_Nome'}.xlsx`;
        XLSX.writeFile(workbook, nomeArquivo);
        
        showAlert('success', 'Dados exportados com sucesso!');
    } catch (error) {
        console.error('Erro ao exportar:', error);
        showAlert('danger', 'Erro ao exportar dados: ' + error.message);
    }
}