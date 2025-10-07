// Dados da aplicação
let clients = {}; // Objeto para armazenar múltiplos clientes
let currentClientId = null; // ID do cliente atualmente selecionado
let appData = {
    company: { name: '', logo: null, address: '', contact: '' },
    credentials: [],
    notebooks: [],
    printers: [],
    users: [],
    anydesk: [],
    notes: []
};

// Elementos DOM
const elements = {
    // Sidebar e clientes
    clientsSidebar: document.getElementById('clients-sidebar'),
    clientsList: document.getElementById('clients-list'),
    noClients: document.getElementById('no-clients'),
    toggleSidebar: document.getElementById('toggle-sidebar'),
    currentClient: document.getElementById('current-client'),
    clientName: document.getElementById('client-name'),
    openFolderBtn: document.getElementById('open-folder-btn'),
    loadClientsBtn: document.getElementById('load-clients-btn'),
    sidebarOverlay: null,

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
    
    // Formulário de anotações
    noteTitle: document.getElementById('note-title'),
    noteContent: document.getElementById('note-content'),
    noteCategory: document.getElementById('note-category'),
    saveNote: document.getElementById('save-note'),
    clearNote: document.getElementById('clear-note'),
    notesList: document.getElementById('notes-list'),
    filterCategory: document.getElementById('filter-category'),
    searchNotes: document.getElementById('search-notes'),
    
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
    createSidebarOverlay();
    loadClientsFromLocalStorage();
    setupEventListeners();
    updateSaveButtonState();
    generatePassword();
    updateUsersList();
}

// Configuração de event listeners
function setupEventListeners() {
    // Sidebar e clientes
    elements.toggleSidebar.addEventListener('click', toggleSidebar);
    elements.openFolderBtn.addEventListener('click', openFolderDialog);
    elements.loadClientsBtn.addEventListener('click', openFolderDialog);
    elements.sidebarOverlay.addEventListener('click', closeSidebar);
    
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

    // Formulário de anotações
    elements.saveNote.addEventListener('click', saveNote);
    elements.clearNote.addEventListener('click', clearNoteForm);
    elements.filterCategory.addEventListener('change', filterNotes);
    elements.searchNotes.addEventListener('input', filterNotes);

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

// Funções para gerenciar múltiplos clientes
function createSidebarOverlay() {
    elements.sidebarOverlay = document.createElement('div');
    elements.sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(elements.sidebarOverlay);
}

function toggleSidebar() {
    elements.clientsSidebar.classList.toggle('active');
    elements.sidebarOverlay.classList.toggle('active');
}

function closeSidebar() {
    elements.clientsSidebar.classList.remove('active');
    elements.sidebarOverlay.classList.remove('active');
}

function openFolderDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;
    input.accept = '.xlsx,.xls';
    
    input.onchange = (e) => {
        const files = Array.from(e.target.files);
        loadClientsFromFiles(files);
    };
    
    input.click();
}

async function loadClientsFromFiles(files) {
    const excelFiles = files.filter(file => 
        file.name.match(/\.(xlsx|xls)$/i)
    );

    if (excelFiles.length === 0) {
        alert('Nenhum arquivo Excel encontrado na pasta.');
        return;
    }

    try {
        for (const file of excelFiles) {
            await loadClientFromFile(file);
        }
        
        updateClientsList();
        saveClientsToLocalStorage();
        alert(`${excelFiles.length} cliente(s) carregado(s) com sucesso!`);
        
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar alguns arquivos. Verifique o console para detalhes.');
    }
}

function loadClientFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Extrair nome do cliente do nome do arquivo
                const clientName = file.name.replace(/\.(xlsx|xls)$/i, '').trim();
                const clientId = generateClientId(clientName);
                
                // Carregar dados do cliente
                const clientData = {
                    id: clientId,
                    name: clientName,
                    company: {},
                    credentials: [],
                    notebooks: [],
                    printers: [],
                    anydesk: [],
                    notes: [],
                    lastModified: new Date().toISOString()
                };
                
                // Ler dados das abas
                if (workbook.Sheets['Empresa']) {
                    const companyData = XLSX.utils.sheet_to_json(workbook.Sheets['Empresa']);
                    if (companyData.length > 0) {
                        clientData.company = companyData[0];
                    }
                }
                
                if (workbook.Sheets['Credenciais']) {
                    clientData.credentials = XLSX.utils.sheet_to_json(workbook.Sheets['Credenciais']);
                }
                
                if (workbook.Sheets['Notebooks']) {
                    const notebooksData = XLSX.utils.sheet_to_json(workbook.Sheets['Notebooks']);
                    clientData.notebooks = notebooksData.map(notebook => ({
                        ...notebook,
                        connections: typeof notebook.connections === 'string' 
                            ? notebook.connections.split(', ') 
                            : (notebook.connections || [])
                    }));
                }
                
                if (workbook.Sheets['Impressoras']) {
                    const printersData = XLSX.utils.sheet_to_json(workbook.Sheets['Impressoras']);
                    clientData.printers = printersData.map(printer => ({
                        ...printer,
                        users: typeof printer.users === 'string' 
                            ? printer.users.split(', ') 
                            : (printer.users || [])
                    }));
                }
                
                if (workbook.Sheets['Anydesk']) {
                    clientData.anydesk = XLSX.utils.sheet_to_json(workbook.Sheets['Anydesk']);
                }

                if (workbook.Sheets['Anotações']) {
                    clientData.notes = XLSX.utils.sheet_to_json(workbook.Sheets['Anotações']);
                }
                
                // Adicionar cliente à lista
                clients[clientId] = clientData;
                resolve(clientData);
                
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error(`Erro ao ler arquivo: ${file.name}`));
        reader.readAsArrayBuffer(file);
    });
}

function generateClientId(clientName) {
    return clientName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
}

function updateClientsList() {
    elements.clientsList.innerHTML = '';
    
    const clientIds = Object.keys(clients);
    
    if (clientIds.length === 0) {
        elements.noClients.style.display = 'block';
        return;
    }
    
    elements.noClients.style.display = 'none';
    
    clientIds.forEach(clientId => {
        const client = clients[clientId];
        const clientItem = document.createElement('div');
        clientItem.className = `client-item ${currentClientId === clientId ? 'active' : ''}`;
        
        clientItem.innerHTML = `
            <div class="client-name">${escapeHtml(client.name)}</div>
            <div class="client-actions">
                <button class="client-action-btn remove-client" data-id="${clientId}" title="Remover cliente">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Event listeners
        clientItem.addEventListener('click', (e) => {
            if (!e.target.closest('.client-actions')) {
                selectClient(clientId);
            }
        });
        
        const removeBtn = clientItem.querySelector('.remove-client');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeClient(clientId);
        });
        
        elements.clientsList.appendChild(clientItem);
    });
}

function selectClient(clientId) {
    if (!clients[clientId]) return;
    
    currentClientId = clientId;
    const client = clients[clientId];
    
    // Atualizar UI com dados do cliente
    updateUIWithClientData(client);
    
    // Atualizar lista de clientes
    updateClientsList();
    
    // Atualizar header
    elements.clientName.textContent = client.name;
    
    // Fechar sidebar no mobile
    closeSidebar();
    
    // Salvar estado
    saveClientsToLocalStorage();
}

function updateUIWithClientData(client) {
    // Atualizar dados da empresa
    elements.companyName.value = client.company.name || '';
    elements.companyAddress.value = client.company.address || '';
    elements.companyContact.value = client.company.contact || '';
    
    // Atualizar appData com dados do cliente selecionado
    appData = {
        company: client.company,
        credentials: client.credentials || [],
        notebooks: client.notebooks || [],
        printers: client.printers || [],
        users: client.users || [],
        anydesk: client.anydesk || [],
        notes: client.notes || []
    };
    
    // Atualizar tabelas
    updateCredentialsTable();
    updateNotebooksTable();
    updatePrintersTable();
    updateAnydeskTable();
    updateNotesTable();
    updateUsersList();
    updateSaveButtonState();
}

function removeClient(clientId) {
    if (!confirm(`Tem certeza que deseja remover o cliente "${clients[clientId].name}"?`)) {
        return;
    }
    
    delete clients[clientId];
    
    // Se o cliente removido era o atual, limpar a interface
    if (currentClientId === clientId) {
        currentClientId = null;
        elements.clientName.textContent = 'Nenhum cliente selecionado';
        clearForms();
        updateUI();
    }
    
    updateClientsList();
    saveClientsToLocalStorage();
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
    saveClientsToLocalStorage();
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
    const clientName = prompt('Digite o nome do novo cliente:');
    if (!clientName) return;
    
    const clientId = generateClientId(clientName);
    
    clients[clientId] = {
        id: clientId,
        name: clientName,
        company: { name: clientName, logo: null, address: '', contact: '' },
        credentials: [],
        notebooks: [],
        printers: [],
        anydesk: [],
        notes: [],
        lastModified: new Date().toISOString()
    };
    
    selectClient(clientId);
    updateClientsList();
    saveClientsToLocalStorage();
    
    alert(`Novo cliente "${clientName}" criado com sucesso!`);
}

function handleFileOpen(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    loadClientFromFile(file).then(client => {
        updateClientsList();
        saveClientsToLocalStorage();
        selectClient(client.id);
        alert(`Cliente "${client.name}" carregado com sucesso!`);
    }).catch(error => {
        console.error('Erro:', error);
        alert('Erro ao carregar arquivo: ' + error.message);
    });
}

function saveToExcel() {
    if (!currentClientId) {
        alert('Nenhum cliente selecionado.');
        return;
    }
    
    try {
        const client = clients[currentClientId];
        const workbook = XLSX.utils.book_new();
        
        // Adicionar abas
        const companyWorksheet = XLSX.utils.json_to_sheet([client.company]);
        XLSX.utils.book_append_sheet(workbook, companyWorksheet, 'Empresa');
        
        const credentialsWorksheet = XLSX.utils.json_to_sheet(client.credentials);
        XLSX.utils.book_append_sheet(workbook, credentialsWorksheet, 'Credenciais');
        
        const notebooksForExport = client.notebooks.map(notebook => ({
            ...notebook,
            connections: Array.isArray(notebook.connections) 
                ? notebook.connections.join(', ') 
                : notebook.connections
        }));
        const notebooksWorksheet = XLSX.utils.json_to_sheet(notebooksForExport);
        XLSX.utils.book_append_sheet(workbook, notebooksWorksheet, 'Notebooks');
        
        const printersForExport = client.printers.map(printer => ({
            ...printer,
            users: Array.isArray(printer.users) 
                ? printer.users.join(', ') 
                : printer.users
        }));
        const printersWorksheet = XLSX.utils.json_to_sheet(printersForExport);
        XLSX.utils.book_append_sheet(workbook, printersWorksheet, 'Impressoras');
        
        const anydeskWorksheet = XLSX.utils.json_to_sheet(client.anydesk);
        XLSX.utils.book_append_sheet(workbook, anydeskWorksheet, 'Anydesk');

        // Adicionar aba de Anotações
        const notesWorksheet = XLSX.utils.json_to_sheet(client.notes || []);
        XLSX.utils.book_append_sheet(workbook, notesWorksheet, 'Anotações');
        
        // Nome do arquivo baseado no nome do cliente
        const fileName = `${client.name.replace(/\s+/g, '_')}.xlsx`;
        
        XLSX.writeFile(workbook, fileName);
        alert('Arquivo salvo com sucesso!');
        
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar o arquivo: ' + error.message);
    }
}

// Formulário da empresa
function updateCompanyData() {
    if (!currentClientId) return;
    
    clients[currentClientId].company = {
        name: elements.companyName.value,
        logo: clients[currentClientId].company.logo,
        address: elements.companyAddress.value,
        contact: elements.companyContact.value
    };
    
    updateSaveButtonState();
    saveClientsToLocalStorage();
}

function handleLogoUpload(event) {
    if (!currentClientId) return;
    
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            clients[currentClientId].company.logo = e.target.result;
            saveClientsToLocalStorage();
        };
        reader.readAsDataURL(file);
    }
}

// Formulário de credenciais
function saveCredential() {
    if (!currentClientId) {
        alert('Nenhum cliente selecionado.');
        return;
    }
    
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

    clients[currentClientId].credentials.push(credential);
    updateCredentialsTable();
    clearCredentialForm();
    saveClientsToLocalStorage();
    
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
    clients[currentClientId].credentials = clients[currentClientId].credentials.filter(c => c.id !== id);
    updateCredentialsTable();
    
    elements.saveCredentialBtn.scrollIntoView({ behavior: 'smooth' });
}

function deleteCredential(id) {
    if (confirm('Tem certeza que deseja excluir esta credencial?')) {
        clients[currentClientId].credentials = clients[currentClientId].credentials.filter(c => c.id !== id);
        updateCredentialsTable();
        saveClientsToLocalStorage();
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
    if (!currentClientId) {
        alert('Nenhum cliente selecionado.');
        return;
    }
    
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

    clients[currentClientId].notebooks.push(notebook);
    updateNotebooksTable();
    clearNotebookForm();
    saveClientsToLocalStorage();
    
    // Adicionar usuário à lista de sugestões
    if (notebook.user && !appData.users.includes(notebook.user)) {
        appData.users.push(notebook.user);
    }
    
    // Atualizar lista de usuários no formulário do Anydesk
    updateUsersList();
    
    alert('Notebook salva com sucesso!');
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
    clients[currentClientId].notebooks = clients[currentClientId].notebooks.filter(n => n.id !== id);
    updateNotebooksTable();
    
    elements.saveNotebook.scrollIntoView({ behavior: 'smooth' });
}

function deleteNotebook(id) {
    if (confirm('Tem certeza que deseja excluir este notebook?')) {
        clients[currentClientId].notebooks = clients[currentClientId].notebooks.filter(n => n.id !== id);
        updateNotebooksTable();
        saveClientsToLocalStorage();
    }
}

// Formulário de impressoras
function savePrinter() {
    if (!currentClientId) {
        alert('Nenhum cliente selecionado.');
        return;
    }
    
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

    clients[currentClientId].printers.push(printer);
    updatePrintersTable();
    clearPrinterForm();
    saveClientsToLocalStorage();
    
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
    clients[currentClientId].printers = clients[currentClientId].printers.filter(p => p.id !== id);
    updatePrintersTable();
    
    elements.savePrinter.scrollIntoView({ behavior: 'smooth' });
}

function deletePrinter(id) {
    if (confirm('Tem certeza que deseja excluir esta impressora?')) {
        clients[currentClientId].printers = clients[currentClientId].printers.filter(p => p.id !== id);
        updatePrintersTable();
        saveClientsToLocalStorage();
    }
}

// Formulário do Anydesk
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
    if (!currentClientId) {
        alert('Nenhum cliente selecionado.');
        return;
    }
    
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

    clients[currentClientId].anydesk.push(anydeskConfig);
    updateAnydeskTable();
    clearAnydeskForm();
    saveClientsToLocalStorage();
    
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
    clients[currentClientId].anydesk = clients[currentClientId].anydesk.filter(a => a.id !== id);
    updateAnydeskTable();
    
    elements.saveAnydesk.scrollIntoView({ behavior: 'smooth' });
}

function deleteAnydesk(id) {
    if (confirm('Tem certeza que deseja excluir esta configuração do Anydesk?')) {
        clients[currentClientId].anydesk = clients[currentClientId].anydesk.filter(a => a.id !== id);
        updateAnydeskTable();
        saveClientsToLocalStorage();
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

// Funções para gerenciar anotações
function saveNote() {
    if (!currentClientId) {
        alert('Nenhum cliente selecionado.');
        return;
    }
    
    if (!validateNoteForm()) return;

    // Obter data e hora atual do computador
    const now = new Date();
    const formattedDate = formatDateTime(now);

    const note = {
        id: Date.now().toString(),
        title: elements.noteTitle.value.trim(),
        content: elements.noteContent.value.trim(),
        category: elements.noteCategory.value || 'Outro',
        createdAt: now.toISOString(),
        formattedDate: formattedDate,
        createdTimestamp: now.getTime()
    };

    // Inicializar array de anotações se não existir
    if (!clients[currentClientId].notes) {
        clients[currentClientId].notes = [];
    }

    clients[currentClientId].notes.unshift(note); // Adicionar no início para ordem decrescente
    updateNotesTable();
    clearNoteForm();
    saveClientsToLocalStorage();
    
    alert('Anotação salva com sucesso!');
}

function validateNoteForm() {
    const required = [
        elements.noteTitle,
        elements.noteContent
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

function clearNoteForm() {
    elements.noteTitle.value = '';
    elements.noteContent.value = '';
    elements.noteCategory.value = '';
}

function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function updateNotesTable() {
    elements.notesList.innerHTML = '';

    if (!appData.notes || appData.notes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" style="text-align: center; color: #7f8c8d;">
                <i class="fas fa-sticky-note" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                Nenhuma anotação cadastrada
            </td>
        `;
        elements.notesList.appendChild(row);
        return;
    }

    const filteredNotes = filterNotesData();

    filteredNotes.forEach(note => {
        const row = document.createElement('tr');
        
        // Conteúdo resumido para a tabela
        const shortContent = note.content.length > 100 
            ? note.content.substring(0, 100) + '...' 
            : note.content;
        
        row.innerHTML = `
            <td>${escapeHtml(note.formattedDate)}</td>
            <td>${escapeHtml(note.title)}</td>
            <td>
                ${note.category ? `<span class="category-badge category-${note.category}">${note.category}</span>` : '-'}
            </td>
            <td class="note-content-cell" title="${escapeHtml(note.content)}">
                ${escapeHtml(shortContent)}
            </td>
            <td>
                <button class="action-btn view-note" data-id="${note.id}" title="Ver anotação completa">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-note" data-id="${note.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-note" data-id="${note.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        const viewBtn = row.querySelector('.view-note');
        const editBtn = row.querySelector('.edit-note');
        const deleteBtn = row.querySelector('.delete-note');

        viewBtn.addEventListener('click', () => viewNote(note.id));
        editBtn.addEventListener('click', () => editNote(note.id));
        deleteBtn.addEventListener('click', () => deleteNote(note.id));

        elements.notesList.appendChild(row);
    });
}

function filterNotesData() {
    if (!appData.notes) return [];
    
    let filtered = [...appData.notes];
    
    // Filtrar por categoria
    const categoryFilter = elements.filterCategory.value;
    if (categoryFilter) {
        filtered = filtered.filter(note => note.category === categoryFilter);
    }
    
    // Filtrar por busca textual
    const searchText = elements.searchNotes.value.toLowerCase();
    if (searchText) {
        filtered = filtered.filter(note => 
            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText) ||
            (note.category && note.category.toLowerCase().includes(searchText))
        );
    }
    
    return filtered;
}

function filterNotes() {
    updateNotesTable();
}

function viewNote(id) {
    const note = appData.notes.find(n => n.id === id);
    if (!note) return;

    // Criar modal para visualização
    const modal = document.createElement('div');
    modal.className = 'modal active note-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-sticky-note"></i> Anotação</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="note-header">
                    <div>
                        <h4 class="note-title">${escapeHtml(note.title)}</h4>
                        <div class="note-meta">
                            <strong>Categoria:</strong> ${note.category || 'Sem categoria'} | 
                            <strong>Data:</strong> ${note.formattedDate}
                        </div>
                    </div>
                </div>
                <div class="note-content">
                    ${escapeHtml(note.content).replace(/\n/g, '<br>')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn primary" id="close-note-modal">
                    <i class="fas fa-times"></i> Fechar
                </button>
            </div>
        </div>
    `;

    // Event listeners do modal
    const closeBtn = modal.querySelector('.modal-close');
    const closeModalBtn = modal.querySelector('#close-note-modal');
    
    const closeModal = () => {
        modal.remove();
        document.body.classList.remove('modal-open');
    };
    
    closeBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
}

function editNote(id) {
    const note = appData.notes.find(n => n.id === id);
    if (!note) return;

    elements.noteTitle.value = note.title;
    elements.noteContent.value = note.content;
    elements.noteCategory.value = note.category || '';

    // Remover a anotação da lista (será readicionada ao salvar)
    clients[currentClientId].notes = clients[currentClientId].notes.filter(n => n.id !== id);
    updateNotesTable();
    
    elements.saveNote.scrollIntoView({ behavior: 'smooth' });
}

function deleteNote(id) {
    if (confirm('Tem certeza que deseja excluir esta anotação?')) {
        clients[currentClientId].notes = clients[currentClientId].notes.filter(n => n.id !== id);
        updateNotesTable();
        saveClientsToLocalStorage();
    }
}

// Utilitários
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateSaveButtonState() {
    const hasData = currentClientId && (
        clients[currentClientId].company.name || 
        clients[currentClientId].credentials.length > 0 || 
        clients[currentClientId].notebooks.length > 0 || 
        clients[currentClientId].printers.length > 0 ||
        clients[currentClientId].anydesk.length > 0 ||
        clients[currentClientId].notes.length > 0
    );
    
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
    updateNotesTable();
    
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
    clearNoteForm();
}

// Função para validar e corrigir dados ao carregar do localStorage
function validateAndFixClientData(clientData) {
    // Garantir que todos os arrays existam
    if (!clientData.credentials) clientData.credentials = [];
    if (!clientData.notebooks) clientData.notebooks = [];
    if (!clientData.printers) clientData.printers = [];
    if (!clientData.users) clientData.users = [];
    if (!clientData.anydesk) clientData.anydesk = [];
    if (!clientData.notes) clientData.notes = [];
    
    // Validar e corrigir notebooks
    clientData.notebooks = clientData.notebooks.map(notebook => ({
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
    clientData.printers = clientData.printers.map(printer => ({
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
    clientData.anydesk = clientData.anydesk.map(config => ({
        id: config.id || Date.now().toString(),
        ip: config.ip || '',
        formattedIp: config.formattedIp || (config.ip ? getFormattedAnydeskId(config.ip) : ''),
        user: config.user || '',
        notes: config.notes || '',
        createdAt: config.createdAt || new Date().toISOString()
    }));
    
    // Validar e corrigir anotações
    clientData.notes = clientData.notes.map(note => ({
        id: note.id || Date.now().toString(),
        title: note.title || '',
        content: note.content || '',
        category: note.category || 'Outro',
        createdAt: note.createdAt || new Date().toISOString(),
        formattedDate: note.formattedDate || formatDateTime(new Date(note.createdAt || Date.now())),
        createdTimestamp: note.createdTimestamp || new Date(note.createdAt || Date.now()).getTime()
    }));
    
    // Ordenar anotações por data (mais recente primeiro)
    clientData.notes.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
    
    return clientData;
}

// Local Storage para múltiplos clientes
function saveClientsToLocalStorage() {
    try {
        const dataToSave = {
            clients: clients,
            currentClientId: currentClientId
        };
        localStorage.setItem('tiManagerClients', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Erro ao salvar clientes no localStorage:', error);
    }
}

function loadClientsFromLocalStorage() {
    try {
        const saved = localStorage.getItem('tiManagerClients');
        if (saved) {
            const parsedData = JSON.parse(saved);
            clients = parsedData.clients || {};
            currentClientId = parsedData.currentClientId;
            
            // Validar e corrigir dados de cada cliente
            Object.keys(clients).forEach(clientId => {
                clients[clientId] = validateAndFixClientData(clients[clientId]);
            });
            
            updateClientsList();
            
            if (currentClientId && clients[currentClientId]) {
                selectClient(currentClientId);
            } else {
                updateUI();
            }
        }
    } catch (error) {
        console.error('Erro ao carregar clientes do localStorage:', error);
        clients = {};
        currentClientId = null;
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);
