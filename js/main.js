// ================================================================
// Archivo: main.js
// Proyecto: Mundi Synthetic – Blog sobre VR y Robótica
// Funcionalidad principal: Control del modo oscuro y comportamiento
// de elementos del header cargado dinámicamente.
// ================================================================

// Nota inicial:
// Se ha eliminado el antiguo alert de depuración que se ejecutaba
// al hacer clic en el título, para que ahora el título funcione
// únicamente como enlace a la página principal (index.html).

// En caso de necesitar interacciones adicionales en la cabecera
// (menús, animaciones o detección de scroll), deben añadirse aquí,
// apuntando a elementos concretos mediante selectores.
(() => {
  /*
    IIFE (Immediately Invoked Function Expression):
    ------------------------------------------------
    Se usa para encapsular el código y evitar que variables globales
    queden expuestas en el ámbito global de window.
    De esta forma, el script puede cargarse dinámicamente tras el
    fetch del header sin colisionar con otros módulos o scripts.
  */

  // 1. Referencia al botón del modo oscuro, inyectado dentro del header.
  const btn = document.getElementById('dark-mode-toggle');
  if (!btn) {
    // Si el header aún no se ha cargado cuando se ejecuta este script,
    // se muestra una advertencia y se sale silenciosamente.
    // Esto evita errores en consola y mejora la tolerancia a fallos.
    console.warn('[Mundi Synthetic] Botón del modo oscuro no encontrado aún.');
    return;
  }

  /*
    2. Función apply(enabled)
    -------------------------
    Aplica o quita la clase "dark-mode" en <html> y actualiza:
      - Atributo aria-pressed: para accesibilidad.
      - localStorage: para persistir la preferencia del usuario.
      - Icono del botón: ☀️ (modo claro) o 🌙 (modo oscuro).
    Este patrón combina accesibilidad (ARIA), UX visual y persistencia local.
  */
  const apply = (enabled) => {
    // Cambia la clase global del documento.
    document.documentElement.classList.toggle('dark-mode', enabled);
    // Actualiza el estado accesible del botón.
    btn.setAttribute('aria-pressed', String(Boolean(enabled)));
    // Guarda preferencia persistente.
    localStorage.setItem('darkMode', enabled ? '1' : '0');
    // Cambia el icono según el modo.
    btn.textContent = enabled ? '☀️' : '🌙';
  };

  /*
    3. Inicialización del estado inicial:
    -------------------------------------
    - Si el usuario ya guardó una preferencia en localStorage, se respeta.
    - En caso contrario, se consulta la preferencia del sistema operativo
      mediante media query (prefers-color-scheme).
  */
  const stored = localStorage.getItem('darkMode');
  if (stored !== null) {
    // Carga desde preferencia guardada (1 = modo oscuro activo).
    apply(stored === '1');
  } else {
    // Si no hay dato previo, usa preferencia del sistema.
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(prefersDark);
  }

  /*
    4. Listener de eventos:
    ------------------------
    Al hacer clic en el botón, se invierte el estado actual.
    Se vuelve a aplicar la función apply() con el nuevo valor.
    Este enfoque mantiene sincronía visual, accesible y persistente.
  */
  btn.addEventListener('click', () => {
    const isOn = btn.getAttribute('aria-pressed') === 'true';
    apply(!isOn);
  });

  /*
    Resultado final:
    ----------------
    - La preferencia se recuerda entre sesiones.
    - El modo oscuro se aplica antes de renderizar contenido perceptible,
      evitando "parpadeo" (flash) si se carga al inicio del sitio.
    - Total compatibilidad con header cargado dinámicamente vía fetch.
  */
})();
