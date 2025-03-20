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