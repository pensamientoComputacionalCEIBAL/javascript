<script>
document.addEventListener("DOMContentLoaded", function() {
    var inputID = document.querySelector("element_1"); // Ajusta según el ID del campo en MachForm
    var outputEscuelas = document.querySelector("element_5"); // Campo donde mostrar las escuelas
    var outputClases = document.querySelector("element_7"); // Campo donde mostrar las clases
    
    inputID.addEventListener("blur", function() { 
        var id = inputID.value.trim(); // Obtener y limpiar el ID ingresado
        if (!id) return; // Evitar peticiones si el campo está vacío

        fetch("https://script.google.com/macros/s/AKfycbwFSGq7goJTH4rkxQoPJdyOwdm-32CRc6krLH-XMXvBmE0_hyF9BkNB8djVgLHS-deBjw/exec?id=" + encodeURIComponent(id))
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    outputEscuelas.value = "ID no encontrado";
                    outputClases.value = "";
                    return;
                }

                // Extraer las escuelas y clases en formato de lista
                let escuelas = [...new Set(data.map(item => item.escuela))].join(", ");
                let clases = [...new Set(data.map(item => item.clase))].join(", ");
                
                outputEscuelas.value = escuelas; 
                outputClases.value = clases;
            })
            .catch(error => console.error("Error:", error));
    });
});
</script>
