// Cuestionario de fundamentos de BI. Cada respuesta correcta suma 75 puntos.
document.addEventListener('DOMContentLoaded', () => {
  const questions = Array.from(document.querySelectorAll('.quiz-question'));
  const progressBar = document.querySelector('#quizProgress');
  const progressTrack = document.querySelector('.quiz-progress-wrap .progress');
  const progressText = document.querySelector('#progressText');
  const scoreText = document.querySelector('#scoreText');
  const resultText = document.querySelector('#quizResult');
  const restartButton = document.querySelector('#restartQuiz');
  const correctAnswers = ['b', 'a', 'b', 'b'];
  const explanations = [
    'BI convierte datos en información útil para orientar decisiones.',
    'Transformar implica limpiar, estandarizar y aplicar reglas a los datos.',
    'El criterio humano aporta contexto y ayuda a priorizar acciones.',
    'Ventas y existencias permiten planificar la reposición de productos.'
  ];
  let answeredCount = 0;
  let score = 0;

  // Registra una respuesta, da retroalimentación inmediata y bloquea ese intento.
  function answerQuestion(questionElement, selectedButton) {
    if (questionElement.dataset.answered === 'true') return;

    const questionIndex = Number(questionElement.dataset.question);
    const isCorrect = selectedButton.dataset.answer === correctAnswers[questionIndex];
    const feedback = questionElement.querySelector('.answer-feedback');
    questionElement.dataset.answered = 'true';
    answeredCount += 1;

    questionElement.querySelectorAll('.answer-option').forEach((button) => {
      button.disabled = true;
      if (button.dataset.answer === correctAnswers[questionIndex]) {
        button.classList.add('answer-correct');
      }
    });

    if (isCorrect) {
      score += 75;
      selectedButton.classList.add('answer-correct');
      feedback.textContent = `¡Correcto! ${explanations[questionIndex]}`;
      feedback.classList.add('feedback-correct');
    } else {
      selectedButton.classList.add('answer-incorrect');
      feedback.textContent = `No es esa. ${explanations[questionIndex]}`;
      feedback.classList.add('feedback-incorrect');
    }

    updateProgress();
  }

  // Actualiza el avance, el puntaje y el estado final del cuestionario.
  function updateProgress() {
    const percentage = (answeredCount / questions.length) * 100;
    progressBar.style.width = `${percentage}%`;
    progressTrack.setAttribute('aria-valuenow', String(answeredCount));
    scoreText.textContent = `${score} / ${questions.length * 75} puntos`;

    const nextQuestion = questions.find((question) => question.dataset.answered !== 'true');
    if (nextQuestion) {
      const questionNumber = Number(nextQuestion.dataset.question) + 1;
      progressText.textContent = `Pregunta ${questionNumber} de ${questions.length}`;
      nextQuestion.hidden = false;
      nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    progressText.textContent = 'Cuestionario completado';
    resultText.textContent = score === questions.length * 75
      ? `¡Ganaste ${score} puntos de conocimiento! Dominaste los fundamentos de BI.`
      : `¡Ganaste ${score} puntos de conocimiento! Vuelve a intentarlo para superar tu resultado.`;
    resultText.classList.add('quiz-result-complete');
    restartButton.hidden = false;
  }

  // Conecta cada opción con la lógica de evaluación de su pregunta.
  questions.forEach((questionElement) => {
    questionElement.querySelectorAll('.answer-option').forEach((button) => {
      button.addEventListener('click', () => answerQuestion(questionElement, button));
    });
  });

  // Restablece respuestas, puntaje, progreso y visibilidad para un nuevo intento.
  restartButton.addEventListener('click', () => {
    answeredCount = 0;
    score = 0;
    questions.forEach((questionElement, index) => {
      questionElement.dataset.answered = 'false';
      questionElement.hidden = index !== 0;
      questionElement.querySelector('.answer-feedback').textContent = '';
      questionElement.querySelector('.answer-feedback').className = 'answer-feedback';
      questionElement.querySelectorAll('.answer-option').forEach((button) => {
        button.disabled = false;
        button.classList.remove('answer-correct', 'answer-incorrect');
      });
    });
    progressBar.style.width = '0%';
    progressTrack.setAttribute('aria-valuenow', '0');
    progressText.textContent = 'Pregunta 1 de 4';
    scoreText.textContent = '0 / 300 puntos';
    resultText.textContent = 'Responde las cuatro preguntas para conocer tu puntaje.';
    resultText.classList.remove('quiz-result-complete');
    restartButton.hidden = true;
    document.querySelector('#cuestionario').scrollIntoView({ behavior: 'smooth' });
  });
});
