// Datos de la aplicación
let users = [
    { username: 'admin', password: 'Admin123!' } // Usuario de prueba
];
let patients = [];
let currentUser = null;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Toggle entre login y registro
    document.getElementById('show-register').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('register-page').style.display = 'block';
    });
    
    document.getElementById('show-login').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    });
    
    // Mostrar/ocultar contraseña
    document.getElementById('toggle-password').addEventListener('click', function() {
        const passwordField = document.getElementById('password');
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            passwordField.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
    
    document.getElementById('toggle-new-password').addEventListener('click', function() {
        const passwordField = document.getElementById('new-password');
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            passwordField.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
    
    // Formulario de registro de usuario
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validar contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
            alert('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, números y símbolos');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        // Verificar si el usuario ya existe
        if (users.some(u => u.username === username)) {
            alert('El nombre de usuario ya está en uso');
            return;
        }
        
        // Registrar nuevo usuario
        users.push({ username, password });
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        document.getElementById('register-form').reset();
        document.getElementById('show-login').click();
    });
    
    // Formulario de login
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Verificar credenciales
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            currentUser = user;
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('main-page').style.display = 'block';
            document.getElementById('login-form').reset();
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });
    
    // Cerrar sesión
    document.getElementById('logout-btn').addEventListener('click', function() {
        currentUser = null;
        document.getElementById('main-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
    });
    
    // Formulario de paciente
    document.getElementById('patient-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos
        const age = parseInt(document.getElementById('age').value);
        const documentId = document.getElementById('document').value;
        
        if (age <= 0) {
            alert('La edad debe ser mayor a 0');
            return;
        }
        
        if (documentId.length < 5) {
            alert('El documento debe tener al menos 5 caracteres');
            return;
        }
        
        // Obtener exámenes seleccionados
        const exams = Array.from(document.getElementById('exams').selectedOptions)
            .map(option => option.value);
        
        // Crear objeto paciente
        const patient = {
            id: Date.now(),
            fullName: document.getElementById('full-name').value,
            age: age,
            gender: document.getElementById('gender').value,
            document: documentId,
            symptoms: document.getElementById('symptoms').value,
            severity: document.getElementById('severity').value,
            treatment: document.getElementById('treatment').value,
            medicines: document.getElementById('medicines').value,
            exams: exams,
            timestamp: new Date()
        };
        
        // Agregar paciente y ordenar por gravedad
        patients.push(patient);
        sortPatientsBySeverity();
        
        // Mostrar en tabla
        renderPatientsTable();
        
        // Mostrar alerta si es crítico
        if (patient.severity === 'Crítico') {
            showCriticalAlert();
        }
        
        // Limpiar formulario
        document.getElementById('patient-form').reset();
    });
    
    // Ordenar pacientes por gravedad
    function sortPatientsBySeverity() {
        const severityOrder = { 'Crítico': 1, 'Urgente': 2, 'Moderado': 3, 'Leve': 4 };
        patients.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    }
    
    // Mostrar pacientes en tabla
    function renderPatientsTable() {
        const tableBody = document.getElementById('patients-table');
        tableBody.innerHTML = '';
        
        patients.forEach(patient => {
            const row = document.createElement('tr');
            
            // Determinar clase de gravedad
            let severityClass = '';
            switch(patient.severity) {
                case 'Crítico': severityClass = 'critical'; break;
                case 'Urgente': severityClass = 'urgent'; break;
                case 'Moderado': severityClass = 'moderate'; break;
                case 'Leve': severityClass = 'mild'; break;
            }
            
            // Determinar ícono de gravedad
            let severityIcon = '';
            switch(patient.severity) {
                case 'Crítico': severityIcon = 'critical-indicator'; break;
                case 'Urgente': severityIcon = 'urgent-indicator'; break;
                case 'Moderado': severityIcon = 'moderate-indicator'; break;
                case 'Leve': severityIcon = 'mild-indicator'; break;
            }
            
            row.className = severityClass;
            row.innerHTML = `
                <td>${patient.fullName}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.document}</td>
                <td>${patient.symptoms}</td>
                <td><span class="severity-indicator ${severityIcon}"></span>${patient.severity}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${patient.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Agregar eventos a los botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const patientId = parseInt(this.getAttribute('data-id'));
                deletePatient(patientId);
            });
        });
        
        // Actualizar contadores
        updateCounters();
    }
    
    // Eliminar paciente
    function deletePatient(id) {
        if (confirm('¿Estás seguro de eliminar este paciente?')) {
            patients = patients.filter(p => p.id !== id);
            renderPatientsTable();
        }
    }
    
    // Actualizar contadores
    function updateCounters() {
        document.getElementById('total-count').textContent = patients.length;
        document.getElementById('mild-count').textContent = patients.filter(p => p.severity === 'Leve').length;
        document.getElementById('moderate-count').textContent = patients.filter(p => p.severity === 'Moderado').length;
        document.getElementById('urgent-count').textContent = patients.filter(p => p.severity === 'Urgente').length;
        document.getElementById('critical-count').textContent = patients.filter(p => p.severity === 'Crítico').length;
    }
    
    // Mostrar alerta de paciente crítico
    function showCriticalAlert() {
        const alert = document.getElementById('critical-alert');
        alert.style.display = 'block';
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }
});