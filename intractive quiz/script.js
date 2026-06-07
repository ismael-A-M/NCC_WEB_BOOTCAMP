
const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
    correct: 0,
  },
  {
    question: "Which CSS property changes text color?",
    options: ["text-color", "font-color", "color", "foreground"],
    correct: 2,
  },
  {
    question: "How to get element by ID in JavaScript?",
    options: [
      "document.getElementById('demo')",
      "document.getElement('demo')",
      "#demo",
      "document.getById('demo')",
    ],
    correct: 0,
  },
  {
    question: "Which HTTP method requests data?",
    options: ["POST", "GET", "PUT", "DELETE"],
    correct: 1,
  },
  {
    question: "What does DOM stand for?",
    options: [
      "Digital Object Model",
      "Document Object Model",
      "Data Object Management",
      "Dynamic Object Method",
    ],
    correct: 1,
  },
  {
    question: "Which is NOT a JavaScript data type?",
    options: ["Number", "String", "Boolean", "Character"],
    correct: 3,
  },
  {
    question: "What is localStorage used for?",
    options: [
      "Temporary session data",
      "Permanent client-side storage",
      "Server storage",
      "Image caching",
    ],
    correct: 1,
  },
  {
    question: "Which selector has highest specificity?",
    options: ["Class", "ID", "Element", "Universal"],
    correct: 1,
  },
  {
    question: "What is typeof null in JavaScript?",
    options: ["'null'", "'undefined'", "'object'", "'number'"],
    correct: 2,
  },
  {
    question: "Which event fires when page loads?",
    options: ["onchange", "onsubmit", "onload", "onclick"],
    correct: 2,
  },
];
let currentQuestion = 0;
let answers = new Array(questions.length).fill(null);
let timeLeft = 30;
let timerInterval = null;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options-box");
const questionCounter = document.getElementById("question-counter");
const timerDisplay = document.getElementById("timer");
const progressFill = document.getElementById("progress-fill");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

function startQuiz() {
  currentQuestion = 0;
  answers = new Array(questions.length).fill(null);

  const saved = localStorage.getItem("quizProgress");
  if (saved) {
    const progress = JSON.parse(saved);
    if (confirm("Resume previous quiz?")) {
      currentQuestion = progress.currentQuestion;
      answers = progress.answers;
    }
  }

  startScreen.classList.add("hide");
  quizScreen.classList.remove("hide");
  resultScreen.classList.add("hide");

  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentQuestion];

  questionText.textContent = q.question;
  questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressFill.style.width = progress + "%";

  optionsBox.innerHTML = "";
  const savedAnswer = answers[currentQuestion];

  for (let i = 0; i < q.options.length; i++) {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = q.options[i];

    if (savedAnswer !== null) {
      div.classList.add("disabled");
      if (i === savedAnswer) {
        div.classList.add(i === q.correct ? "correct" : "incorrect");
      }
      if (i === q.correct && savedAnswer !== q.correct) {
        div.classList.add("correct");
      }
    } else {
      div.onclick = function () {
        selectAnswer(i);
      };
    }

    optionsBox.appendChild(div);
  }

 
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.textContent =
    currentQuestion === questions.length - 1 ? "Finish" : "Next";

  clearInterval(timerInterval);
  if (savedAnswer === null) {
    startTimer();
  } else {
    timerDisplay.textContent = "Done";
    timerDisplay.className = "";
  }

  saveProgress();
}


function selectAnswer(index) {
  if (answers[currentQuestion] !== null) return;

  answers[currentQuestion] = index;
  clearInterval(timerInterval);

  const q = questions[currentQuestion];
  const options = document.querySelectorAll(".option");

  for (let i = 0; i < options.length; i++) {
    options[i].classList.add("disabled");
    options[i].onclick = null;

    if (i === index) {
      options[i].classList.add(i === q.correct ? "correct" : "incorrect");
    }
    if (i === q.correct && index !== q.correct) {
      options[i].classList.add("correct");
    }
  }

  saveProgress();


  setTimeout(function () {
    if (currentQuestion < questions.length - 1) {
      nextQuestion();
    } else {
      finishQuiz();
    }
  }, 1000);
}


function startTimer() {
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;
  timerDisplay.className = "";

  timerInterval = setInterval(function () {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 10) {
      timerDisplay.className = "danger";
    } else if (timeLeft <= 20) {
      timerDisplay.className = "warning";
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      answers[currentQuestion] = -1; 
      saveProgress();

      
      const q = questions[currentQuestion];
      const options = document.querySelectorAll(".option");
      for (let i = 0; i < options.length; i++) {
        options[i].classList.add("disabled");
        options[i].onclick = null;
        if (i === q.correct) {
          options[i].classList.add("correct");
        }
      }

      setTimeout(function () {
        if (currentQuestion < questions.length - 1) {
          nextQuestion();
        } else {
          finishQuiz();
        }
      }, 1500);
    }
  }, 1000);
}


function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    finishQuiz();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}


function finishQuiz() {
  clearInterval(timerInterval);
  localStorage.removeItem("quizProgress");

  quizScreen.classList.add("hide");
  resultScreen.classList.remove("hide");


  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i] === -1 || answers[i] === null) {
      unanswered++;
    } else if (answers[i] === questions[i].correct) {
      correct++;
    } else {
      incorrect++;
    }
  }

  const score = correct;
  const percentage = Math.round((correct / questions.length) * 100);

  
  document.getElementById("final-score").textContent =
    "Score: " + score + "/" + questions.length;
  document.getElementById("percentage").textContent = percentage + "%";


  let msg = "";
  let msgClass = "";
  if (percentage <= 40) {
    msg = "Needs Improvement";
    msgClass = "needs-improvement";
  } else if (percentage <= 70) {
    msg = "Good Effort";
    msgClass = "good-effort";
  } else if (percentage <= 90) {
    msg = "Great Work";
    msgClass = "great-work";
  } else {
    msg = "Excellent";
    msgClass = "excellent";
  }

  const msgEl = document.getElementById("message");
  msgEl.textContent = msg;
  msgEl.className = msgClass;


  document.getElementById("correct-count").textContent = correct;
  document.getElementById("incorrect-count").textContent = incorrect;
  document.getElementById("unanswered-count").textContent = unanswered;

  const reviewBox = document.getElementById("review-box");
  reviewBox.innerHTML = "<h3>Review</h3>";

  for (let i = 0; i < questions.length; i++) {
    const ans = answers[i];
    const q = questions[i];
    let status = "";
    let statusClass = "";

    if (ans === -1 || ans === null) {
      status = "Unanswered";
      statusClass = "unanswered";
    } else if (ans === q.correct) {
      status = "Correct";
      statusClass = "correct";
    } else {
      status = "Incorrect";
      statusClass = "incorrect";
    }

    const item = document.createElement("div");
    item.className = "review-item " + statusClass;
    item.innerHTML =
      '<div class="review-status">' +
      status +
      "</div>" +
      '<div class="review-question">' +
      (i + 1) +
      ". " +
      q.question +
      "</div>" +
      '<div class="review-answer">' +
      (ans !== -1 && ans !== null
        ? "Your answer: " + q.options[ans] + "<br>"
        : "") +
      "<strong>Correct: " +
      q.options[q.correct] +
      "</strong>" +
      "</div>";

    reviewBox.appendChild(item);
  }
}


function restartQuiz() {
  currentQuestion = 0;
  answers = new Array(questions.length).fill(null);
  startScreen.classList.remove("hide");
  quizScreen.classList.add("hide");
  resultScreen.classList.add("hide");
}

function saveProgress() {
  const progress = {
    currentQuestion: currentQuestion,
    answers: answers,
  };
  localStorage.setItem("quizProgress", JSON.stringify(progress));
}

window.onload = function () {
  const saved = localStorage.getItem("quizProgress");
  if (saved) {
    const progress = JSON.parse(saved);
    if (progress.answers.some((a) => a !== null)) {
      startScreen.innerHTML +=
        '<p style="color: #4f46e5; margin-top: 10px;">You have saved progress!</p>';
    }
  }
};
