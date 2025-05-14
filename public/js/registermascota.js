document.addEventListener('DOMContentLoaded', () => {
    // Verificar sesión de refugio
    fetch('/usuarios/api/auth/check', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (!data.isValid || data.tipo !== 'refugio') {
                window.location.href = '/usuarios/login';
                return;
            }
            
            // Establecer el ID del refugio desde la sesión
            document.getElementById('idcentro').value = data.userId;
            
            // Cargar mascotas existentes del refugio
            cargarMascotas(data.userId);
        });

    // Manejar el envío del formulario
    const form = document.getElementById('register-mascota-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

function cargarMascotas(idcentro) {
    fetch(`/refugios/mascotas/${idcentro}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.mascotas.length > 0) {
                // Mostrar mascotas existentes (opcional)
                console.log('Mascotas del refugio:', data.mascotas);
            }
        });
}

function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);  // Usamos FormData para manejar tanto los datos como los archivos
    
    // Validar los campos antes de enviar
    if (!formData.get('nombre') || !formData.get('tamanio') || !formData.get('especie') || !formData.get('edad') || !formData.get('genero') || !formData.get('descripcion')) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const data = {
        nombre: formData.get('nombre'),
        tamanio: formData.get('tamanio'),
        especie: formData.get('especie'),
        edad: parseInt(formData.get('edad')),
        genero: formData.get('genero'),
        descripcion: formData.get('descripcion')
    };

    // Añadir la imagen si está presente
    const imagenInput = formData.get('imagen');
    if (imagenInput) {
        data.imagen = imagenInput;  // Guardar la imagen, si existe
    }

    // Enviar los datos y la imagen al backend usando FormData
    fetch('/refugios/mascotas/register', {
        method: 'POST',
        body: formData,  // Enviar directamente el FormData para manejar archivos
        credentials: 'include'
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            document.getElementById('exito').style.display = 'block';  // Mostrar mensaje de éxito
            form.reset();  // Resetear el formulario
            setTimeout(() => {
                // Redirigir al perfil del refugio después de registrar
                window.location.href = '/refugios/perfil/refugio';
            }, 2000);
        } else {
            alert('Error: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar mascota');
    });
}