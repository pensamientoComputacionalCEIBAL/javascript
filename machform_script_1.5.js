
window.onload = function() {
    const element1 = document.getElementById("element_1");
    const element7 = document.getElementById("element_7");
    const element8 = document.getElementById("element_8");

    // Deshabilitar ambos combobox inicialmente
    if (element7) element7.disabled = true;
    if (element8) element8.disabled = true;

    let dataApi = [];
    
    // Función para realizar la búsqueda y mostrar los resultados
    function mostrarResultados() {
        const id = element1.value.trim(); // Obtiene el valor de 'element_1'

        // Asegurarse de que haya un ID ingresado
        if (!id) {
            console.log("❌ No se ha ingresado un ID en 'element_1'.");
            resetComboboxes();
            return;
        }

        const apiUrl = "https://script.google.com/macros/s/AKfycbxtnlz0MV_b2q5kX8WvkN4teztb2AzN-eq7QkFyLD1TayHhczv2kxLoaI-uk8fNJHv-CQ/exec?id=" + id;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data) && data.length > 0) {
                    console.log("✅ Resultados:", data);

                    // Limpiar los combobox y deshabilitarlos
                    resetComboboxes();
                    
                    // Guardamos los resultados en memoria
                    dataApi = data;

                    // Cargar escuelas ordenadas y sin duplicados
                    loadEscuelas();
                } else {
                    console.log("⚠️ ID no encontrado o sin resultados.");
                    resetComboboxes();
                }
            })
            .catch(error => console.error("❌ Error en la API:", error));
    }

    // Función para limpiar los comboboxes y deshabilitarlos
    function resetComboboxes() {
        if (element7) {
            element7.innerHTML = '<option value="">Sin clases asociadas</option>';
            element7.disabled = true;
        }
        if (element8) {
            element8.innerHTML = '<option value="">Sin centros asociados</option>';
            element8.disabled = true;
        }
    }

    // Función para cargar las escuelas
    function loadEscuelas() {
        const escuelas = [...new Set(dataApi.map(item => item.escuela))].sort();
        
        // Agregar opción predeterminada
        const opciones = ['<option value="" selected disabled>Selecciona una escuela</option>']
            .concat(escuelas.map(escuela => `<option value="${escuela}">${escuela}</option>`));
        
        // Rellenar el combobox con las escuelas
        if (element8) {
            element8.innerHTML = opciones.join('');
            element8.disabled = false;
            console.log("✅ Escuelas cargadas:", escuelas);
        }

        // Cargar clases cuando se seleccione una escuela
        if (element8) {
            element8.addEventListener("change", function() {
                loadClases(element8.value);
            });
        }
    }

    // Función para cargar las clases en función de la escuela seleccionada
    function loadClases(escuelaSeleccionada) {
        const clases = dataApi
            .filter(item => item.escuela == escuelaSeleccionada)
            .map(item => item.clase)
            .sort();
        
        // Rellenar el combobox con las clases
        if (element7) {
            element7.innerHTML = clases.length > 0 
                ? clases.map(clase => `<option value="${clase}">${clase}</option>`).join('')
                : '<option value="">Sin clases asociadas</option>';
            element7.disabled = clases.length === 0;
            console.log("✅ Clases cargadas:", clases);
        }
    }

    // Asignar el evento 'blur' para que se ejecute cuando el campo pierde el foco
    if (element1) {
        element1.addEventListener("blur", mostrarResultados);
    }

    // Confirmación de que el script ha sido cargado correctamente
    console.log("✅ El script ha sido cargado correctamente 1.");
};
