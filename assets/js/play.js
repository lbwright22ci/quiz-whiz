document.addEventListener("DOMContentLoaded", function () {
  const urlStart = "https://opentdb.com/api.php?amount=12&difficulty=";
  const urlEnd = "&type=multiple";
  const difficulty = ["easy", "medium", "hard"];

  /**
   *  Game Object is global object holding all the information for one quiz round
   */
  let game = {
    qNumber: 0,
    correctAnswers: 0,
    sessionToken: "",
    passedQuestions: 0,
    url: "",
    question: {
      qText: [],
      wrong1: [],
      wrong2: [],
      wrong3: [],
      correctAnswer: [],
      category: [],
      correctAnswerId: [],
      userAnswerId: [],
    },
  };

  document
    .getElementById("submit")
    .addEventListener("click", (e) => startGame(e));
  document
    .getElementById("info")
    .addEventListener("click", (e) => toggleInstructions(e));
  document
    .getElementById("submit-answer")
    .addEventListener("click", (event) => collectUserAnswer(event));
  document
    .getElementById("category")
    .addEventListener("click", (e) => displayHint());
  document.addEventListener("keydown", (e) => enterKey(e));

  /**
   * Event listener to enable user to use keyboard controls for:
   * 1. selecting play
   * 2. toggling possible answers
   * 3. submitting an answer
   * 4. moving to the next question in the quiz
   * */
  function enterKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        document
          .getElementsByClassName("question-zone")[0]
          .classList.contains("hide")
      ) {
        startGame(e);
      } else if (
        !document.getElementById("submit-answer").classList.contains("hide") &&
        document.getElementById("next-question").classList.contains("hide")
      ) {
        collectUserAnswer(e);
      } else if (
        document.getElementById("submit-answer").classList.contains("hide") &&
        !document.getElementById("next-question").classList.contains("hide") &&
        game.qNumber < 12
      ) {
        setNextQ(e);
      } else if (
        document.getElementById("submit-answer").classList.contains("hide") &&
        !document.getElementById("next-question").classList.contains("hide") &&
        game.qNumber === 12
      ) {
        endGame(e);
      }
    } else if (
      !document
        .getElementsByClassName("question-options")[0]
        .classList.contains("hide") &&
      e.key === "ArrowUp"
    ) {
      e.preventDefault();
      let currentChecked = 10;
      let options = document.getElementsByName("possible-answer");

      for (let i = 0; i < 5; i++) {
        if (options[i].checked === true) {
          currentChecked = i;
          options[i].checked = false;
        }
      }

      if (currentChecked === 0) {
        options[4].checked = true;
      } else {
        options[currentChecked - 1].checked = true;
      }
    } else if (
      !document
        .getElementsByClassName("question-options")[0]
        .classList.contains("hide") &&
      e.key === "ArrowDown"
    ) {
      e.preventDefault();
      let currentChecked = 10;
      let options = document.getElementsByName("possible-answer");

      for (let i = 0; i < 5; i++) {
        if (options[i].checked === true) {
          currentChecked = i;
          options[i].checked = false;
        }
      }
      if (currentChecked === 4) {
        options[0].checked = true;
      } else {
        options[currentChecked + 1].checked = true;
      }
    }
  }

  /**
   * Sets up game play for the user's chosen difficulty level
   */
  function startGame(e) {
    clearGameOject();

    setGameUrl();

    document.getElementById("form-options").classList.add("hide");
    document.getElementById("submit").classList.add("hide");

    document
      .getElementsByClassName("question-zone")[0]
      .classList.remove("hide");

    createQuiz();
  }

  /**
   * clears data from game object at the start of a round of 12 questions
   */
  function clearGameOject() {
    game.qNumber = 0;
    game.pastIdNumbers = [];
    game.correctAnswers = 0;
    game.passedQuestions = 0;
    game.question.qText = [];
    game.question.correctAnswer = [];
    game.question.wrong1 = [];
    game.question.wrong2 = [];
    game.question.wrong3 = [];
    game.question.category = [];

    for (let i = 1; i < 12; i++) {
      game.question.correctAnswerId[i] = 100;
      game.question.userAnswerId[i] = 200;
    }
  }

  /**
   * sets game URL for API request based on user's desired difficulty level
   */
  function setGameUrl() {
    let levels = document.getElementsByName("difficulty");
    let difficultyLevel = 0;

    for (let i = 0; i < 3; i++) {
      if (levels[i].checked === true) {
        difficultyLevel = i;
      }
    }

    getTokenForGame();

    displayDifficulty(difficultyLevel);
    game.url = `${urlStart}${difficulty[difficultyLevel]}${urlEnd}&token=${game.sessionToken}`;
  }
  /**
   * Collects data from API call to Open Trivia Database
   */
  async function createQuiz() {
    document.getElementById("submit-answer").classList.remove("hide");
    document.getElementById("next-question").classList.add("hide");

    const response = await fetch(game.url);
    const result = await response.json();

    for (let i = 0; i < 12; i++) {
      game.question.qText[i] = result.results[i].question;
      game.question.correctAnswer[i] = result.results[i].correct_answer;
      game.question.wrong1[i] = result.results[i].incorrect_answers[0];
      game.question.wrong2[i] = result.results[i].incorrect_answers[1];
      game.question.wrong3[i] = result.results[i].incorrect_answers[2];
      game.question.category[i] = result.results[i].category;
    }

    if (result.response_code === 0) {
      console.log(`no errors for generating questions`);
    } else if (result.response_code === 3 || result.response_code === 4) {
      console.log("problem with token for game. Reset token");
      setGameUrl();
    } else {
      alert(
        `Response code is ${result.response_code} for generating question set`,
      );
    }

    displayQuestion();
  }
  /**
   * Displays question on the screen.
   * Each question has question number, category (hidden in the hint), question text and 4 possible options
   */
  function displayQuestion() {
    document.getElementById("question-number").innerText =
      `Question ${game.qNumber + 1}`;

    document.getElementById("question").innerHTML =
      `${game.question.qText[game.qNumber]}`;

    game.question.correctAnswerId[game.qNumber] = Math.floor(Math.random() * 4);

    let indexIncorrect = 0;
    let bulletId = "possible";

    for (let i = 0; i < 4; i++) {
      let tempId = `${bulletId}${i}`;
      if (i === game.question.correctAnswerId[game.qNumber]) {
        document.getElementById(tempId).innerHTML =
          game.question.correctAnswer[game.qNumber];
      } else if (indexIncorrect === 0) {
        document.getElementById(tempId).innerHTML =
          game.question.wrong1[game.qNumber];
        indexIncorrect = indexIncorrect + 1;
      } else if (indexIncorrect === 1) {
        document.getElementById(tempId).innerHTML =
          game.question.wrong2[game.qNumber];
        indexIncorrect = indexIncorrect + 1;
      } else if (indexIncorrect === 2) {
        document.getElementById(tempId).innerHTML =
          game.question.wrong3[game.qNumber];
        indexIncorrect = indexIncorrect + 1;
      } else {
        alert("there is an error assigning options for this question");
      }
    }
  }

  /**
   * Collects the answer which the user chooses.  Prevents user from selecting 'I don't know'.
   */
  function collectUserAnswer(e) {
    let options = document.getElementsByName("possible-answer");
    let userOption = 200;

    for (let i = 0; i < 4; i++) {
      if (options[i].checked === true) {
        userOption = i;
      }
    }

    if (userOption === 200) {
        document.getElementById("question-alert").innerHTML=`Take a guess at the answer!  You've got 25% chance of picking the correct one <i class="fa-regular fa-face-smile-wink"></i>`
        document.getElementById("question-alert").classList.remove("hide");
    //     alert(
    //     "Take a guess at the answer! You've got 25% chance of picking the correct one ;-)",
    //   );
    } else {
      document.getElementById("submit-answer").classList.add("hide");

      if(!document.getElementById("question-alert").classList.contains("hide")){
        document.getElementById("question-alert").classList.add("hide");
      }

      game.question.userAnswerId[game.qNumber] = userOption;

      displayFeedback();

      game.qNumber = game.qNumber + 1;

      if (game.qNumber === 12) {
        console.log("This is the final question!");
        document
          .getElementById("next-question")
          .addEventListener("click", (e) => endGame(e));
      } else {
        document
          .getElementById("next-question")
          .addEventListener("click", (e) => setNextQ(e));
      }
    }
  }

  /**
   * Shows the correct answer after each question
   */
  function displayFeedback() {
    document.getElementById("correct-answer-revealed").classList.remove("hide");
    document
      .getElementsByClassName("question-options")[0]
      .classList.add("hide");

    if (game.qNumber === 0) {
      document.getElementById("current-score-update").classList.remove("hide");
    }

    if (game.qNumber !== 12) {
      document.getElementById("next-question").classList.remove("hide");
    }

    let feedback = "";

    if (
      game.question.userAnswerId[game.qNumber] ===
      game.question.correctAnswerId[game.qNumber]
    ) {
      game.correctAnswers = game.correctAnswers + 1;
      feedback = `<i class="fa-regular fa-face-smile"></i> Well done!  You got the answer correct!  
        <span class="correct-answer">The answer is ${game.question.correctAnswer[game.qNumber]}</span>`;
    } else if (game.question.userAnswerId[game.qNumber] === 4) {
      feedback = `<span class="correct-answer">The answer is  ${game.question.correctAnswer[game.qNumber]}</span>
        <i class="fa-regular fa-face-smile-wink"></i> Why not take a guess at the answer next time?`;
      game.passedQuestions = game.passedQuestions + 1;
    } else {
      feedback = `<i class="fa-regular fa-face-frown"></i> Sorry, you picked the wrong answer!
        <span class="correct-answer">The correct answer was ${game.question.correctAnswer[game.qNumber]}</span>`;
    }

    document.getElementById("correct-answer-revealed").innerHTML = feedback;
    document.getElementById("current-score-update").innerHTML =
      `Current score is: ${game.correctAnswers}/${game.qNumber + 1}`;
  }

  /**
   * Resets all fields after a question has been answered and the user is ready to move to the next one
   */
  function setNextQ(e) {
    console.log("enters setNextQ");

    document.getElementById("submit-answer").classList.remove("hide");
    document.getElementById("next-question").classList.add("hide");
    document.getElementById("correct-answer-revealed").classList.add("hide");
    document
      .getElementsByClassName("question-options")[0]
      .classList.remove("hide");
    for (let i = 0; i < 5; i++) {
      document.getElementsByName("possible-answer")[i].checked = false;
    }
    document.getElementsByName("possible-answer")[4].checked = true;
    displayQuestion();
  }

  /**
   *Gives user overall score and feedback at the end of a round of 12 questions
   */
  function endGame(e) {
    document.getElementsByClassName("play-zone")[0].classList.add("hide");
    document.getElementById("end-game-feedback").classList.remove("hide");

    document.getElementById("final-score").innerHTML =
      ` Your final score was ${game.correctAnswers}/12.
                                    `;

    if (game.correctAnswers < 4) {
      document.getElementById("feedback-image").innerHTML =
        '<img src="./assets/images/loser.webp" alt="image of brain with wooden spoon, crying">';
      document.getElementById("feedback-comment").innerHTML =
        "Oh dear!  You could have done better by guess work alone!  Time to start knuckling down and studying to improve your general knowledge";
    } else if (game.correctAnswers >= 4 || game.correctAnswers < 7) {
      document.getElementById("feedback-image").innerHTML =
        '<img src="./assets/images/average.webp" alt="image of brain studying">';
      document.getElementById("feedback-comment").innerHTML =
        "Did you guess or did you know the answers?  Either way, room for improvement!";
    } else if (game.correctAnswers >= 7 || game.correctAnswers < 10) {
      document.getElementById("feedback-image").innerHTML =
        '<img src="./assets/images/above-average.webp" alt="image of brain with pile of books to read">';
      document.getElementById("feedback-comment").innerHTML =
        "You've definitely got talent!  Hit the books and you'll be a pro in no time!";
    } else {
      document.getElementById("feedback-image").innerHTML =
        '<img src="./assets/images/winner.webp" alt="image of brain with trophey, happy">';
      document.getElementById("feedback-comment").innerHTML =
        "Genius!!!  Enter the next pub quiz immediately and impress your friends!";
    }
  }

  /**
   * Allows user to reveal the instructions for playing the game at any time
   */

  function toggleInstructions(e) {
    var playInfo = document.getElementById("further-info");
    if (playInfo.classList.contains("hide")) {
      playInfo.classList.remove("hide");
    } else {
      playInfo.classList.add("hide");
    }
  }

  /**
   * Displays the user's choosen difficulty level at the top of each question
   */
  function displayDifficulty(difficultyLevel) {
    const starIcon = '<i class="fa-solid fa-star"></i>';

    if (difficultyLevel === 0) {
      difficultyLevel = `Easy ${starIcon}`;
      document.getElementById("display-game-level").innerHTML = difficultyLevel;
      document.getElementById("display-game-level").classList.add("easy");
    } else if (difficultyLevel === 1) {
      difficultyLevel = `Medium ${starIcon} ${starIcon}`;
      document.getElementById("display-game-level").innerHTML = difficultyLevel;
      document.getElementById("display-game-level").classList.add("medium");
    } else if (difficultyLevel === 2) {
      difficultyLevel = `Hard ${starIcon} ${starIcon} ${starIcon}`;
      document.getElementById("display-game-level").innerHTML = difficultyLevel;
      document.getElementById("display-game-level").classList.add("hard");
    } else {
      throw `Difficulty Level ${difficultyLevel} not known`;
    }
  }

  /**
   * Creates a game session specific token.  The token prevents the same question being asked twice in
   * the same session (provided sufficient questions in the database).
   * This functionality can be built on.  Currently new token for each round of 12 questions.  In future
   * could re-use the token in subsequent rounds.
   */
  async function getTokenForGame() {
    game.sessionToken = "";

    const tokenRequest = "https://opentdb.com/api_token.php?command=request";

    const response = await fetch(tokenRequest);
    const result = await response.json();

    if (result.response_code === 0) {
      console.log(
        `no errors for token request, response message was ${result.response_message}`,
      );
    } else {
      alert(
        `Response code is ${result.response_code} for token request, response message was ${result.response_message}`,
      );
    }

    game.sessionToken = result.token;
  }
  /**
   * displays the genre of the question to give the user a hint about the answer.
   */
  function displayHint(e) {
    if (
      !document
        .getElementsByClassName("question-options")[0]
        .classList.contains("hide")
    ) {
      if (document.getElementById("category").innerText === "Hint") {
        document.getElementById("category").innerHTML =
          `Question genre is ${game.question.category[game.qNumber]}`;
      } else {
        document.getElementById("category").innerHTML = `Hint`;
      }
    }
  }
});
