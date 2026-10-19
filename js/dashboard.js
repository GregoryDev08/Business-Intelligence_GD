// Datos ficticios en formato JSON para el ejemplo de Liga Pro 2026.
const ligaProData = {
  standings: [
    { team: 'Ind. del Valle', points: 22 },
    { team: 'Barcelona SC', points: 19 },
    { team: 'LDU Quito', points: 18 },
    { team: 'U. Católica', points: 17 },
    { team: 'Emelec', points: 15 }
  ],
  goalsByMatch: [
    { matchday: 'Fecha 6', goals: 2 },
    { matchday: 'Fecha 7', goals: 1 },
    { matchday: 'Fecha 8', goals: 3 },
    { matchday: 'Fecha 9', goals: 2 },
    { matchday: 'Fecha 10', goals: 2 }
  ],
  titleProbability: [
    { team: 'Independiente del Valle', percentage: 32 },
    { team: 'Barcelona SC', percentage: 25 },
    { team: 'LDU Quito', percentage: 20 },
    { team: 'Universidad Católica', percentage: 13 },
    { team: 'Emelec', percentage: 10 }
  ]
};

// Paleta de alto contraste compartida por las visualizaciones y la leyenda.
const chartColors = ['#d9432f', '#126b55', '#e0a33a', '#527d9a', '#99a89a'];
const chartFont = "'DM Sans', sans-serif";

// Define estilos comunes de ejes para comparar los datos sin ruido visual.
function getAxisOptions() {
  return {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#6e7772', font: { family: chartFont, size: 11 } }
    },
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: { color: '#e7eae5', drawTicks: false },
      ticks: { color: '#6e7772', padding: 10, font: { family: chartFont, size: 11 } }
    }
  };
}

// Configura la comparación de puntos de los cinco equipos punteros.
function renderPointsChart() {
  const canvas = document.querySelector('#pointsChart');
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ligaProData.standings.map((team) => team.team),
      datasets: [{
        data: ligaProData.standings.map((team) => team.points),
        backgroundColor: chartColors,
        borderRadius: 3,
        borderSkipped: false,
        barPercentage: 0.66,
        categoryPercentage: 0.76
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#17231f',
          padding: 10,
          titleFont: { family: chartFont },
          bodyFont: { family: chartFont },
          callbacks: { label: (context) => `${context.raw} puntos` }
        }
      },
      scales: {
        ...getAxisOptions(),
        y: { ...getAxisOptions().y, max: 25, ticks: { ...getAxisOptions().y.ticks, stepSize: 5 } }
      }
    }
  });
}

// Muestra la evolución ofensiva de Independiente del Valle en cinco fechas.
function renderGoalsChart() {
  const canvas = document.querySelector('#goalsChart');
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: ligaProData.goalsByMatch.map((match) => match.matchday.replace('Fecha ', 'F')),
      datasets: [{
        data: ligaProData.goalsByMatch.map((match) => match.goals),
        borderColor: '#126b55',
        backgroundColor: 'rgba(18, 107, 85, 0.11)',
        pointBackgroundColor: '#fffdf8',
        pointBorderColor: '#126b55',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2.5,
        tension: 0.35,
        fill: true
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#17231f',
          padding: 10,
          titleFont: { family: chartFont },
          bodyFont: { family: chartFont },
          callbacks: { label: (context) => `${context.raw} goles` }
        }
      },
      scales: {
        ...getAxisOptions(),
        y: { ...getAxisOptions().y, max: 4, ticks: { ...getAxisOptions().y.ticks, stepSize: 1, precision: 0 } }
      }
    }
  });
}

// Construye la gráfica de dona y su leyenda accesible a partir de los porcentajes.
function renderProbabilityChart() {
  const canvas = document.querySelector('#probabilityChart');
  const legend = document.querySelector('#probabilityLegend');
  if (!canvas || !legend || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ligaProData.titleProbability.map((team) => team.team),
      datasets: [{
        data: ligaProData.titleProbability.map((team) => team.percentage),
        backgroundColor: chartColors,
        borderColor: '#fffdf8',
        borderWidth: 3,
        hoverOffset: 5
      }]
    },
    options: {
      maintainAspectRatio: false,
      cutout: '69%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#17231f',
          padding: 10,
          titleFont: { family: chartFont },
          bodyFont: { family: chartFont },
          callbacks: { label: (context) => `${context.label}: ${context.raw}%` }
        }
      }
    }
  });

  legend.innerHTML = ligaProData.titleProbability.map((team, index) => `
    <div class="legend-item">
      <span class="legend-swatch" style="--swatch-color: ${chartColors[index]}" aria-hidden="true"></span>
      <span class="legend-team">${team.team}</span>
      <strong>${team.percentage}%</strong>
    </div>
  `).join('');
}

// Renderiza todos los gráficos cuando el documento y Chart.js están disponibles.
document.addEventListener('DOMContentLoaded', () => {
  renderPointsChart();
  renderGoalsChart();
  renderProbabilityChart();
});
