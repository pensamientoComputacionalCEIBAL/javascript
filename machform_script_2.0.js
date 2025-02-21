window.onload = function() {
    const element1 = document.getElementById("element_1");
    const element7 = document.getElementById("element_7");
    const element8 = document.getElementById("element_8");
    const element9 = document.getElementById("element_9");  // cuadro de texto para element_8
    const element10 = document.getElementById("element_10");  // cuadro de texto para element_7
    const element11 = document.getElementById("element_11");  // nuevo cuadro de texto para concatenación

    // Deshabilitar ambos combobox inicialmente
    if (element7) element7.disabled = true;
    if (element8) element8.disabled = true;
    if (element11) {
        element11.disabled = true;  // Deshabilitar element_11
        element11.value = "No determinado";  // Valor por defecto
    }

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
                copyValues();  // Copiar valores inmediatamente cuando se seleccione una escuela
                updateElement11();  // Actualizar el valor de element_11 con la concatenación
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

    // Función para copiar los valores de los combobox a los cuadros de texto
    function copyValues() {
        if (element8 && element9) {
            element9.value = element8.value;  // Copiar valor de 'element_8' a 'element_9'
        }
        if (element7 && element10) {
            element10.value = element7.value;  // Copiar valor de 'element_7' a 'element_10'
        }
    }

    // Función para actualizar el valor de element_11 con la concatenación de element_7 y element_8
    function updateElement11() {
        if (element7 && element8 && element11) {
            // Concatenar los valores de element_7 y element_8
            element11.value = `${element8.value} - ${element7.value}`;
        }
    }

    // Asignar el evento 'blur' para que se ejecute cuando el campo pierde el foco
    if (element1) {
        element1.addEventListener("blur", mostrarResultados);
    }

    // Asignar el evento 'change' para copiar los valores cuando cambian
    if (element7) {
        element7.addEventListener("change", function() {
            copyValues();  // Copiar el valor de 'element_7' a 'element_10'
            updateElement11();  // Actualizar el valor de element_11
        });
    }

    if (element8) {
        element8.addEventListener("change", function() {
            copyValues();  // Copiar el valor de 'element_8' a 'element_9'
            updateElement11();  // Actualizar el valor de element_11
        });
    }

    // Confirmación de que el script ha sido cargado correctamente
    console.log("✅ El script ha sido cargado correctamente 1.");
};
