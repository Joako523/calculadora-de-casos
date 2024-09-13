let perfiles = [];

// Carga los perfiles desde localStorage
function cargarPerfiles() {
    const perfilesGuardados = localStorage.getItem('perfiles');
    if (perfilesGuardados) {
        perfiles = JSON.parse(perfilesGuardados);
    } else {
        perfiles = [
            {
                nombre: "Perfil 1",
                datosAnteriores: { retenidos: 5, noRetenidos: 10 },
                datosActuales: { retenidos: 2, noRetenidos: 3 }
            },
            {
                nombre: "Perfil 2",
                datosAnteriores: { retenidos: 8, noRetenidos: 12 },
                datosActuales: { retenidos: 4, noRetenidos: 6 }
            }
        ];
        guardarPerfiles();
    }
}

// Guarda los perfiles en localStorage
function guardarPerfiles() {
    localStorage.setItem('perfiles', JSON.stringify(perfiles));
}

// Carga el selector de perfiles
function cargarSelectorPerfiles() {
    const perfilSelector = document.getElementById('perfilSelector');
    perfilSelector.innerHTML = '<option value="">Seleccione un perfil</option>';
    perfiles.forEach((perfil, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = perfil.nombre;
        perfilSelector.appendChild(option);
    });
}

// Muestra los datos del perfil seleccionado en la interfaz
function mostrarDatosPerfil(perfilIndex) {
    const perfilContenido = document.getElementById('perfilContenido');
    const perfil = perfiles[perfilIndex];
    const porcentajeRetenidosAnteriores = (perfil.datosAnteriores.retenidos / (perfil.datosAnteriores.retenidos + perfil.datosAnteriores.noRetenidos)) * 100 || 0;
    const porcentajeRetenidosActuales = (perfil.datosActuales.retenidos / (perfil.datosActuales.retenidos + perfil.datosActuales.noRetenidos)) * 100 || 0;

    perfilContenido.innerHTML = `
        <h2>${perfil.nombre} <button class="icon-pencil" onclick="editarNombre(${perfilIndex})"></button></h2>
        <div>
            <h3>Datos Anteriores</h3>
            <p>Retenidos: ${perfil.datosAnteriores.retenidos}</p>
            <p>No Retenidos: ${perfil.datosAnteriores.noRetenidos}</p>
            <p>Porcentaje Retenidos: ${porcentajeRetenidosAnteriores.toFixed(2)}%</p>
        </div>
        <div>
            <h3>Datos Actuales</h3>
            <p>Retenidos: ${perfil.datosActuales.retenidos}</p>
            <p>No Retenidos: ${perfil.datosActuales.noRetenidos}</p>
            <p>Porcentaje Retenidos: ${porcentajeRetenidosActuales.toFixed(2)}%</p>
        </div>
        <div class="botones">
            <button onclick="añadirRetenido(${perfilIndex})">Añadir Retenido</button>
            <button onclick="quitarRetenido(${perfilIndex})">Quitar Retenido</button>
            <button onclick="añadirNoRetenido(${perfilIndex})">Añadir No Retenido</button>
            <button onclick="quitarNoRetenido(${perfilIndex})">Quitar No Retenido</button>
            <button onclick="guardarCambios(${perfilIndex})">Guardar Cambios</button>
            <button onclick="reiniciarDatosAnteriores(${perfilIndex})">Reiniciar Datos Anteriores</button>
        </div>
    `;
    actualizarContadorGeneral();
}

// Permite editar el nombre del perfil seleccionado
function editarNombre(perfilIndex) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre del perfil:', perfiles[perfilIndex].nombre);
    if (nuevoNombre) {
        perfiles[perfilIndex].nombre = nuevoNombre;
        cargarSelectorPerfiles();
        mostrarDatosPerfil(perfilIndex);
        cargarDatosAdministrador();
        guardarPerfiles();
    }
}

// Agrega un nuevo perfil
function agregarPerfil() {
    const nombre = prompt('Ingrese el nombre del nuevo perfil:');
    if (nombre) {
        perfiles.push({
            nombre: nombre,
            datosAnteriores: { retenidos: 0, noRetenidos: 0 },
            datosActuales: { retenidos: 0, noRetenidos: 0 }
        });
        cargarSelectorPerfiles();
        mostrarDatosPerfil(perfiles.length - 1);
        cargarDatosAdministrador();
        guardarPerfiles();
    }
}

// Elimina el perfil seleccionado
function eliminarPerfil() {
    const perfilSelector = document.getElementById('perfilSelector');
    const perfilIndex = perfilSelector.value;
    if (perfilIndex !== '') {
        perfiles.splice(perfilIndex, 1);
        cargarSelectorPerfiles();
        document.getElementById('perfilContenido').innerHTML = '';
        cargarDatosAdministrador();
        actualizarContadorGeneral();
        guardarPerfiles();
    }
}

// Guarda los cambios de los datos actuales al presionar "Guardar Cambios"
function guardarCambios(perfilIndex) {
    const perfil = perfiles[perfilIndex];
    perfil.datosAnteriores.retenidos += perfil.datosActuales.retenidos;
    perfil.datosAnteriores.noRetenidos += perfil.datosActuales.noRetenidos;
    perfil.datosActuales.retenidos = 0;
    perfil.datosActuales.noRetenidos = 0;
    mostrarDatosPerfil(perfilIndex);
    cargarDatosAdministrador();
    guardarPerfiles();
}

// Reinicia los datos anteriores del perfil seleccionado
function reiniciarDatosAnteriores(perfilIndex) {
    perfiles[perfilIndex].datosAnteriores.retenidos = 0;
    perfiles[perfilIndex].datosAnteriores.noRetenidos = 0;
    cargarDatosAdministrador();
    mostrarDatosPerfil(perfilIndex);
    guardarPerfiles();
}

// Funciones para añadir o quitar casos retenidos y no retenidos
function añadirRetenido(perfilIndex) {
    perfiles[perfilIndex].datosActuales.retenidos++;
    mostrarDatosPerfil(perfilIndex);
    guardarPerfiles();
}

function quitarRetenido(perfilIndex) {
    if (perfiles[perfilIndex].datosActuales.retenidos > 0) {
        perfiles[perfilIndex].datosActuales.retenidos--;
    }
    mostrarDatosPerfil(perfilIndex);
    guardarPerfiles();
}

function añadirNoRetenido(perfilIndex) {
    perfiles[perfilIndex].datosActuales.noRetenidos++;
    mostrarDatosPerfil(perfilIndex);
    guardarPerfiles();
}

function quitarNoRetenido(perfilIndex) {
    if (perfiles[perfilIndex].datosActuales.noRetenidos > 0) {
        perfiles[perfilIndex].datosActuales.noRetenidos--;
    }
    mostrarDatosPerfil(perfilIndex);
    guardarPerfiles();
}

// Actualiza el contador general con los datos de todos los perfiles
function actualizarContadorGeneral() {
    let totalRetenidosAnteriores = 0;
    let totalNoRetenidosAnteriores = 0;
    let totalRetenidosActuales = 0;
    let totalNoRetenidosActuales = 0;

    perfiles.forEach(perfil => {
        totalRetenidosAnteriores += perfil.datosAnteriores.retenidos;
        totalNoRetenidosAnteriores += perfil.datosAnteriores.noRetenidos;
        totalRetenidosActuales += perfil.datosActuales.retenidos;
        totalNoRetenidosActuales += perfil.datosActuales.noRetenidos;
    });

    const porcentajeRetenidosAnteriores = (totalRetenidosAnteriores / (totalRetenidosAnteriores + totalNoRetenidosAnteriores)) * 100 || 0;
    const porcentajeRetenidosActuales = (totalRetenidosActuales / (totalRetenidosActuales + totalNoRetenidosActuales)) * 100 || 0;

    document.getElementById('contadorDatos').innerHTML = `
        <h3>Datos Generales</h3>
        <p><strong>Datos Anteriores:</strong> Retenidos - ${totalRetenidosAnteriores}, No Retenidos - ${totalNoRetenidosAnteriores}, Porcentaje Retenidos - ${porcentajeRetenidosAnteriores.toFixed(2)}%</p>
        <p><strong>Datos Actuales:</strong> Retenidos - ${totalRetenidosActuales}, No Retenidos - ${totalNoRetenidosActuales}, Porcentaje Retenidos - ${porcentajeRetenidosActuales.toFixed(2)}%</p>
    `;
}

// Carga los datos del administrador
function cargarDatosAdministrador() {
    const adminDatosPerfiles = document.getElementById('adminDatosPerfiles');
    adminDatosPerfiles.innerHTML = '';

    perfiles.forEach(perfil => {
        const porcentajeRetenidosAnteriores = (perfil.datosAnteriores.retenidos / (perfil.datosAnteriores.retenidos + perfil.datosAnteriores.noRetenidos)) * 100 || 0;
        const porcentajeRetenidosActuales = (perfil.datosActuales.retenidos / (perfil.datosActuales.retenidos + perfil.datosActuales.noRetenidos)) * 100 || 0;

        const perfilDiv = document.createElement('div');
        perfilDiv.className = 'perfil-administrador-datos';
        perfilDiv.classList.add(porcentajeRetenidosAnteriores >= 35 ? 'green' : 'red');
        perfilDiv.innerHTML = `
            <h2>${perfil.nombre}</h2>
            <p>Datos Anteriores: Retenidos - ${perfil.datosAnteriores.retenidos}, No Retenidos - ${perfil.datosAnteriores.noRetenidos}, Porcentaje Retenidos - ${porcentajeRetenidosAnteriores.toFixed(2)}%</p>
            <p>Datos Actuales: Retenidos - ${perfil.datosActuales.retenidos}, No Retenidos - ${perfil.datosActuales.noRetenidos}, Porcentaje Retenidos - ${porcentajeRetenidosActuales.toFixed(2)}%</p>
        `;
        adminDatosPerfiles.appendChild(perfilDiv);
    });
}

// Inicializa la aplicación
function inicializar() {
    cargarPerfiles();
    cargarSelectorPerfiles();
    document.getElementById('perfilSelector').addEventListener('change', (event) => {
        const perfilIndex = event.target.value;
        if (perfilIndex !== '') {
            mostrarDatosPerfil(perfilIndex);
        } else {
            document.getElementById('perfilContenido').innerHTML = '';
        }
    });
    document.getElementById('agregarPerfil').addEventListener('click', agregarPerfil);
    document.getElementById('eliminarPerfil').addEventListener('click', eliminarPerfil);
    cargarDatosAdministrador();
}

inicializar();
