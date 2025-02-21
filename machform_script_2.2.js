window.onload = function() {
    const element1 = document.getElementById("element_1");
    const element7 = document.getElementById("element_7");
    const element8 = document.getElementById("element_8");
    const element9 = document.getElementById("element_9");
    const element10 = document.getElementById("element_10");
    const element11 = document.getElementById("element_11");
    const elementDay = document.getElementById("element_2_1");
    const elementMonth = document.getElementById("element_2_2");
    const elementYear = document.getElementById("element_2_3");

    // Deshabilitar ambos combobox inicialmente
    if (element7) element7.disabled = true;
    if (element8) element8.disabled = true;
    if (element11) {
        element11.value = "No determinado";
    }

    let dataApi = [];

    function setCurrentDate() {
        const today = new Date();
        if (elementDay) elementDay.value = today.getDate();
        if (elementMonth) elementMonth.value = today.getMonth() + 1;
        if (elementYear) elementYear.value = today.getFullYear();
        console.log("✅ Fecha actual cargada en MachForm.");
    }

    function mostrarResultados() {
        const id = element1.value.trim();
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
                    resetComboboxes();
                    dataApi = data;
                    loadEscuelas();
                } else {
                    console.log("⚠️ ID no encontrado o sin resultados.");
                    resetComboboxes();
                }
            })
            .catch(error => console.error("❌ Error en la API:", error));
    }

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

    function loadEscuelas() {
        const escuelas = [...new Set(dataApi.map(item => item.escuela))].sort();
        const opciones = ['<option value="" selected disabled>Selecciona una escuela</option>']
            .concat(escuelas.map(escuela => `<option value="${escuela}">${escuela}</option>`));
        if (element8) {
            element8.innerHTML = opciones.join('');
            element8.disabled = false;
            console.log("✅ Escuelas cargadas:", escuelas);
        }
        if (element8) {
            element8.addEventListener("change", function() {
                loadClases(element8.value);
                copyValues();
                updateElement11();
            });
        }
    }

    function loadClases(escuelaSeleccionada) {
        const clases = dataApi
            .filter(item => item.escuela == escuelaSeleccionada)
            .map(item => item.clase)
            .sort();
        if (element7) {
            element7.innerHTML = clases.length > 0 
                ? clases.map(clase => `<option value="${clase}">${clase}</option>`).join('')
                : '<option value="">Sin clases asociadas</option>';
            element7.disabled = clases.length === 0;
            console.log("✅ Clases cargadas:", clases);
        }
    }

    function copyValues() {
        if (element8 && element9) {
            element9.value = element8.value;
        }
        if (element7 && element10) {
            element10.value = element7.value;
        }
    }

    function updateElement11() {
        if (element7 && element8 && element11) {
            element11.value = `${element8.value} - ${element7.value}`;
        }
    }

    if (element1) {
        element1.addEventListener("blur", mostrarResultados);
    }

    if (element7) {
        element7.addEventListener("change", function() {
            copyValues();
            updateElement11();
        });
    }

    if (element8) {
        element8.addEventListener("change", function() {
            copyValues();
            updateElement11();
        });
    }

    setCurrentDate();
    console.log("✅ El script ha sido cargado correctamente.");
};
