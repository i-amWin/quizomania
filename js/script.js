(async function addQuizzes() {
  const quizzesContainer = document.getElementById("quiz-container");
  const quizTemplate = document.getElementById("quiz-template");

  const quizzes = await fetch(
    "https://quizapi.io/api/v1/questions?apiKey=myLgQoCafnbUW2qIKmslFe61c66Fg4B9mr146D3G&tags=html&limit=10&difficulty=easy"
  )
    .then((value) => {
      return value.json();
    })
    .then((value) => {
      return value;
    });

  quizzes.forEach((quiz) => {
    const quizNode = quizTemplate.content.cloneNode(true);
    const quizQuestion = quizNode.querySelector(".quiz__question");
    const quizAnswers = quizNode.querySelectorAll(".quiz__answer__btn");
    const correctAnswer = quizNode.querySelector(".correct-answer span");

    quizQuestion.textContent = quiz.question;

    let correctAnswerKey = "answer_a";

    for (const key in quiz.correct_answers) {
      if (quiz.correct_answers[key] === "false") continue;
      correctAnswerKey = key.slice(0, -8);
    }

    correctAnswer.textContent = quiz.answers[correctAnswerKey];

    const answers = Object.keys(quiz.answers);

    for (let i = 0; i < answers.length; i++) {
      const answerKey = answers[i];

      if (quiz.answers[answerKey] === null) {
        quizAnswers[i].parentElement.style.display = "none";
        continue;
      }

      quizAnswers[i].textContent = quiz.answers[answerKey];

      if (quizAnswers[i].textContent === correctAnswer.textContent) {
        quizAnswers[
          i
        ].nextElementSibling.innerHTML = `<i class="fa-solid fa-check"></i>`;
        quizAnswers[i].parentElement.classList.add("correct");
      }
    }

    quizzesContainer.append(quizNode);
  });

  const quizContainer = quizzesContainer.querySelectorAll(".quiz__answers");

  quizContainer.forEach((quiz) => {
    function showResult(e) {
      const clickedAnswer =
        e.target.querySelector(".quiz__answer__btn") || e.target;
      const correctAnswer = quiz.nextElementSibling.querySelector("span");

      quiz.classList.add("clicked");

      if (clickedAnswer.textContent !== correctAnswer.textContent) {
        clickedAnswer.parentElement.classList.add("incorrect");
        correctAnswer.parentElement.style.display = "initial";
      }

      if (quiz.classList.contains("clicked")) {
        quiz.removeEventListener("click", showResult);
      }
    }

    quiz.addEventListener("click", showResult);
  });
})();
