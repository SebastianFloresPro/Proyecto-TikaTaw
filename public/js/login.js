document.addEventListener('DOMContentLoaded', async () => {
    // Verificar sesión con el backend primero
    try {
        const response = await fetch('/usuarios/api/auth/check', { credentials: 'include' });
        const { isValid, tipo } = await response.json();

        if (isValid) {
            sessionStorage.setItem('tipoUsuario', tipo);
            const currentPath = window.location.pathname;

            // Redirigir según el tipo de usuario
            if (tipo === 'usuario' && !currentPath.includes('/usuarios/perfil')) {
                window.location.replace('/usuarios/perfil/usuario');
            } else if (tipo === 'refugio' && !currentPath.includes('/refugios/perfil')) {
                window.location.replace('/refugios/perfil/refugio');
            }
        } else {
            sessionStorage.removeItem('tipoUsuario');
            if (!window.location.pathname.includes('/usuarios/login')) {
                window.location.replace('/usuarios/login');
            }
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
    }

    // Manejo del formulario de login
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correo = document.getElementById('correo').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, password }),
                    credentials: 'include'
                });
                const datos = await response.json();

                if (datos.success) {
                    sessionStorage.setItem('tipoUsuario', datos.tipo);
                    window.location.replace(
                        datos.tipo === 'usuario' 
                            ? '/usuarios/perfil/usuario' 
                            : '/refugios/perfil/refugio'
                    );
                } else {
                    alert('Error: ' + datos.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema con el inicio de sesión');
            }
        });
    }
});