// Aplica el tema guardado antes de renderizar la página para evitar destellos.
const themeStorageKey = 'bi-page-theme';
let currentTheme = 'light';

try {
  const savedTheme = window.localStorage.getItem(themeStorageKey);
  if (savedTheme === 'dark' || savedTheme === 'light') currentTheme = savedTheme;
} catch (error) {
  // El selector sigue funcionando aunque el navegador bloquee el almacenamiento local.
}

document.documentElement.dataset.theme = currentTheme;

// Sincroniza controles, guarda la preferencia y notifica a las gráficas.
document.addEventListener('DOMContentLoaded', () => {
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');

  function updateThemeControls() {
    const isDark = currentTheme === 'dark';
    themeButtons.forEach((button) => {
      const icon = button.querySelector('.theme-icon');
      const label = button.querySelector('.theme-label');
      button.setAttribute('aria-pressed', String(isDark));
      button.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
      button.title = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
      if (icon) icon.textContent = isDark ? '☀' : '☾';
      if (label) label.textContent = isDark ? 'Tema claro' : 'Tema oscuro';
    });
  }

  // Cambia entre claro y oscuro manteniendo el tema al navegar entre páginas.
  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = currentTheme;
      try {
        window.localStorage.setItem(themeStorageKey, currentTheme);
      } catch (error) {
        // El tema actual queda aplicado aunque no se pueda guardar la preferencia.
      }
      updateThemeControls();
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: currentTheme } }));
    });
  });

  updateThemeControls();
});
