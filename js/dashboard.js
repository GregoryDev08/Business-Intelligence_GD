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
const chartInstances = [];

// Define estilos comunes de ejes para comparar los datos sin ruido visual.
function getAxisOptions() {
  const rootStyles = getComputedStyle(document.documentElement);
  const axisColor = rootStyles.getPropertyValue('--chart-axis').trim() || '#6e7772';
  const gridColor = rootStyles.getPropertyValue('--chart-grid').trim() || '#e7eae5';

  return {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: axisColor, font: { family: chartFont, size: 11 } }
    },
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: { color: gridColor, drawTicks: false },
      ticks: { color: axisColor, padding: 10, font: { family: chartFont, size: 11 } }
    }
  };
}

// Configura la comparación de puntos de los cinco equipos punteros.
function renderPointsChart() {
  const canvas = document.querySelector('#pointsChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const chart = new Chart(canvas, {
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
  chartInstances.push(chart);
}

// Muestra la evolución ofensiva de Independiente del Valle en cinco fechas.
function renderGoalsChart() {
  const canvas = document.querySelector('#goalsChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const chart = new Chart(canvas, {
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
  chartInstances.push(chart);
}

// Construye la gráfica de dona y su leyenda accesible a partir de los porcentajes.
function renderProbabilityChart() {
  const canvas = document.querySelector('#probabilityChart');
  const legend = document.querySelector('#probabilityLegend');
  if (!canvas || !legend || typeof Chart === 'undefined') return;

  const chart = new Chart(canvas, {
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
  chartInstances.push(chart);

  legend.innerHTML = ligaProData.titleProbability.map((team, index) => `
    <div class="legend-item">
      <span class="legend-swatch" style="--swatch-color: ${chartColors[index]}" aria-hidden="true"></span>
      <span class="legend-team">${team.team}</span>
      <strong>${team.percentage}%</strong>
    </div>
  `).join('');
}

// Actualiza ejes y tooltips cuando el usuario cambia entre tema claro y oscuro.
function updateChartsTheme() {
  const rootStyles = getComputedStyle(document.documentElement);
  const axisColor = rootStyles.getPropertyValue('--chart-axis').trim();
  const gridColor = rootStyles.getPropertyValue('--chart-grid').trim();
  const tooltipColor = rootStyles.getPropertyValue('--chart-tooltip').trim();

  chartInstances.forEach((chart) => {
    if (chart.options.scales?.x) chart.options.scales.x.ticks.color = axisColor;
    if (chart.options.scales?.y) {
      chart.options.scales.y.ticks.color = axisColor;
      chart.options.scales.y.grid.color = gridColor;
    }
    if (chart.options.plugins?.tooltip) chart.options.plugins.tooltip.backgroundColor = tooltipColor;
    chart.update('none');
  });
}

// Genera un libro Excel con clasificación, goles por fecha y probabilidades.
function exportExcelReport() {
  if (!window.XLSX) {
    window.alert('No se pudo cargar la herramienta de Excel. Comprueba tu conexión e inténtalo de nuevo.');
    return;
  }

  const workbook = window.XLSX.utils.book_new();
  const sheets = [
    ['Clasificacion', ligaProData.standings.map((team, index) => ({ Posicion: index + 1, Equipo: team.team, Puntos: team.points }))],
    ['Goles por fecha', ligaProData.goalsByMatch.map((match) => ({ Fecha: match.matchday, 'Goles a favor': match.goals }))],
    ['Probabilidades', ligaProData.titleProbability.map((team) => ({ Equipo: team.team, 'Probabilidad (%)': team.percentage }))]
  ];

  sheets.forEach(([sheetName, rows]) => {
    const worksheet = window.XLSX.utils.json_to_sheet(rows);
    window.XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });
  window.XLSX.writeFile(workbook, 'liga-pro-2026-reporte.xlsx');
}

// Crea un PDF de dos páginas con tablas y capturas de las tres gráficas.
function exportPdfReport() {
  const PdfConstructor = window.jspdf?.jsPDF;
  if (!PdfConstructor) {
    window.alert('No se pudo cargar la herramienta PDF. Comprueba tu conexión e inténtalo de nuevo.');
    return;
  }

  const pdf = new PdfConstructor({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const reportDate = new Date().toLocaleDateString('es-EC');
  const isDarkTheme = document.documentElement.dataset.theme === 'dark';
  const textColor = isDarkTheme ? [237, 242, 238] : [23, 35, 31];
  const mutedColor = isDarkTheme ? [163, 175, 167] : [100, 110, 104];
  const ruleColor = isDarkTheme ? [53, 67, 59] : [205, 214, 207];
  const paintPage = () => {
    if (!isDarkTheme) return;
    pdf.setFillColor(20, 27, 23);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  paintPage();

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(19);
  pdf.text('Liga Pro 2026 | Reporte de etapa', margin, 20);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Primera etapa · corte Fecha 10 · Generado ${reportDate}`, margin, 27);
  pdf.setTextColor(...mutedColor);
  pdf.text('Datos ficticios con fines educativos; no representan resultados oficiales.', margin, 33);
  pdf.setTextColor(...textColor);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('Clasificación de los cinco líderes', margin, 44);
  pdf.setFontSize(9);
  pdf.text('POS.', margin, 52);
  pdf.text('EQUIPO', margin + 17, 52);
  pdf.text('PUNTOS', pageWidth - margin - 8, 52, { align: 'right' });
  pdf.setDrawColor(...ruleColor);
  pdf.line(margin, 55, pageWidth - margin, 55);

  pdf.setFont('helvetica', 'normal');
  ligaProData.standings.forEach((team, index) => {
    const rowY = 62 + index * 7;
    pdf.text(String(index + 1), margin, rowY);
    pdf.text(team.team, margin + 17, rowY);
    pdf.text(String(team.points), pageWidth - margin - 8, rowY, { align: 'right' });
    pdf.setDrawColor(...ruleColor);
    pdf.line(margin, rowY + 2, pageWidth - margin, rowY + 2);
  });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('Puntos por equipo', margin, 105);
  const pointsCanvas = document.querySelector('#pointsChart');
  if (pointsCanvas) pdf.addImage(pointsCanvas.toDataURL('image/png'), 'PNG', margin, 110, pageWidth - margin * 2, 82);

  pdf.addPage();
  paintPage();
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Producción y probabilidad', margin, 20);
  pdf.setFontSize(12);
  pdf.text('Goles a favor · Independiente del Valle', margin, 31);
  const goalsCanvas = document.querySelector('#goalsChart');
  if (goalsCanvas) pdf.addImage(goalsCanvas.toDataURL('image/png'), 'PNG', margin, 35, pageWidth - margin * 2, 72);

  pdf.setFontSize(12);
  pdf.text('Probabilidad estimada de ganar la primera etapa', margin, 120);
  const probabilityCanvas = document.querySelector('#probabilityChart');
  if (probabilityCanvas) pdf.addImage(probabilityCanvas.toDataURL('image/png'), 'PNG', margin, 125, 78, 78);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  ligaProData.titleProbability.forEach((team, index) => {
    const rowY = 135 + index * 10;
    pdf.text(team.team, margin + 88, rowY);
    pdf.text(`${team.percentage}%`, pageWidth - margin, rowY, { align: 'right' });
  });
  pdf.setFontSize(8);
  pdf.setTextColor(...mutedColor);
  pdf.text('Estimaciones simuladas e ilustrativas; no son predicciones verificadas.', margin, 218);
  pdf.save('liga-pro-2026-reporte.pdf');
}

// Renderiza todos los gráficos cuando el documento y Chart.js están disponibles.
document.addEventListener('DOMContentLoaded', () => {
  renderPointsChart();
  renderGoalsChart();
  renderProbabilityChart();
  document.querySelector('#exportExcel')?.addEventListener('click', exportExcelReport);
  document.querySelector('#exportPdf')?.addEventListener('click', exportPdfReport);
});

// Escucha los cambios del tema compartido con las páginas del proyecto.
window.addEventListener('themechange', updateChartsTheme);
