const startButton = document.querySelector("#start");
const easyButton = document.querySelector("#easy");
const mediumButton = document.querySelector("#medium");
const hardButton = document.querySelector("#hard");
const difficulty = document.querySelector(".difficulty");
const vanilla = document.querySelector(".vanilla");
let url = "";

startButton.addEventListener("click", () => {
  switch (true) {
    case easyButton.checked:
      url = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy";
      break;
    case mediumButton.checked:
      url =
        "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium";
      break;
    case hardButton.checked:
      url = "https://opentdb.com/api.php?amount=10&category=9&difficulty=hard";
      break;
    default:
      url = "https://opentdb.com/api.php?amount=10&category=9";
      break;
  }

  difficulty.style.display = "none";
  vanilla.style.display = "none";
  let score = 0;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.results.length; i++) {
        let question = data.results[i].question;
        let correct_answer = data.results[i].correct_answer;
        let incorrect_answers = data.results[i].incorrect_answers;
        let answers = incorrect_answers.concat(correct_answer);
        answers = shuffle(answers);
        let answersHTML = "";
        for (let j = 0; j < answers.length; j++) {
          answersHTML += `<input type="radio" name="answers${i}" value="${answers[j]}" id="${answers[j]}${i}"><label for="${answers[j]}${i}">${answers[j]}</label></input>`;
        }
        let displayClass = "";
        if (i === 0) {
          displayClass = "show";
        } else {
          displayClass = "hide";
        }
        let questionHTML = `
          <div class="q${i} ${displayClass}">  
            <legend for="answers${i}">${question}</legend>
            <div class="answers">${answersHTML}</div>
            <button id="submit${i}" class="submit">Submit</button>
          </div>
        `;
        document.querySelector(".question").innerHTML += questionHTML;

        const submitButtons = document.querySelectorAll(".submit");
        for (let k = 0; k < submitButtons.length; k++) {
          submitButtons[k].addEventListener("click", () => {
            let userAnswer = document.querySelector(`input[name=answers${k}]:checked`).value;
            let correctAnswer = data.results[k].correct_answer;
            let result = "";
            if (userAnswer === correctAnswer) {
              score++;
              result = "Correct!";
            } else {
              result = "Nope.";
            }
            document.querySelector(".result").innerHTML = result;
            document.querySelector(`label[for='${correctAnswer}${k}']`).classList.add("correct");
            submitButtons[k].style.display = "none";
            if (k === data.results.length - 1) {
              document.querySelector(
                ".result"
              ).innerHTML = `You scored ${score} out of ${data.results.length}!
                            <br/ >
                            Get yourself a treat!`;
              
              vanilla.style.display = "block";
            } else {
              document.querySelector("#next").style.display = "block";
            }
          });
        }
      }
    });
});

const nextButton = document.querySelector("#next");
nextButton.addEventListener("click", () => {
  let currentQuestion = document.querySelector(".show");
  let nextQuestion = currentQuestion.nextElementSibling;
  currentQuestion.classList.remove("show");
  currentQuestion.classList.add("hide");
  nextQuestion.classList.remove("hide");
  nextQuestion.classList.add("show");
  document.querySelector(".result").innerHTML = "";
  nextButton.style.display = "none";
});

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
