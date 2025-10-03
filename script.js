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
    users: [], // Para sugestões de usuários
    anydesk: [] // Nova propriedade para armazenar configurações do Anydesk
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
    
    // Formulário do Anydesk
    anydeskIp: document.getElementById('anydesk-ip'),
    anydeskUser: document.getElementById('anydesk-user'),
    anydeskNotes: document.getElementById('anydesk-notes'),
    saveAnydesk: document.getElementById('save-anydesk'),
    clearAnydesk: document.getElementById('clear-anydesk'),
    anydeskList: document.getElementById('anydesk-list'),
    
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
    updateUsersList(); // Atualizar lista de usuários para o Anydesk
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

    // Formulário do Anydesk
    elements.saveAnydesk.addEventListener('click', saveAnydesk);
    elements.clearAnydesk.addEventListener('click', clearAnydeskForm);
    elements.anydeskIp.addEventListener('input', formatAnydeskIp);

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
            elements.userSuggestions.style.display = 'none';
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
            users: [],
            anydesk: []
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

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Ler dados da empresa
            if (workbook.Sheets['Empresa']) {
                const companyData = XLSX.utils.sheet_to_json(workbook.Sheets['Empresa']);
                if (companyData.length > 0) {
                    appData.company = companyData[0];
                }
            }
            
            // Ler credenciais
            if (workbook.Sheets['Credenciais']) {
                appData.credentials = XLSX.utils.sheet_to_json(workbook.Sheets['Credenciais']);
            }
            
            // Ler notebooks - com tratamento para arrays
            if (workbook.Sheets['Notebooks']) {
                const notebooksData = XLSX.utils.sheet_to_json(workbook.Sheets['Notebooks']);
                appData.notebooks = notebooksData.map(notebook => ({
                    ...notebook,
                    connections: typeof notebook.connections === 'string' 
                        ? notebook.connections.split(', ') 
                        : (notebook.connections || [])
                }));
            }
            
            // Ler impressoras - com tratamento para arrays
            if (workbook.Sheets['Impressoras']) {
                const printersData = XLSX.utils.sheet_to_json(workbook.Sheets['Impressoras']);
                appData.printers = printersData.map(printer => ({
                    ...printer,
                    users: typeof printer.users === 'string' 
                        ? printer.users.split(', ') 
                        : (printer.users || [])
                }));
            }
            
            // Ler configurações do Anydesk
            if (workbook.Sheets['Anydesk']) {
                appData.anydesk = XLSX.utils.sheet_to_json(workbook.Sheets['Anydesk']);
            }
            
            updateUI();
            saveToLocalStorage();
            alert('Arquivo carregado com sucesso!');
            
        } catch (error) {
            console.error('Erro detalhado:', error);
            alert('Erro ao ler o arquivo: ' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

function saveToExcel() {
    try {
        const workbook = XLSX.utils.book_new();
        
        // Adicionar aba da empresa
        const companyWorksheet = XLSX.utils.json_to_sheet([appData.company]);
        XLSX.utils.book_append_sheet(workbook, companyWorksheet, 'Empresa');
        
        // Adicionar aba de credenciais
        const credentialsWorksheet = XLSX.utils.json_to_sheet(appData.credentials);
        XLSX.utils.book_append_sheet(workbook, credentialsWorksheet, 'Credenciais');
        
        // Adicionar aba de notebooks - converter arrays para strings
        const notebooksForExport = appData.notebooks.map(notebook => ({
            ...notebook,
            connections: Array.isArray(notebook.connections) 
                ? notebook.connections.join(', ') 
                : notebook.connections
        }));
        const notebooksWorksheet = XLSX.utils.json_to_sheet(notebooksForExport);
        XLSX.utils.book_append_sheet(workbook, notebooksWorksheet, 'Notebooks');
        
        // Adicionar aba de impressoras - converter arrays para strings
        const printersForExport = appData.printers.map(printer => ({
            ...printer,
            users: Array.isArray(printer.users) 
                ? printer.users.join(', ') 
                : printer.users
        }));
        const printersWorksheet = XLSX.utils.json_to_sheet(printersForExport);
        XLSX.utils.book_append_sheet(workbook, printersWorksheet, 'Impressoras');
        
        // Adicionar aba do Anydesk
        const anydeskWorksheet = XLSX.utils.json_to_sheet(appData.anydesk);
        XLSX.utils.book_append_sheet(workbook, anydeskWorksheet, 'Anydesk');
        
        // Gerar nome do arquivo
        const fileName = appData.company.name 
            ? `Gerenciador_TI_${appData.company.name.replace(/\s+/g, '_')}.xlsx`
            : 'Gerenciador_TI.xlsx';
        
        // Salvar arquivo
        XLSX.writeFile(workbook, fileName);
        alert('Arquivo salvo com sucesso!');
        
    } catch (error) {
        console.error('Erro ao salvar:', error);
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
        const reader = new FileReader();
        reader.onload = function(e) {
            appData.company.logo = e.target.result;
            saveToLocalStorage();
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
        elements.serviceInput,
        elements.urlInput,
        elements.userInput,
        elements.passwordInput
    ];

    for (let field of required) {
        if (!field.value.trim()) {
            alert(`Por favor, preencha o campo: ${field.previousElementSibling.textContent}`);
            field.focus();
            return false;
        }
    }

    // Validar URL
    try {
        new URL(elements.urlInput.value);
    } catch {
        alert('Por favor, insira uma URL válida.');
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
    updatePasswordStrength();
}

function updateCredentialsTable() {
    elements.credentialsList.innerHTML = '';

    appData.credentials.forEach(credential => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${escapeHtml(credential.service)}</td>
            <td><a href="${credential.url}" target="_blank">${escapeHtml(credential.url)}</a></td>
            <td>${escapeHtml(credential.username)}</td>
            <td>
                <span class="password-field">••••••••</span>
                <button class="action-btn show-password" data-password="${escapeHtml(credential.password)}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn copy-password" data-password="${escapeHtml(credential.password)}">
                    <i class="fas fa-copy"></i>
                </button>
            </td>
            <td>${credential.mfa ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-muted"></i>'}</td>
            <td>${escapeHtml(credential.notes || '-')}</td>
            <td>
                <button class="action-btn edit-credential" data-id="${credential.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-credential" data-id="${credential.id}">
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
            if (passwordField.textContent === '••••••••') {
                passwordField.textContent = this.dataset.password;
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordField.textContent = '••••••••';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });

        copyPasswordBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(this.dataset.password).then(() => {
                alert('Senha copiada para a área de transferência!');
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
}

function deleteCredential(id) {
    if (confirm('Tem certeza que deseja excluir esta credencial?')) {
        appData.credentials = appData.credentials.filter(c => c.id !== id);
        updateCredentialsTable();
        saveToLocalStorage();
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
}

function calculatePasswordStrength(password) {
    if (!password) return { level: 'weak', text: 'Fraca' };
    
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
    
    if (score >= 6) return { level: 'strong', text: 'Forte' };
    if (score >= 4) return { level: 'good', text: 'Boa' };
    if (score >= 2) return { level: 'fair', text: 'Razoável' };
    return { level: 'weak', text: 'Fraca' };
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
}

function copyGeneratedPassword() {
    navigator.clipboard.writeText(elements.generatedPassword.value).then(() => {
        alert('Senha copiada para a área de transferência!');
    });
}

function useGeneratedPassword() {
    elements.passwordInput.value = elements.generatedPassword.value;
    updatePasswordStrength();
    closePasswordModal();
}

// Formulário de notebooks
function saveNotebook() {
    if (!validateNotebookForm()) return;

    const connections = Array.from(elements.notebookConnections)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const notebook = {
        id: Date.now().toString(),
        user: elements.notebookUser.value.trim(),
        brand: elements.notebookBrand.value.trim(),
        serial: elements.notebookSerial.value.trim(),
        os: elements.notebookOs.value,
        connections: connections,
        createdAt: new Date().toISOString()
    };

    appData.notebooks.push(notebook);
    updateNotebooksTable();
    clearNotebookForm();
    saveToLocalStorage();
    
    // Adicionar usuário à lista de sugestões
    if (notebook.user && !appData.users.includes(notebook.user)) {
        appData.users.push(notebook.user);
    }
    
    // Atualizar lista de usuários no formulário do Anydesk
    updateUsersList();
    
    alert('Notebook salvo com sucesso!');
}

function validateNotebookForm() {
    const required = [
        elements.notebookUser,
        elements.notebookBrand,
        elements.notebookOs
    ];

    for (let field of required) {
        if (!field.value.trim()) {
            alert(`Por favor, preencha o campo: ${field.previousElementSibling.textContent}`);
            field.focus();
            return false;
        }
    }

    // Verificar se pelo menos uma conexão foi selecionada
    const connectionsSelected = Array.from(elements.notebookConnections).some(cb => cb.checked);
    if (!connectionsSelected) {
        alert('Por favor, selecione pelo menos um tipo de conexão.');
        return false;
    }

    return true;
}

function clearNotebookForm() {
    elements.notebookUser.value = '';
    elements.notebookBrand.value = '';
    elements.notebookSerial.value = '';
    elements.notebookOs.value = '';
    elements.notebookConnections.forEach(cb => cb.checked = false);
}

function updateNotebooksTable() {
    elements.notebooksList.innerHTML = '';

    appData.notebooks.forEach(notebook => {
        const row = document.createElement('tr');
        
        // Garantir que connections seja um array
        const connections = Array.isArray(notebook.connections) 
            ? notebook.connections 
            : (notebook.connections ? [notebook.connections] : []);
        
        row.innerHTML = `
            <td>${escapeHtml(notebook.user || '')}</td>
            <td>${escapeHtml(notebook.brand || '')}</td>
            <td>${escapeHtml(notebook.serial || '-')}</td>
            <td>${escapeHtml(notebook.os || '')}</td>
            <td>${connections.join(', ')}</td>
            <td>
                <button class="action-btn edit-notebook" data-id="${notebook.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-notebook" data-id="${notebook.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        const editBtn = row.querySelector('.edit-notebook');
        const deleteBtn = row.querySelector('.delete-notebook');

        editBtn.addEventListener('click', () => editNotebook(notebook.id));
        deleteBtn.addEventListener('click', () => deleteNotebook(notebook.id));

        elements.notebooksList.appendChild(row);
    });
}

function editNotebook(id) {
    const notebook = appData.notebooks.find(n => n.id === id);
    if (!notebook) return;

    elements.notebookUser.value = notebook.user;
    elements.notebookBrand.value = notebook.brand;
    elements.notebookSerial.value = notebook.serial;
    elements.notebookOs.value = notebook.os;
    
    // Marcar conexões
    elements.notebookConnections.forEach(cb => {
        cb.checked = notebook.connections.includes(cb.value);
    });

    // Remover o notebook da lista
    appData.notebooks = appData.notebooks.filter(n => n.id !== id);
    updateNotebooksTable();
    
    elements.saveNotebook.scrollIntoView({ behavior: 'smooth' });
}

function deleteNotebook(id) {
    if (confirm('Tem certeza que deseja excluir este notebook?')) {
        appData.notebooks = appData.notebooks.filter(n => n.id !== id);
        updateNotebooksTable();
        saveToLocalStorage();
    }
}

// Formulário de impressoras
function savePrinter() {
    if (!validatePrinterForm()) return;

    const connection = document.querySelector('input[name="printer-connection"]:checked').value;
    const users = Array.from(elements.printerUsersTags.querySelectorAll('.tag'))
        .map(tag => tag.querySelector('.tag-text').textContent);

    const printer = {
        id: Date.now().toString(),
        name: elements.printerName.value.trim(),
        serial: elements.printerSerial.value.trim(),
        ip: elements.printerIp.value.trim(),
        location: elements.printerLocation.value.trim(),
        connection: connection,
        users: users,
        createdAt: new Date().toISOString()
    };

    appData.printers.push(printer);
    updatePrintersTable();
    clearPrinterForm();
    saveToLocalStorage();
    
    // Adicionar usuários à lista de sugestões
    users.forEach(user => {
        if (user && !appData.users.includes(user)) {
            appData.users.push(user);
        }
    });
    
    // Atualizar lista de usuários no formulário do Anydesk
    updateUsersList();
    
    alert('Impressora salva com sucesso!');
}

function validatePrinterForm() {
    const required = [
        elements.printerName,
        elements.printerLocation
    ];

    for (let field of required) {
        if (!field.value.trim()) {
            alert(`Por favor, preencha o campo: ${field.previousElementSibling.textContent}`);
            field.focus();
            return false;
        }
    }

    return true;
}

function clearPrinterForm() {
    elements.printerName.value = '';
    elements.printerSerial.value = '';
    elements.printerIp.value = '';
    elements.printerLocation.value = '';
    elements.printerUsersTags.innerHTML = '';
    elements.printerUsersInput.value = '';
}

function updatePrintersTable() {
    elements.printersList.innerHTML = '';

    appData.printers.forEach(printer => {
        const row = document.createElement('tr');
        
        // Garantir que users seja um array
        const users = Array.isArray(printer.users) 
            ? printer.users 
            : (printer.users ? [printer.users] : []);
        
        row.innerHTML = `
            <td>${escapeHtml(printer.name || '')}</td>
            <td>${escapeHtml(printer.serial || '-')}</td>
            <td>${escapeHtml(printer.location || '')}</td>
            <td>${escapeHtml(printer.connection || '')}</td>
            <td>${users.length > 0 ? users.join(', ') : '-'}</td>
            <td>
                <button class="action-btn edit-printer" data-id="${printer.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-printer" data-id="${printer.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        const editBtn = row.querySelector('.edit-printer');
        const deleteBtn = row.querySelector('.delete-printer');

        editBtn.addEventListener('click', () => editPrinter(printer.id));
        deleteBtn.addEventListener('click', () => deletePrinter(printer.id));

        elements.printersList.appendChild(row);
    });
}

function editPrinter(id) {
    const printer = appData.printers.find(p => p.id === id);
    if (!printer) return;

    elements.printerName.value = printer.name;
    elements.printerSerial.value = printer.serial;
    elements.printerIp.value = printer.ip;
    elements.printerLocation.value = printer.location;
    
    // Marcar tipo de conexão
    document.querySelector(`input[name="printer-connection"][value="${printer.connection}"]`).checked = true;
    
    // Adicionar tags de usuários
    elements.printerUsersTags.innerHTML = '';
    printer.users.forEach(user => addUserTag(user));

    // Remover a impressora da lista
    appData.printers = appData.printers.filter(p => p.id !== id);
    updatePrintersTable();
    
    elements.savePrinter.scrollIntoView({ behavior: 'smooth' });
}

function deletePrinter(id) {
    if (confirm('Tem certeza que deseja excluir esta impressora?')) {
        appData.printers = appData.printers.filter(p => p.id !== id);
        updatePrintersTable();
        saveToLocalStorage();
    }
}

// Formulário do Anydesk - FUNÇÕES NOVAS E ATUALIZADAS
function formatAnydeskIp() {
    let value = elements.anydeskIp.value.replace(/\D/g, ''); // Remove tudo que não é número
    
    // Limita a 9 dígitos (formato do Anydesk)
    if (value.length > 9) {
        value = value.substring(0, 9);
    }
    
    // Formata com espaços: 1 710 780 607
    if (value.length > 0) {
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i === 1 || i === 4 || i === 7) {
                formatted += ' ' + value[i];
            } else {
                formatted += value[i];
            }
        }
        elements.anydeskIp.value = formatted;
    }
}

function getCleanAnydeskId(anydeskIp) {
    // Remove espaços e formata para o padrão sem espaços
    return anydeskIp.replace(/\s/g, '');
}

function getFormattedAnydeskId(anydeskIp) {
    // Formata para exibição: 1 710 780 607
    const cleanId = getCleanAnydeskId(anydeskIp);
    if (cleanId.length === 9) {
        return `${cleanId[0]} ${cleanId.substring(1, 4)} ${cleanId.substring(4, 7)} ${cleanId.substring(7, 9)}`;
    }
    return cleanId;
}

function saveAnydesk() {
    if (!validateAnydeskForm()) return;

    const cleanIp = getCleanAnydeskId(elements.anydeskIp.value.trim());

    const anydeskConfig = {
        id: Date.now().toString(),
        ip: cleanIp,
        formattedIp: getFormattedAnydeskId(elements.anydeskIp.value.trim()),
        user: elements.anydeskUser.value,
        notes: elements.anydeskNotes.value.trim(),
        createdAt: new Date().toISOString()
    };

    appData.anydesk.push(anydeskConfig);
    updateAnydeskTable();
    clearAnydeskForm();
    saveToLocalStorage();
    
    alert('Configuração do Anydesk salva com sucesso!');
}

function validateAnydeskForm() {
    const required = [
        elements.anydeskIp,
        elements.anydeskUser
    ];

    for (let field of required) {
        if (!field.value.trim()) {
            alert(`Por favor, preencha o campo: ${field.previousElementSibling.textContent}`);
            field.focus();
            return false;
        }
    }

    // Validar formato do Anydesk ID (9 dígitos)
    const cleanIp = getCleanAnydeskId(elements.anydeskIp.value.trim());
    const anydeskRegex = /^\d{9}$/;
    if (!anydeskRegex.test(cleanIp)) {
        alert('Por favor, insira um ID Anydesk válido com 9 dígitos.');
        elements.anydeskIp.focus();
        return false;
    }

    return true;
}

function clearAnydeskForm() {
    elements.anydeskIp.value = '';
    elements.anydeskUser.value = '';
    elements.anydeskNotes.value = '';
}

function updateAnydeskTable() {
    elements.anydeskList.innerHTML = '';

    appData.anydesk.forEach(config => {
        const row = document.createElement('tr');
        
        // Usar o IP formatado para exibição
        const displayIp = config.formattedIp || getFormattedAnydeskId(config.ip);
        
        row.innerHTML = `
            <td>${escapeHtml(displayIp)}</td>
            <td>${escapeHtml(config.user)}</td>
            <td>${escapeHtml(config.notes || '-')}</td>
            <td>
                <button class="action-btn copy-anydesk" data-ip="${escapeHtml(config.ip)}" title="Copiar ID Anydesk">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="action-btn edit-anydesk" data-id="${config.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-anydesk" data-id="${config.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        const copyBtn = row.querySelector('.copy-anydesk');
        const editBtn = row.querySelector('.edit-anydesk');
        const deleteBtn = row.querySelector('.delete-anydesk');

        copyBtn.addEventListener('click', function() {
            const anydeskId = this.dataset.ip;
            navigator.clipboard.writeText(anydeskId).then(() => {
                alert(`ID Anydesk ${anydeskId} copiado para a área de transferência!`);
            });
        });

        editBtn.addEventListener('click', () => editAnydesk(config.id));
        deleteBtn.addEventListener('click', () => deleteAnydesk(config.id));

        elements.anydeskList.appendChild(row);
    });
}

function editAnydesk(id) {
    const config = appData.anydesk.find(a => a.id === id);
    if (!config) return;

    // Usar o IP formatado para edição
    elements.anydeskIp.value = config.formattedIp || getFormattedAnydeskId(config.ip);
    elements.anydeskUser.value = config.user;
    elements.anydeskNotes.value = config.notes || '';

    // Remover a configuração da lista (será readicionada ao salvar)
    appData.anydesk = appData.anydesk.filter(a => a.id !== id);
    updateAnydeskTable();
    
    elements.saveAnydesk.scrollIntoView({ behavior: 'smooth' });
}

function deleteAnydesk(id) {
    if (confirm('Tem certeza que deseja excluir esta configuração do Anydesk?')) {
        appData.anydesk = appData.anydesk.filter(a => a.id !== id);
        updateAnydeskTable();
        saveToLocalStorage();
    }
}

// Função para atualizar a lista de usuários no select do Anydesk
function updateUsersList() {
    elements.anydeskUser.innerHTML = '<option value="">Selecione um usuário...</option>';
    
    // Coletar usuários únicos de notebooks
    const notebookUsers = [...new Set(appData.notebooks
        .filter(n => n.user && n.user.trim())
        .map(n => n.user.trim()))];
    
    // Coletar usuários únicos de impressoras
    const printerUsers = [];
    appData.printers.forEach(printer => {
        const users = Array.isArray(printer.users) ? printer.users : (printer.users ? [printer.users] : []);
        users.forEach(user => {
            if (user && user.trim() && !printerUsers.includes(user.trim())) {
                printerUsers.push(user.trim());
            }
        });
    });
    
    // Combinar e remover duplicatas
    const allUsers = [...new Set([...notebookUsers, ...printerUsers])];
    
    // Adicionar opções ao select
    allUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        elements.anydeskUser.appendChild(option);
    });
}

// Sistema de tags para usuários
function addUserTag(user) {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
        <span class="tag-text">${escapeHtml(user)}</span>
        <button class="tag-remove">&times;</button>
    `;

    tag.querySelector('.tag-remove').addEventListener('click', () => {
        tag.remove();
    });

    elements.printerUsersTags.appendChild(tag);
}

function showUserSuggestions() {
    const input = elements.printerUsersInput.value.toLowerCase();
    elements.userSuggestions.innerHTML = '';
    
    if (!input) {
        elements.userSuggestions.style.display = 'none';
        return;
    }

    const suggestions = appData.users.filter(user => 
        user.toLowerCase().includes(input)
    );

    if (suggestions.length === 0) {
        elements.userSuggestions.style.display = 'none';
        return;
    }

    suggestions.forEach(user => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = user;
        item.addEventListener('click', () => {
            addUserTag(user);
            elements.printerUsersInput.value = '';
            elements.userSuggestions.style.display = 'none';
        });
        elements.userSuggestions.appendChild(item);
    });

    elements.userSuggestions.style.display = 'block';
}

function handleTagInput(event) {
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        const user = elements.printerUsersInput.value.trim();
        if (user) {
            addUserTag(user);
            elements.printerUsersInput.value = '';
            
            // Adicionar à lista de sugestões se não existir
            if (!appData.users.includes(user)) {
                appData.users.push(user);
            }
        }
    }
}

// Utilitários
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateSaveButtonState() {
    const hasData = appData.company.name || 
                   appData.credentials.length > 0 || 
                   appData.notebooks.length > 0 || 
                   appData.printers.length > 0 ||
                   appData.anydesk.length > 0;
    
    elements.saveBtn.disabled = !hasData;
}

function updateUI() {
    // Atualizar dados da empresa
    elements.companyName.value = appData.company.name || '';
    elements.companyAddress.value = appData.company.address || '';
    elements.companyContact.value = appData.company.contact || '';

    // Atualizar tabelas
    updateCredentialsTable();
    updateNotebooksTable();
    updatePrintersTable();
    updateAnydeskTable();
    
    // Atualizar lista de usuários
    updateUsersList();

    updateSaveButtonState();
}

function clearForms() {
    // Limpar formulário da empresa
    elements.companyName.value = '';
    elements.companyAddress.value = '';
    elements.companyContact.value = '';
    elements.companyLogo.value = '';

    // Limpar outros formulários
    clearCredentialForm();
    clearNotebookForm();
    clearPrinterForm();
    clearAnydeskForm();
}

// Função para validar e corrigir dados ao carregar do localStorage
function validateAndFixData(data) {
    // Garantir que todos os arrays existam
    if (!data.credentials) data.credentials = [];
    if (!data.notebooks) data.notebooks = [];
    if (!data.printers) data.printers = [];
    if (!data.users) data.users = [];
    if (!data.anydesk) data.anydesk = [];
    
    // Validar e corrigir notebooks
    data.notebooks = data.notebooks.map(notebook => ({
        id: notebook.id || Date.now().toString(),
        user: notebook.user || '',
        brand: notebook.brand || '',
        serial: notebook.serial || '',
        os: notebook.os || '',
        connections: Array.isArray(notebook.connections) 
            ? notebook.connections 
            : (notebook.connections ? [notebook.connections] : []),
        createdAt: notebook.createdAt || new Date().toISOString()
    }));
    
    // Validar e corrigir impressoras
    data.printers = data.printers.map(printer => ({
        id: printer.id || Date.now().toString(),
        name: printer.name || '',
        serial: printer.serial || '',
        ip: printer.ip || '',
        location: printer.location || '',
        connection: printer.connection || 'Wi-Fi',
        users: Array.isArray(printer.users) 
            ? printer.users 
            : (printer.users ? [printer.users] : []),
        createdAt: printer.createdAt || new Date().toISOString()
    }));
    
    // Validar e corrigir anydesk
    data.anydesk = data.anydesk.map(config => ({
        id: config.id || Date.now().toString(),
        ip: config.ip || '',
        formattedIp: config.formattedIp || (config.ip ? getFormattedAnydeskId(config.ip) : ''),
        user: config.user || '',
        notes: config.notes || '',
        createdAt: config.createdAt || new Date().toISOString()
    }));
    
    return data;
}

// Local Storage
function saveToLocalStorage() {
    try {
        localStorage.setItem('tiManagerData', JSON.stringify(appData));
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('tiManagerData');
        if (saved) {
            const parsedData = JSON.parse(saved);
            appData = validateAndFixData(parsedData);
            updateUI();
        }
    } catch (error) {
        console.error('Erro ao carregar do localStorage:', error);
        // Se houver erro, inicializa com dados vazios
        appData = {
            company: { name: '', logo: null, address: '', contact: '' },
            credentials: [],
            notebooks: [],
            printers: [],
            users: [],
            anydesk: []
        };
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);
