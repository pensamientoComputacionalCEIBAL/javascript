document.addEventListener("DOMContentLoaded", function() {
    // Función para realizar la búsqueda y mostrar los resultados
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
                // Deshabilitar los combobox mientras se procesan los datos
                document.getElementById("element_7").disabled = true;
                document.getElementById("element_8").disabled = true;

                // Limpiar las opciones previas
                var escuelaSelect = document.getElementById("element_7");
                var claseSelect = document.getElementById("element_8");
                escuelaSelect.innerHTML = "";
                claseSelect.innerHTML = "";

                // Verificar si hay datos
                if (!data || !Array.isArray(data) || data.length === 0) {
                    console.log("⚠️ No se encontraron resultados para el ID proporcionado.");
                    escuelaSelect.disabled = true;
                    escuelaSelect.innerHTML = "<option>Sin centros asociados</option>";
                    claseSelect.disabled = true;
                    claseSelect.innerHTML = "<option>Sin clases asociadas</option>";
                    return;
                }

                // Procesar las escuelas, eliminando duplicados y ordenando
                const escuelas = [...new Set(data.map(item => item.escuela))]
                    .sort((a, b) => a - b);

                // Agregar la opción vacía al principio
                escuelaSelect.innerHTML = '<option value="">Seleccione una escuela</option>';

                // Agregar las escuelas al combobox
                escuelas.forEach(escuela => {
                    var option = document.createElement("option");
                    option.value = escuela;
                    option.textContent = `Escuela ${escuela}`;
                    escuelaSelect.appendChild(option);
                });

                // Habilitar el combobox de escuelas
                escuelaSelect.disabled = false;

                // Activar evento cuando se selecciona una escuela
                escuelaSelect.addEventListener("change", function() {
                    cargarClases(escuelaSelect.value, data);
                });

                // Si no hay escuelas, deshabilitar los combobox y mostrar mensaje
                if (escuelas.length === 0) {
                    escuelaSelect.disabled = true;
                    escuelaSelect.innerHTML = "<option>Sin centros asociados</option>";
                    claseSelect.disabled = true;
                    claseSelect.innerHTML = "<option>Sin clases asociadas</option>";
                } else {
                    console.log("✅ Resultados:", data);
                }
            })
            .catch(error => {
                console.error("❌ Error en la API:", error);
                document.getElementById("element_7").disabled = true;
                document.getElementById("element_8").disabled = true;
            });
    }

    // Función para cargar las clases en función de la escuela seleccionada
    function cargarClases(escuela, data) {
        var claseSelect = document.getElementById("element_8");

        // Limpiar las clases anteriores solo si se cambia la escuela
        claseSelect.innerHTML = "";

        // Filtrar las clases asociadas a la escuela seleccionada
        const clases = [...new Set(data.filter(item => item.escuela === parseInt(escuela)).map(item => item.clase))]
            .sort();

        // Agregar la opción vacía al principio
        claseSelect.innerHTML = '<option value="">Seleccione una clase</option>';

        // Agregar las clases al combobox
        clases.forEach(clase => {
            var option = document.createElement("option");
            option.value = clase;
            option.textContent = clase;
            claseSelect.appendChild(option);
        });

        // Habilitar el combobox de clases
        claseSelect.disabled = false;

        // Si no hay clases, mostrar mensaje y deshabilitar el combobox
        if (clases.length === 0) {
            claseSelect.disabled = true;
            claseSelect.innerHTML = "<option>Sin clases asociadas</option>";
        }
    }

    // Asignar el evento 'blur' para que se ejecute cuando el campo pierde el foco
    document.getElementById("element_1").addEventListener("blur", mostrarResultados);
});
