// Espera que el DOM se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    // Ejemplo de una acción al hacer clic en el botón de "Más información"
    const botonHeroico = document.querySelector('.boton-heroico');
  
    if (botonHeroico) {
      botonHeroico.addEventListener('click', () => {
        alert("¡Más información sobre la adopción!");
        // Aquí puedes redirigir o realizar cualquier acción, por ejemplo:
        // window.location.href = 'pagina_adopcion.html';
      });
    }
  
    // Ejemplo de interacción con el botón de "Adóptame"
    const botonesAdoptar = document.querySelectorAll('.boton-adoptar');
  
    botonesAdoptar.forEach((boton) => {
      boton.addEventListener('click', (event) => {
        const nombreGato = event.target.closest('.tarjeta-gato').querySelector('h3').textContent;
        alert(`¡Gracias por querer adoptar a ${nombreGato}!`);
        // Aquí podrías redirigir a una página de adopción con más detalles.
        // window.location.href = '/adopcion/gato/' + nombreGato;
      });
    });
  
    // Ejemplo de validación de campos de búsqueda
    const barrasBusqueda = document.querySelectorAll('.barra-busqueda input');
    
    barrasBusqueda.forEach(input => {
      input.addEventListener('input', () => {
        // Aquí puedes implementar una lógica para filtrar los resultados según lo que se esté escribiendo
        console.log(`Buscando: ${input.value}`);
      });
    });
  });
  