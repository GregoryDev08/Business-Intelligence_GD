// Inicializa los componentes de Bootstrap y la interactividad del sílabo.
document.addEventListener('DOMContentLoaded', () => {
  const progressStorageKey = 'utc-isis1805-progress';
  const unitButtons = Array.from(document.querySelectorAll('[data-complete-unit]'));
  const skillCards = document.querySelectorAll('.skill-card');
  const progressBar = document.querySelector('#courseProgressBar');
  const progressTrack = document.querySelector('.syllabus-progress');
  const progressText = document.querySelector('#courseProgressText');
  const xpText = document.querySelector('#courseXp');
  const progressMessage = document.querySelector('#progressMessage');
  const resetButton = document.querySelector('#resetProgress');
  const completedUnits = new Set();

  // Activa descripciones emergentes para los controles con datos de ayuda.
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
    bootstrap.Tooltip.getOrCreateInstance(element);
  });

  // Activa popovers de Bootstrap y los cierra al hacer clic fuera de ellos.
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach((element) => {
    bootstrap.Popover.getOrCreateInstance(element, { trigger: 'focus' });
  });

  // Inicializa los modales y paneles laterales para habilitar también sus métodos API.
  document.querySelectorAll('.syllabus-modal').forEach((element) => {
    bootstrap.Modal.getOrCreateInstance(element);
  });
  const projectPanel = document.querySelector('#projectOffcanvas');
  if (projectPanel) bootstrap.Offcanvas.getOrCreateInstance(projectPanel);

  // Lee el avance anterior de forma tolerante a datos inválidos o almacenamiento bloqueado.
  try {
    const savedProgress = JSON.parse(window.localStorage.getItem(progressStorageKey) || '[]');
    if (Array.isArray(savedProgress)) {
      savedProgress.forEach((unitIndex) => {
        if (Number.isInteger(unitIndex) && unitIndex >= 0 && unitIndex < unitButtons.length) {
          completedUnits.add(unitIndex);
        }
      });
    }
  } catch (error) {
    progressMessage.textContent = 'Tu progreso se mantendrá durante esta visita.';
  }

  // Actualiza los botones, la barra, los puntos y el mensaje de progreso.
  function renderProgress() {
    const completedCount = completedUnits.size;
    const percentage = (completedCount / unitButtons.length) * 100;
    progressBar.style.width = `${percentage}%`;
    progressTrack.setAttribute('aria-valuenow', String(completedCount));
    progressText.textContent = `${completedCount} de ${unitButtons.length} unidades`;
    xpText.textContent = String(completedCount * 100);
    resetButton.hidden = completedCount === 0;

    unitButtons.forEach((button) => {
      const unitIndex = Number(button.dataset.completeUnit);
      const isComplete = completedUnits.has(unitIndex);
      const unitItem = button.closest('.unit-item');
      button.classList.toggle('is-complete', isComplete);
      button.setAttribute('aria-pressed', String(isComplete));
      button.innerHTML = isComplete
        ? '<span aria-hidden="true">✓</span> Unidad completada · 100 XP'
        : '<span aria-hidden="true">✓</span> Marcar unidad como completada';
      unitItem.classList.toggle('unit-is-complete', isComplete);
    });

    if (completedCount === unitButtons.length) {
      progressMessage.textContent = '¡Ruta completada! Ya recorriste las tres unidades.';
    } else if (completedCount > 0) {
      progressMessage.textContent = `¡Buen avance! Te ${unitButtons.length - completedCount === 1 ? 'queda' : 'quedan'} ${unitButtons.length - completedCount} unidades.`;
    } else if (!progressMessage.textContent.includes('durante esta visita')) {
      progressMessage.textContent = 'La primera unidad te espera.';
    }
  }

  // Marca o desmarca una unidad y guarda el estado para la siguiente visita.
  unitButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const unitIndex = Number(button.dataset.completeUnit);
      if (completedUnits.has(unitIndex)) {
        completedUnits.delete(unitIndex);
      } else {
        completedUnits.add(unitIndex);
      }

      try {
        window.localStorage.setItem(progressStorageKey, JSON.stringify([...completedUnits]));
      } catch (error) {
        progressMessage.textContent = 'El avance se conserva mientras esta página esté abierta.';
      }
      renderProgress();
    });
  });

  // Permite reiniciar la ruta y comenzar de nuevo sin borrar otras preferencias.
  resetButton.addEventListener('click', () => {
    completedUnits.clear();
    try {
      window.localStorage.removeItem(progressStorageKey);
    } catch (error) {
      // El avance de esta visita se reinicia aunque el almacenamiento esté bloqueado.
    }
    renderProgress();
    document.querySelector('#ruta').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Voltea una tarjeta al hacer clic; el CSS gestiona hover y foco de teclado.
  skillCards.forEach((card) => {
    card.addEventListener('click', () => {
      const isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
    });
  });

  renderProgress();
});
