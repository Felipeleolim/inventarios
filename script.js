// Dados da aplicação
let appData = {
    company: {
        name: '',
        logo: null,
        address: '',
        contact: ''
    },
    credentials: [],
    notebooks: [],
    printers: [],
    users: [] // Para sugestões de usuários
};

// Elementos DOM
const elements = {
    // Abas principais
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Abas de equipamentos
    subtabBtns: document.querySelectorAll('.subtab-btn'),
    subtabContents: document.querySelectorAll('.subtab-content'),
    
    // Botões de arquivo
    newBtn: document.getElementById('new-btn'),
    fileInput: document.getElementById('file-input'),
    saveBtn: document.getElementById('save-btn'),
    
    // Formulário da empresa
    companyName: document.getElementById('company-name'),
    companyLogo: document.getElementById('company-logo'),
    companyAddress: document.getElementById('company-address'),
    companyContact: document.getElementById('company-contact'),
    
    // Formulário de credenciais
    serviceInput: document.getElementById('service-input'),
    urlInput: document.getElementById('url-input'),
    userInput: document.getElementById('user-input'),
    passwordInput: document.getElementById('password-input'),
    togglePassword: document.getElementById('toggle-password'),
    generatePasswordBtn: document.getElementById('generate-password-btn'),
    mfaCheckbox: document.getElementById('mfa-checkbox'),
    notesInput: document.getElementById('notes-input'),
    saveCredentialBtn: document.getElementById('save-credential-btn'),
    clearFormBtn: document.getElementById('clear-form-btn'),
    credentialsList: document.getElementById('credentials-list'),
    
    // Indicador de força da senha
    strengthBar: document.getElementById('strength-bar'),
    strengthText: document.getElementById('strength-text'),
    
    // Formulário de notebooks
    notebookUser: document.getElementById('notebook-user'),
    notebookBrand: document.getElementById('notebook-brand'),
    notebookSerial: document.getElementById('notebook-serial'),
    notebookOs: document.getElementById('notebook-os'),
    notebookConnections: document.querySelectorAll('input[name="notebook-connection"]'),
    saveNotebook: document.getElementById('save-notebook'),
    notebooksList: document.getElementById('notebooks-list'),
    
    // Formulário de impressoras
    printerName: document.getElementById('printer-name'),
    printerSerial: document.getElementById('printer-serial'),
    printerIp: document.getElementById('printer-ip'),
    printerLocation: document.getElementById('printer-location'),
    printerConnections: document.querySelectorAll('input[name="printer-connection"]'),
    printerUsersTags: document.getElementById('printer-users-tags'),
    printerUsersInput: document.getElementById('printer-users-input'),
    userSuggestions: document.getElementById('user-suggestions'),
    savePrinter: document.getElementById('save-printer'),
    printersList: document.getElementById('printers-list'),
    
    // Modal de senhas
    passwordModal: document.getElementById('password-modal'),
    closeModal: document.getElementById('close-modal'),
    lengthOptions: document.querySelectorAll('input[name="length"]'),
    characterOptions: document.querySelectorAll('input[name="uppercase"], input[name="lowercase"], input[name="numbers"], input[name="symbols"]'),
    generatedPassword: document.getElementById('generated-password'),
    copyPassword: document.getElementById('copy-password'),
    usePassword: document.getElementById('use-password'),
    regeneratePassword: document.getElementById('regenerate-password'),
    modalStrengthBar: document.getElementById('modal-strength-bar'),
    modalStrengthText: document.getElementById('modal-strength-text')
};

// Inicialização da aplicação
function init() {
    loadFromLocalStorage();
    setupEventListeners();
    updateSaveButtonState();
    generatePassword(); // Gerar senha inicial no modal
}

// Configuração de event listeners
function setupEventListeners() {
    // Abas principais
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Abas de equipamentos
    elements.subtabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchSubTab(btn.dataset.subtab));
    });

    // Ações de arquivo
    elements.newBtn.addEventListener('click', newFile);
    elements.fileInput.addEventListener('change', handleFileOpen);
    elements.saveBtn.addEventListener('click', saveToExcel);

    // Formulário da empresa
    elements.companyName.addEventListener('input', updateCompanyData);
    elements.companyAddress.addEventListener('input', updateCompanyData);
    elements.companyContact.addEventListener('input', updateCompanyData);
    elements.companyLogo.addEventListener('change', handleLogoUpload);

    // Formulário de credenciais
    elements.saveCredentialBtn.addEventListener('click', saveCredential);
    elements.clearFormBtn.addEventListener('click', clearCredentialForm);
    elements.togglePassword.addEventListener('click', togglePasswordVisibility);
    elements.generatePasswordBtn.addEventListener('click', openPasswordModal);
    elements.passwordInput.addEventListener('input', updatePasswordStrength);

    // Formulário de notebooks
    elements.saveNotebook.addEventListener('click', saveNotebook);

    // Formulário de impressoras
    elements.savePrinter.addEventListener('click', savePrinter);
    elements.printerUsersInput.addEventListener('input', showUserSuggestions);
    elements.printerUsersInput.addEventListener('keydown', handleTagInput);

    // Modal de senhas
    elements.closeModal.addEventListener('click', closePasswordModal);
    elements.copyPassword.addEventListener('click', copyGeneratedPassword);
    elements.usePassword.addEventListener('click', useGeneratedPassword);
    elements.regeneratePassword.addEventListener('click', generatePassword);
    
    // Atualizar senha no modal quando opções mudarem
    elements.lengthOptions.forEach(option => {
        option.addEventListener('change', generatePassword);
    });
    
    elements.characterOptions.forEach(option => {
        option.addEventListener('change', generatePassword);
    });

    // Fechar modal ao clicar fora
    elements.passwordModal.addEventListener('click', (e) => {
        if (e.target === elements.passwordModal) {
            closePasswordModal();
        }
    });

    // Fechar sugestões ao clicar fora
    document.addEventListener('click', (e) => {
        if (!elements.printerUsersInput.contains(e.target) && 
            !elements.userSuggestions.contains(e.target)) {
            hideUserSuggestions();
        }
    });

    // Tecla Escape para fechar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePasswordModal();
            hideUserSuggestions();
        }
    });
}

// Navegação entre abas
function switchTab(tabName) {
    // Atualizar botões das abas
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Atualizar conteúdo das abas
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });

    // Salvar estado atual
    saveToLocalStorage();
}

// Navegação entre sub-abas
function switchSubTab(subtabName) {
    // Atualizar botões das sub-abas
    elements.subtabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.subtab === subtabName);
    });

    // Atualizar conteúdo das sub-abas
    elements.subtabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${subtabName}-subtab`);
    });
}

// Gerenciamento de arquivos
function newFile() {
    if (confirm('Deseja criar um novo arquivo? Todos os dados não salvos serão perdidos.')) {
        appData = {
            company: { name: '', logo: null, address: '', contact: '' },
            credentials: [],
            notebooks: [],
            printers: [],
            users: []
        };
        
        clearForms();
        updateUI();
        saveToLocalStorage();
        alert('Novo arquivo criado com sucesso!');
    }
}

function handleFileOpen(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar se a biblioteca XLSX está disponível
    if (typeof XLSX === 'undefined') {
        alert('Erro: Biblioteca XLSX não carregada. Verifique a conexão com a internet.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Ler dados da empresa
            if (workbook.Sheets['Empresa']) {
                const companyData = XLSX.utils.sheet_to_json(workbook.Sheets['Empresa']);
                if (companyData.length > 0) {
                    appData.company = { ...appData.company, ...companyData[0] };
                }
            }
            
            // Ler credenciais
            if (workbook.Sheets['Credenciais']) {
                appData.credentials = XLSX.utils.sheet_to_json(workbook.Sheets['Credenciais']);
            }
            
            // Ler notebooks
            if (workbook.Sheets['Notebooks']) {
                appData.notebooks = XLSX.utils.sheet_to_json(workbook.Sheets['Notebooks']);
            }
            
            // Ler impressoras
            if (workbook.Sheets['Impressoras']) {
                appData.printers = XLSX.utils.sheet_to_json(workbook.Sheets['Impressoras']);
            }
            
            // Extrair usuários únicos para sugestões
            updateUsersList();
            
            updateUI();
            saveToLocalStorage();
            alert('Arquivo carregado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao ler arquivo:', error);
            alert('Erro ao ler o arquivo. Verifique se é um arquivo Excel válido.');
        }
    };
    
    reader.onerror = function() {
        alert('Erro ao ler o arquivo.');
    };
    
    reader.readAsArrayBuffer(file);
}

function saveToExcel() {
    try {
        // Verificar se a biblioteca XLSX está disponível
        if (typeof XLSX === 'undefined') {
            alert('Erro: Biblioteca XLSX não carregada. Verifique a conexão com a internet.');
            return;
        }

        const workbook = XLSX.utils.book_new();
        
        // Adicionar aba da empresa
        const companyWorksheet = XLSX.utils.json_to_sheet([appData.company]);
        XLSX.utils.book_append_sheet(workbook, companyWorksheet, 'Empresa');
        
        // Adicionar aba de credenciais
        const credentialsWorksheet = XLSX.utils.json_to_sheet(appData.credentials);
        XLSX.utils.book_append_sheet(workbook, credentialsWorksheet, 'Credenciais');
        
        // Adicionar aba de notebooks
        const notebooksWorksheet = XLSX.utils.json_to_sheet(appData.notebooks);
        XLSX.utils.book_append_sheet(workbook, notebooksWorksheet, 'Notebooks');
        
        // Adicionar aba de impressoras
        const printersWorksheet = XLSX.utils.json_to_sheet(appData.printers);
        XLSX.utils.book_append_sheet(workbook, printersWorksheet, 'Impressoras');
        
        // Gerar nome do arquivo
        const fileName = appData.company.name 
            ? `Gerenciador_TI_${appData.company.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
            : `Gerenciador_TI_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Salvar arquivo
        XLSX.writeFile(workbook, fileName);
        alert('Arquivo salvo com sucesso!');
        
    } catch (error) {
        console.error('Erro ao salvar arquivo:', error);
        alert('Erro ao salvar o arquivo: ' + error.message);
    }
}

// Formulário da empresa
function updateCompanyData() {
    appData.company = {
        name: elements.companyName.value,
        logo: appData.company.logo, // Mantém o logo existente
        address: elements.companyAddress.value,
        contact: elements.companyContact.value
    };
    
    updateSaveButtonState();
    saveToLocalStorage();
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Verificar se é uma imagem
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione um arquivo de imagem.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            appData.company.logo = e.target.result;
            saveToLocalStorage();
            alert('Logo atualizado com sucesso!');
        };
        reader.onerror = function() {
            alert('Erro ao carregar a imagem.');
        };
        reader.readAsDataURL(file);
    }
}

// Formulário de credenciais
function saveCredential() {
    if (!validateCredentialForm()) return;

    const credential = {
        id: Date.now().toString(),
        service: elements.serviceInput.value.trim(),
        url: elements.urlInput.value.trim(),
        username: elements.userInput.value.trim(),
        password: elements.passwordInput.value,
        mfa: elements.mfaCheckbox.checked,
        notes: elements.notesInput.value.trim(),
        createdAt: new Date().toISOString()
    };

    appData.credentials.push(credential);
    updateCredentialsTable();
    clearCredentialForm();
    saveToLocalStorage();
    
    alert('Credencial salva com sucesso!');
}

function validateCredentialForm() {
    const required = [
        { field: elements.serviceInput, name: 'Serviço' },
        { field: elements.urlInput, name: 'URL' },
        { field: elements.userInput, name: 'Usuário/E-mail' },
        { field: elements.passwordInput, name: 'Senha' }
    ];

    for (let { field, name } of required) {
        if (!field.value.trim()) {
            alert(`Por favor, preencha o campo: ${name}`);
            field.focus();
            return false;
        }
    }

    // Validar URL
    try {
        new URL(elements.urlInput.value);
    } catch {
        alert('Por favor, insira uma URL válida (inclua http:// ou https://).');
        elements.urlInput.focus();
        return false;
    }

    return true;
}

function clearCredentialForm() {
    elements.serviceInput.value = '';
    elements.urlInput.value = '';
    elements.userInput.value = '';
    elements.passwordInput.value = '';
    elements.mfaCheckbox.checked = false;
    elements.notesInput.value = '';
    elements.passwordInput.type = 'password';
    elements.togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
    updatePasswordStrength();
}

function updateCredentialsTable() {
    elements.credentialsList.innerHTML = '';

    if (appData.credentials.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" style="text-align: center; color: #7f8c8d;">Nenhuma credencial cadastrada</td>`;
        elements.credentialsList.appendChild(row);
        return;
    }

    appData.credentials.forEach(credential => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${escapeHtml(credential.service)}</td>
            <td><a href="${credential.url}" target="_blank" rel="noopener">${escapeHtml(credential.url)}</a></td>
            <td>${escapeHtml(credential.username)}</td>
            <td>
                <span class="password-field">••••••••</span>
                <button class="action-btn show-password" data-password="${escapeHtml(credential.password)}" title="Mostrar/ocultar senha">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn copy-password" data-password="${escapeHtml(credential.password)}" title="Copiar senha">
                    <i class="fas fa-copy"></i>
                </button>
            </td>
            <td>${credential.mfa ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-muted"></i>'}</td>
            <td>${escapeHtml(credential.notes || '-')}</td>
            <td>
                <button class="action-btn edit-credential" data-id="${credential.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-credential" data-id="${credential.id}" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        // Event listeners para os botões da linha
        const showPasswordBtn = row.querySelector('.show-password');
        const copyPasswordBtn = row.querySelector('.copy-password');
        const editBtn = row.querySelector('.edit-credential');
        const deleteBtn = row.querySelector('.delete-credential');

        showPasswordBtn.addEventListener('click', function() {
            const passwordField = this.parentElement.querySelector('.password-field');
            const icon = this.querySelector('i');
            if (passwordField.textContent === '••••••••') {
                passwordField.textContent = this.dataset.password;
                icon.className = 'fas fa-eye-slash';
            } else {
                passwordField.textContent = '••••••••';
                icon.className = 'fas fa-eye';
            }
        });

        copyPasswordBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(this.dataset.password).then(() => {
                showNotification('Senha copiada para a área de transferência!');
            }).catch(() => {
                // Fallback para navegadores mais antigos
                const textArea = document.createElement('textarea');
                textArea.value = this.dataset.password;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Senha copiada para a área de transferência!');
            });
        });

        editBtn.addEventListener('click', () => editCredential(credential.id));
        deleteBtn.addEventListener('click', () => deleteCredential(credential.id));

        elements.credentialsList.appendChild(row);
    });
}

function editCredential(id) {
    const credential = appData.credentials.find(c => c.id === id);
    if (!credential) return;

    elements.serviceInput.value = credential.service;
    elements.urlInput.value = credential.url;
    elements.userInput.value = credential.username;
    elements.passwordInput.value = credential.password;
    elements.mfaCheckbox.checked = credential.mfa;
    elements.notesInput.value = credential.notes || '';

    // Remover a credencial da lista (será readicionada ao salvar)
    appData.credentials = appData.credentials.filter(c => c.id !== id);
    updateCredentialsTable();
    
    elements.saveCredentialBtn.scrollIntoView({ behavior: 'smooth' });
    showNotification('Credencial carregada para edição. Faça as alterações e clique em Salvar Credencial.');
}

function deleteCredential(id) {
    if (confirm('Tem certeza que deseja excluir esta credencial?')) {
        appData.credentials = appData.credentials.filter(c => c.id !== id);
        updateCredentialsTable();
        saveToLocalStorage();
        showNotification('Credencial excluída com sucesso!');
    }
}

// Gerenciamento de senhas
function togglePasswordVisibility() {
    const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
    elements.passwordInput.type = type;
    elements.togglePassword.innerHTML = type === 'password' ? 
        '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
}

function updatePasswordStrength() {
    const password = elements.passwordInput.value;
    const strength = calculatePasswordStrength(password);
    
    elements.strengthBar.className = 'strength-bar';
    elements.strengthBar.classList.add(`strength-${strength.level}`);
    elements.strengthText.textContent = `Força: ${strength.text}`;
    elements.strengthText.style.color = strength.color;
}

function calculatePasswordStrength(password) {
    if (!password) return { level: 'weak', text: 'Fraca', color: '#e74c3c' };
    
    let score = 0;
    
    // Comprimento
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    // Caracteres diversos
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score >= 6) return { level: 'strong', text: 'Forte', color: '#27ae60' };
    if (score >= 4) return { level: 'good', text: 'Boa', color: '#3498db' };
    if (score >= 2) return { level: 'fair', text: 'Razoável', color: '#f39c12' };
    return { level: 'weak', text: 'Fraca', color: '#e74c3c' };
}

// Modal de senhas
function openPasswordModal() {
    elements.passwordModal.classList.add('active');
    generatePassword();
}

function closePasswordModal() {
    elements.passwordModal.classList.remove('active');
}

function generatePassword() {
    const length = parseInt(document.querySelector('input[name="length"]:checked').value);
    const uppercase = document.querySelector('input[name="uppercase"]').checked;
    const lowercase = document.querySelector('input[name="lowercase"]').checked;
    const numbers = document.querySelector('input[name="numbers"]').checked;
    const symbols = document.querySelector('input[name="symbols"]').checked;

    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Garantir que pelo menos um tipo de caractere seja selecionado
    if (charset === '') {
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    elements.generatedPassword.value = password;
    updateModalPasswordStrength(password);
}

function updateModalPasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    
    elements.modalStrengthBar.className = 'strength-bar';
    elements.modalStrengthBar.classList.add(`strength-${strength.level}`);
    elements.modalStrengthText.textContent = `Força: ${strength.text}`;
    elements.modalStrengthText.style.color = strength.color;
}

function copyGeneratedPassword() {
    navigator.clipboard.writeText(elements.generatedPassword.value).then(() => {
        showNotification('Senha copiada para a área de transferência!');
    }).catch(() => {
        // Fallback
        elements.generatedPassword.select();
        document.execCommand('copy');
        showNotification('Senha copiada para a área de transferência!');
    });
}

function useGeneratedPassword() {
    elements.passwordInput.value = elements.generatedPassword.value;
    updatePasswordStrength();
    closePasswordModal();
    showNotification('Senha aplicada ao formulário!');
}

// [CONTINUA... O restante do código permanece igual]

// Sistema de notificação
function showNotification(message, type = 'success') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicione estes keyframes no CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .text-success { color: #27ae60; }
    .text-muted { color: #7f8c8d; }
`;
document.head.appendChild(style);

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);
