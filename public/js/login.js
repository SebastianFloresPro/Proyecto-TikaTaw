document.addEventListener('DOMContentLoaded', async () => {
    // Verificar sesión primero en usuarios, luego en refugios si falla
    async function verificarSesion() {
        try {
            let response = await fetch('/usuarios/api/auth/check', { credentials: 'include' });
            let { isValid, tipo } = await response.json();

            // Si es válida, redirige
            if (isValid) return { isValid, tipo };

            // Si no es válida, intenta con refugios
            response = await fetch('/refugios/api/auth/check', { credentials: 'include' });
            return await response.json();
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            return { isValid: false };
        }
    }

    const { isValid, tipo } = await verificarSesion();
    const currentPath = window.location.pathname;

    if (isValid) {
        sessionStorage.setItem('tipoUsuario', tipo);

        if (tipo === 'usuario' && !currentPath.startsWith('/usuarios/perfil')) {
            window.location.replace('/usuarios/perfil/usuario');
        } else if (tipo === 'refugio' && !currentPath.startsWith('/refugios/perfil')) {
            window.location.replace('/refugios/perfil/refugio');
        }
    } else {
        sessionStorage.removeItem('tipoUsuario');
        if (!currentPath.includes('/usuarios/login')) {
            window.location.replace('/usuarios/login');
        }
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
