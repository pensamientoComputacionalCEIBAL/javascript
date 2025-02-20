
// Función para deshabilitar un combobox
function deshabilitarCombobox(id) {
    document.getElementById(id).disabled = true;
    console.log('Combobox con ID ' + id + ' deshabilitado.');
}

// Función para habilitar un combobox
function habilitarCombobox(id) {
    document.getElementById(id).disabled = false;
    console.log('Combobox con ID ' + id + ' habilitado.');
}

// Función para procesar la API y cargar las escuelas y clases
function mostrarResultados() {
    var id = document.getElementById("element_1").value; // Obtiene el valor de 'element_1'

    // Asegurarse de que haya un ID ingresado
    if (!id) {
        console.log("❌ No se ha ingresado un ID en 'element_1'.");
        return;
    }

    var apiUrl = "https://script.google.com/macros/s/AKfycbxtnlz0MV_b2q5kX8WvkN4teztb2AzN-eq7QkFyLD1TayHhczv2kxLoaI-uk8fNJHv-CQ/exec?id=" + id;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.error || !data.length) {
                console.log("⚠️ ID no encontrado o sin resultados.");
                deshabilitarCombobox("element_7");  // Deshabilitar combobox de clases
                deshabilitarCombobox("element_8");  // Deshabilitar combobox de escuelas
            } else {
                console.log("✅ Resultados cargados correctamente:", data);
                // Procesar los datos para llenar los comboboxes
                cargarEscuelas(data);
                cargarClases(data);
            }
        })
        .catch(error => console.error("❌ Error en la API:", error));
}

// Cargar las escuelas en el combobox
function cargarEscuelas(data) {
    const escuelas = Array.from(new Set(data.map(item => item.escuela))).sort(); // Eliminar duplicados y ordenar
    const escuelaSelect = document.getElementById("element_8");
    escuelaSelect.innerHTML = '<option value="">Seleccionar Escuela</option>';  // Limpiar combobox

    escuelas.forEach(escuela => {
        const option = document.createElement("option");
        option.value = escuela;
        option.textContent = escuela;
        escuelaSelect.appendChild(option);
    });

    habilitarCombobox("element_8");  // Habilitar combobox de escuelas
    console.log("✅ Escuelas cargadas correctamente.");
}

// Cargar las clases en el combobox según la escuela seleccionada
function cargarClases(data) {
    const selectedEscuela = document.getElementById("element_8").value;
    const clases = Array.from(new Set(data.filter(item => item.escuela == selectedEscuela).map(item => item.clase))).sort(); // Filtrar por escuela y ordenar

    const claseSelect = document.getElementById("element_7");
    claseSelect.innerHTML = '<option value="">Seleccionar Clase</option>';  // Limpiar combobox

    clases.forEach(clase => {
        const option = document.createElement("option");
        option.value = clase;
        option.textContent = clase;
        claseSelect.appendChild(option);
    });

    habilitarCombobox("element_7");  // Habilitar combobox de clases
    console.log("✅ Clases cargadas correctamente.");
}

// Inicialización: deshabilitar ambos combobox al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    deshabilitarCombobox("element_7");
    deshabilitarCombobox("element_8");
    console.log("✅ Ambos combobox están deshabilitados al cargar la página.");
});

// Asignar el evento 'blur' para que se ejecute cuando el campo pierde el foco
document.getElementById("element_1").addEventListener("blur", mostrarResultados);
