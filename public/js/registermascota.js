document.addEventListener('DOMContentLoaded', () => {
    // Verificar sesión de refugio (usa la ruta correcta)
    fetch('/refugios/api/auth/check', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (!data.isValid || data.tipo !== 'refugio') {
                window.location.href = '/usuarios/login';
                return;
            }

            // Verifica si se recibió un userId y agrega el campo al formulario
            if (data.userId) {
                if (!document.getElementById('idcentro')) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.id = 'idcentro';
                    input.name = 'idcentro';
                    input.value = data.userId;
                    document.getElementById('registroMascotaForm').appendChild(input);
                }
            } else {
                console.error('El userId es undefined');
                window.location.href = '/usuarios/login'; // Redirige si no hay userId
            }
        })
        .catch(() => window.location.href = '/usuarios/login');

    // Manejar el envío del formulario
    const form = document.getElementById('registroMascotaForm');
    form.addEventListener('submit', handleSubmit);

});

function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    
    // Validación mejorada
    const requiredFields = ['nombre', 'tamanio', 'especie', 'edad', 'genero', 'descripcion'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
        alert(`Por favor completa: ${missingFields.join(', ')}`);
        return;
    }

    fetch('/refugios/mascotas/register', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        return response.json();
    })
    .then(result => {
        if (result.success) {
            alert('Mascota registrada con éxito');
            window.location.href = '/refugios/perfil/refugio';
        } else {
            throw new Error(result.message || 'Error al registrar mascota');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}