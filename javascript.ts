javascript
let usuarios = {
    'Perfil 1': { datos: { retenidos: 0, noRetenidos: 0 }, datosAnteriores: { retenidos: 0, noRetenidos: 0 } },
    'Perfil 2': { datos: { retenidos: 0, noRetenidos: 0 }, datosAnteriores: { retenidos: 0, noRetenidos: 0 } },
    'Perfil 3': { datos: { retenidos: 0, noRetenidos: 0 }, datosAnteriores: { retenidos: 0, noRetenidos: 0 } }
};

document.addEventListener('DOMContentLoaded', () => {
    cargarPerfiles();
    actualizarResultadosGenerales();
});

function cargarPerfiles() {
    const container = document.getElementById('user-calculators');
    container.innerHTML = ''; // Limpiar perfiles existentes

    for (const perfil in usuarios) {
        const userDiv = document.createElement('div');
        userDiv.id = perfil;
        userDiv.className = 'user-calculator';
        userDiv.innerHTML = `
            <h2>${perfil} <button onclick="modificarNombre('${perfil}')" class="edit-name-btn">✎</button></h2>
            <div class="data-section">
                <div class="data-previous" id="data-previous-${perfil}">
                    <h3>Datos Anteriores:</h3>
                    <p>Total de Casos Cerrados: <span id="total-casos-${perfil}-anterior">0</span></p>
                    <p>Casos No Retenidos: <span id="casos-no-retenidos-${perfil}-anterior">0</span></p>
                    <p>Casos Retenidos: <span id="casos-retenidos-${perfil}-anterior">0</span></p>
                    <p>Casos por Hora: <span id="casos-por-hora-${perfil}-anterior">0</span></p>
                </div>
                <div class="data-current" id="data-current-${perfil}">
                    <h3>Datos Actuales:</h3>
                    <p>Total de Casos Cerrados: <span id="total-casos-${perfil}">0</span></p>
                    <p>Casos No Retenidos: <span id="casos-no-retenidos-${perfil}">0</span></p>
                    <p>Casos Retenidos: <span id="casos-retenidos-${perfil}">0</span></p>
                    <p>Casos por Hora: <span id="casos-por-hora-${perfil}">0</span></p>
                </div>
            </div>
            <div class="input-section">
                <p>Casos Retenidos:</p>
                <input type="number" id="input-retenido-${perfil}" placeholder="Número">
                <button onclick="modificarCasos('${perfil}', 'retenido', 1)">+1</button>
                <button onclick="modificarCasos('${perfil}', 'retenido', -1)">-1</button>
                <button onclick="agregarCasosManual('${perfil}', 'retenido')">Agregar Manualmente</button>
            </div>
            <div class="input-section">
                <p>Casos No Retenidos:</p>
                <input type="number" id="input-no-retenido-${perfil}" placeholder="Número">
                <button onclick="modificarCasos('${perfil}', 'noRetenido', 1)">+1</button>
                <button onclick="modificarCasos('${perfil}', 'noRetenido', -1)">-1</button>
                <button onclick="agregarCasosManual('${perfil}', 'noRetenido')">Agregar Manualmente</button>
            </div>
            <button onclick="guardarDatosAnteriores('${perfil}')" class="save-btn">Guardar Datos Anteriores</button>
        `;

        container.appendChild(userDiv);
        actualizarResultadosPerfil(perfil);
    }
}

function modificarNombre(perfil) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre del perfil:', perfil);
    if (nuevoNombre && !usuarios[nuevoNombre]) {
        usuarios[nuevoNombre] = usuarios[perfil];
        delete usuarios[perfil];
        cargarPerfiles();
    } else {
        alert('Nombre de perfil inválido o ya existente.');
    }
}

function agregarPerfil() {
    const nuevoNombre = prompt('Ingrese el nombre del nuevo perfil:');
    if (nuevoNombre && !usuarios[nuevoNombre]) {
        usuarios[nuevoNombre] = { datos: { retenidos: 0, noRetenidos: 0 }, datosAnteriores: { retenidos: 0, noRetenidos: 0 } };
        cargarPerfiles();
    } else {
        alert('Nombre de perfil inválido o ya existente.');
    }
}

function eliminarPerfil() {
    const perfil = prompt('Ingrese el nombre del perfil a eliminar:');
    if (usuarios[perfil]) {
        delete usuarios[perfil];
        cargarPerfiles();
    } else {
        alert('Perfil no encontrado.');
    }
}

function modificarCasos(perfil, categoria, cambio) {
    if (usuarios[perfil]) {
        if (categoria === 'retenido') {
            usuarios[perfil].datos.retenidos += cambio;
        } else if (categoria === 'noRetenido') {
            usuarios[perfil].datos.noRetenidos += cambio;
        }

        usuarios[perfil].datos.retenidos = Math.max(usuarios[perfil].datos.retenidos, 0);
        usuarios[perfil].datos.noRetenidos = Math.max(usuarios[perfil].datos.noRetenidos, 0);

        actualizarResultadosPerfil(perfil);
        actualizarResultadosGenerales();
    }
}

function agregarCasosManual(perfil, categoria) {
    const inputId = categoria === 'retenido' ? `input-retenido-${perfil}` : `input-no-retenido-${perfil}`;
    const numero = parseFloat(document.getElementById(inputId).value);
    
    if (isNaN(numero) || numero <= 0) {
        alert('Por favor, ingresa un número válido');
        return;
    }

    if (categoria === 'retenido') {
        usuarios[perfil].datos.retenidos += numero;
    } else if (categoria === 'noRetenido') {
        usuarios[perfil].datos.noRetenidos += numero;
    }

    document.getElementById(inputId).value = '';
    actualizarResultadosPerfil(perfil);
    actualizarResultadosGenerales();
}

function guardarDatosAnteriores(perfil) {
    if (usuarios[perfil]) {
        usuarios[perfil].datosAnteriores.retenidos += usuarios[perfil].datos.retenidos;
        usuarios[perfil].datosAnteriores.noRetenidos += usuarios[perfil].datos.noRetenidos;

        // Resetear los datos actuales
        usuarios[perfil].datos.retenidos = 0;
        usuarios[perfil].datos.noRetenidos = 0;

        // Actualizar la visualización
        actualizarResultadosPerfil(perfil);
        actualizarResultadosGenerales();
    }
}

function actualizarResultadosPerfil(perfil) {
    const datos = usuarios[perfil].datos;
    const datosAnteriores = usuarios[perfil].datosAnteriores;

    const totalCasos = datos.retenidos + datos.noRetenidos;
    const porcentajeRetenidos = totalCasos > 0 ? (datos.retenidos / totalCasos) * 100 : 0;
    const casosPorHora = totalCasos > 0 ? (totalCasos / 6).toFixed(2) : 0;

    const totalCasosAnteriores = datosAnteriores.retenidos + datosAnteriores.noRetenidos;
    const porcentajeRetenidosAnteriores = totalCasosAnteriores > 0 ? (datosAnteriores.retenidos / totalCasosAnteriores) * 100 : 0;
    const casosPorHoraAnteriores = totalCasosAnteriores > 0 ? (totalCasosAnteriores / 6).toFixed(2) : 0;

    document.getElementById(`total-casos-${perfil}`).textContent = totalCasos;
    document.getElementById(`casos-no-retenidos-${perfil}`).textContent = datos.noRetenidos;
    document.getElementById(`casos-retenidos-${perfil}`).textContent = datos.retenidos;
    document.getElementById(`casos-por-hora-${perfil}`).textContent = casosPorHora;

    document.getElementById(`total-casos-${perfil}-anterior`).textContent = totalCasosAnteriores;
    document.getElementById(`casos-no-retenidos-${perfil}-anterior`).textContent = datosAnteriores.noRetenidos;
    document.getElementById(`casos-retenidos-${perfil}-anterior`).textContent = datosAnteriores.retenidos;
    document.getElementById(`casos-por-hora-${perfil}-anterior`).textContent = casosPorHoraAnteriores;

    actualizarColores(porcentajeRetenidos, `data-current-${perfil}`);
    actualizarColores(porcentajeRetenidosAnteriores, `data-previous-${perfil}`);
}

function actualizarResultadosGenerales() {
    const totalRetenidos = Object.values(usuarios).reduce((acc, perfil) => acc + perfil.datos.retenidos, 0);
    const totalNoRetenidos = Object.values(usuarios).reduce((acc, perfil) => acc + perfil.datos.noRetenidos, 0);
    const totalCasos = totalRetenidos + totalNoRetenidos;
    const porcentajeRetenidos = totalCasos > 0 ? (totalRetenidos / totalCasos) * 100 : 0;
    const casosPorHora = totalCasos > 0 ? (totalCasos / 6).toFixed(2) : 0;

    document.getElementById('total-casos-generales').textContent = totalCasos;
    document.getElementById('casos-no-retenidos-generales').textContent = totalNoRetenidos;
    document.getElementById('casos-retenidos-generales').textContent = totalRetenidos;
    document.getElementById('casos-por-hora-generales').textContent = casosPorHora;

    actualizarColores(porcentajeRetenidos, 'total-casos-generales');
}

function actualizarColores(porcentaje, id) {
    const element = document.getElementById(id);
    if (porcentaje >= 35) {
        element.style.backgroundColor = 'lightgreen';
    } else if (porcentaje > 0) {
        element.style.backgroundColor = 'lightcoral';
    } else {
        element.style.backgroundColor = 'transparent';
    }
}

function searchProfile() {
    const input = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.user-calculator').forEach((el) => {
        const perfil = el.id.toLowerCase();
        el.style.display = perfil.includes(input) ? 'block' : 'none';
    });
}
