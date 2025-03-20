$(document).ready(function() {
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
    
    // Limpar formulário
    $('#limparForm').click(function() {
        if(confirm('Tem certeza que deseja limpar todos os campos?')) {
            $('#entrevistaForm')[0].reset();
            $('#tabelaFamilia tbody').empty();
            $('.cras-field, .atividade-fields, .beneficios-fields, .privacao-field, .medidas-field, .acolhimento-field, .outro-abastecimento, .outro-iluminacao').hide();
        }
    });
    
    // Enviar formulário
    $('#entrevistaForm').submit(function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const formData = new FormData(this);
        
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
        
        formData.append('familiares', JSON.stringify(familiares));
        
        // Salvar no localStorage (simulando um banco de dados)
        const entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
        
        // Converter FormData para objeto
        const entrevistaObj = {};
        for (const [key, value] of formData.entries()) {
            entrevistaObj[key] = value;
        }
        
        // Adicionar ID e data de criação
        entrevistaObj.id = Date.now();
        entrevistaObj.dataCriacao = new Date().toISOString();
        
        entrevistas.push(entrevistaObj);
        localStorage.setItem('entrevistas', JSON.stringify(entrevistas));
        
        alert('Entrevista social cadastrada com sucesso!');
        window.location.href = 'index.html';
    });
    
    // Corrigir o problema do checkbox duplicado para "Termo de aplicação de medidas"
    $('input[name="documentos[]"][value="Termo de aplicação de medidas"]').each(function(index) {
        if (index > 0) {
            $(this).closest('.form-check').remove();
        }
    });
});