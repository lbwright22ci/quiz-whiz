document.addEventListener("DOMContentLoaded", function(){   
    const urlStart="https://opentdb.com/api.php?amount=12&category=9&difficulty=";
    const urlEnd="&type=multiple";
    const difficulty=["easy", "medium", "hard"];

    // add in a game object here
    let game={
        qNumber:0,
        correctAnswers:0,
        sessionToken:"",
        passedQuestions:0,
        url:"",
        question:{
            qText:[],
            wrong1:[],
            wrong2:[],
            wrong3:[],
            correctAnswer:[],
            category:[],
            correctAnswerId:[],
            userAnswerId:[],
        },
    };

    document.getElementById("submit").addEventListener("click", e => startGame(e));
    document.getElementById("info").addEventListener("click", e => toggleInstructions(e));
    document.getElementById("submit-answer").addEventListener("click", event => collectUserAnswer(event));


function startGame(e){

    clearGameOject();

    setGameUrl();

    document.getElementById("form-options").classList.add("hide");
    document.getElementById("submit").classList.add("hide");

    document.getElementsByClassName("question-zone")[0].classList.remove("hide");

        createQuiz();
        //displayOverallResults();
}


function clearGameOject(){
    game.qNumber=0;
    game.pastIdNumbers=[];
    game.correctAnswers=0;
    game.question.qText=[];
    game.question.correctAnswer=[];
    game.question.wrong1=[];
    game.question.wrong2=[];
    game.question.wrong3=[];
    game.question.category=[];

    for(let i=1; i<12; i++){
        game.question.correctAnswerId[i]= 100;
        game.question.userAnswerId[i]=200;
    }
}

function setGameUrl(){

    let levels = document.getElementsByName("difficulty");
    let difficultyLevel =0;

    for (let i=0; i<3; i++){
        if(levels[i].checked ===true){
            difficultyLevel = i;
        }
    }

    getTokenForGame();

    displayDifficulty(difficultyLevel);
    game.url = `${urlStart}${difficulty[difficultyLevel]}${urlEnd}&token=${game.sessionToken}`;

}

async function createQuiz(){

    document.getElementById("submit-answer").classList.remove("hide");
    document.getElementById("next-question").classList.add("hide");

    const response = await fetch(game.url);
    const result = await response.json();

    for(let i=0; i<12; i++){
        game.question.qText[i]= result.results[i].question;
        game.question.correctAnswer[i]=result.results[i].correct_answer;
        game.question.wrong1[i]=result.results[i].incorrect_answers[0];
        game.question.wrong2[i]=result.results[i].incorrect_answers[1];
        game.question.wrong3[i]=result.results[i].incorrect_answers[2];
        game.question.category[i] = result.results[i].category;
    }

    if(result.response_code ===0){
        console.log(`no errors for generating questions`);
    }else if(result.response_code ===3 || result.response_code ===4){
        console.log('problem with token for game. Reset token');
        setGameUrl();
    }else{
        alert(`Response code is ${result.response_code} for generating question set`);
    }

    displayQuestion();

}

function displayQuestion(){

    document.getElementById("question-number").innerText = `${game.qNumber+1}`;

    document.getElementById("question").innerHTML= game.question.qText[(game.qNumber)];
    document.getElementById("category").innerHTML = game.question.category[(game.qNumber)];

    game.question.correctAnswerId[(game.qNumber)] = Math.floor(Math.random()*4);

    let indexIncorrect =0;
    let bulletId="possible";

    for(let i=0; i<4; i++){
        let tempId = `${bulletId}${i}`;
        if(i===game.question.correctAnswerId[(game.qNumber)]){
            document.getElementById(tempId).innerHTML = game.question.correctAnswer[game.qNumber]; 
        }else if(indexIncorrect === 0){
            document.getElementById(tempId).innerHTML = game.question.wrong1[game.qNumber];
            indexIncorrect = indexIncorrect +1;
        }else if(indexIncorrect === 1){
            document.getElementById(tempId).innerHTML = game.question.wrong2[game.qNumber];
            indexIncorrect = indexIncorrect +1;
        }else if(indexIncorrect === 2){
            document.getElementById(tempId).innerHTML = game.question.wrong3[game.qNumber];
            indexIncorrect = indexIncorrect +1;
        }else{
            alert("there is an error assigning options for this question");
        }
        }

}

function collectUserAnswer(e){

    document.getElementById("submit-answer").classList.add("hide");
    
    let options = document.getElementsByName("possible-answer");
        let userOption =100;

       for (let i=0; i<4; i++){
        
        if(options[i].checked ===true){
            userOption = i;
        }
    }
    game.question.userAnswerId[game.qNumber] = userOption;

    displayFeedback();

        game.qNumber = game.qNumber+1;

    if(game.qNumber ===12){
        alert("end game");
    }else{
        document.getElementById("next-question").addEventListener("click", e => setNextQ(e));
    }

}

function displayFeedback(){

    document.getElementById("correct-answer-revealed").classList.remove("hide");
    document.getElementsByClassName("question-options")[0].classList.add("hide");

    if(game.qNumber===0){
        document.getElementById("current-score-update").classList.remove("hide");
    }

    if(game.qNumber!==12){
        document.getElementById("next-question").classList.remove("hide");
    }

    let feedback="";

    
    if(game.question.userAnswerId[game.qNumber] === game.question.correctAnswerId[game.qNumber]){
        game.correctAnswers= game.correctAnswers+1;
        feedback = `<i class="fa-regular fa-face-smile"></i> Well done!  You got the answer correct!  
        <span class="correct-answer">The answer is ${game.question.correctAnswer[game.qNumber]}</span>`;

    }else if(game.question.userAnswerId[game.qNumber] ===200){
        feedback =`You should have taken a guess at the answer!  
        <span class="correct-answer">The answer is  ${game.question.correctAnswer[game.qNumber]}</span>`;
        game.passedQuestions = game.passedQuestions+1;
    }else{
        feedback=`<i class="fa-regular fa-face-frown"></i> Sorry, you picked the wrong answer!
        <span class="correct-answer">The correct answer was ${game.question.correctAnswer[game.qNumber]}</span>`;
    }
    
    console.log(`${game.qNumber} the feedback is ${feedback}`);

    document.getElementById("correct-answer-revealed").innerHTML = feedback;
    document.getElementById("current-score-update").innerHTML = `Current score is: ${game.correctAnswers}/ ${game.qNumber+1}`;

   //     document.getElementById("next-question").addEventListener("click", e => setNextQ(e));
}

function setNextQ(e){
    console.log("enters setNextQ");
    
        document.getElementById("submit-answer").classList.remove("hide");
        document.getElementById("next-question").classList.add("hide");
        document.getElementById("correct-answer-revealed").classList.add("hide");
        document.getElementsByClassName("question-options")[0].classList.remove("hide");
        for(let i=0; i<4; i++){
            document.getElementsByName("possible-answer")[i].checked=false;
            }
        displayQuestion();
        }

function toggleInstructions(e){
    var playInfo = document.getElementById("further-info");
    if(playInfo.classList.contains("hide")){
        playInfo.classList.remove("hide");
    }else{
        playInfo.classList.add("hide");
    }
}

function displayDifficulty(difficultyLevel){
    const starIcon='<i class="fa-solid fa-star"></i>';

    if(difficultyLevel===0){
        difficultyLevel=`Easy ${starIcon}`;
        document.getElementById("display-game-level").innerHTML= difficultyLevel;
        document.getElementById("display-game-level").classList.add("easy");
    }else if(difficultyLevel===1){
        difficultyLevel=`Medium ${starIcon} ${starIcon}`;
        document.getElementById("display-game-level").innerHTML= difficultyLevel;
        document.getElementById("display-game-level").classList.add("medium");
    }else if(difficultyLevel===2){
        difficultyLevel=`Hard ${starIcon} ${starIcon} ${starIcon}`;
        document.getElementById("display-game-level").innerHTML= difficultyLevel;
        document.getElementById("display-game-level").classList.add("hard");
    }else{
        throw(`Difficulty Level ${difficultyLevel} not known`);
    }
}


async function getTokenForGame(){

    game.sessionToken ="";

    const tokenRequest="https://opentdb.com/api_token.php?command=request";

    const response = await fetch(tokenRequest);
    const result = await response.json();
    
    if(result.response_code ===0){
        console.log(`no errors for token request, response message was ${result.response_message}`);
    }else{
        alert(`Response code is ${result.response_code} for token request, response message was ${result.response_message}`);
    }

    game.sessionToken= result.token;

}


});