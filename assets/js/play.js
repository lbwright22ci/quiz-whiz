document.addEventListener("DOMContentLoaded", function(){   
    const urlStart="https://opentdb.com/api.php?amount=1&category=9&difficulty=";
    const urlEnd="&type=multiple";
    const difficulty=["easy", "medium", "hard"];

    // add in a game object here
    let game={
        qNumber:0,
        correctAnswers:0,
        sessionToken:"",
        passedQuestions:0,
        url:"",
    };

    let question={
        possibleAnswers:[],
        correctAnswer:"",
        correctAnswerId:100,
        userAnswerId:200,
    };

    document.getElementById("submit").addEventListener("click", e => startGame(e));
    document.getElementById("info").addEventListener("click", e => toggleInstructions(e));


function startGame(e){

    clearGameOject();

    let gameUrl = setGameUrl();

    document.getElementById("form-options").style.display = "none";
    document.getElementById("submit").style.display= "none";
    document.getElementsByClassName("question-zone")[0].style.display="block";
    document.getElementById("next-question").style.display="none";

   // while(game.qNumber<13){
        createQuestion(gameUrl);
        collectUserAnswer();
        displayFeedback();
        // qNumber +=1;
    //}
}

function toggleInstructions(e){
    var playInfo = document.getElementById("further-info");
    if(playInfo.style.display ==="none"){
        playInfo.style.display = "block";
    }else{
        playInfo.style.display = "none";
    }
}

function clearGameOject(){
    game.qNumber=0;
    game.pastIdNumbers=[];
    game.correctAnswers=0;
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
   // console.log(game.sessionToken);
    displayDifficulty(difficultyLevel);
    game.url = `${urlStart}${difficulty[difficultyLevel]}${urlEnd}&token=${game.sessionToken}`;
 //   console.log(gameUrl);
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

async function createQuestion(){
    clearQuestion();
    document.getElementById("submit-answer").style.display="block";
    document.getElementById("next-question").style.display="none";

    const response = await fetch(game.url);
    const result = await response.json();

    console.log(result.results[0].question);
    console.log(result.results[0].incorrect_answers);
    game.qNumber =game.qNumber + 1;

    if(result.response_code ===0){
        console.log(`no errors for generating question ${game.qNumber}`);
    }else if(result.response_code ===3 || result.response_code ===4){
        console.log('problen with token for game. Reset token');
        setGameUrl();
    }else{
        alert(`Response code is ${result.response_code} for generating question ${game.qNumber}`);
    }

    displayQuestion(result);
}


function clearQuestion(){
    question.qText="";
    question.possibleAnswers=[];
    question.correctAnswer="";
    question.correctAnswerId=100;
    question.category="";
    question.userAnswerId=200;
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

//    console.log(`Game token is ${result.token} in get token for game function`);
    game.sessionToken= result.token;

}

function displayQuestion(result){
    document.getElementById("question-number").innerText = game.qNumber;
    document.getElementById("question").innerHTML= result.results[0].question;
    document.getElementById("category").innerHTML = result.results[0].category; 

    question.correctAnswerId = Math.floor(Math.random()*4);
    question.correctAnswer = result.results[0].correct_answer;

    let indexIncorrect =0;
    let bulletId="possible";

    for(let i=0; i<4; i++){
        if(i===question.correctAnswerId){
            question.possibleAnswers[i]= result.results[0].correct_answer;

        }else{
            question.possibleAnswers[i]=result.results[0].incorrect_answers[indexIncorrect];
            indexIncorrect= indexIncorrect+1;
        }
        let tempId = `${bulletId}${i}`;
        document.getElementById(tempId).innerHTML = question.possibleAnswers[i]; 
    }

//    console.log(question.possibleAnswers);
//    console.log(question.possibleAnswers[question.correctAnswerId]);
//    console.log(result.results[0].correct_answer);

}

function collectUserAnswer(){
    document.getElementById("submit-answer").addEventListener("click", e =>{

        let options = document.getElementsByName("possible-answer");
        let userOption =100;

       for (let i=0; i<3; i++){
        if(options[i].checked ===true){
            userOption = i;
        }

        question.userAnswerId = userOption;
    }
    document.getElementById("submit-answer").style.display="none";
    document.getElementsByClassName("question-options").style.display="none";
    displayFeedback();
    if(game.qNumber!==12){
        document.getElementById("next-question").style.display="block";
    }
})



}

function displayFeedback(){
    document.getElementById("correct-answer-revealed").style.display="block";
    let feedback="";
    if(question.userAnswerId === question.correctAnswerId){
        feedback = `Well done!  You got the answer correct!  
        The answer is ${question.correctAnswer}`;
        game.correctAnswers= game.correctAnswers+1;
    }else if(question.userAnswerId ===200){
        feedback =`You should have taken a guess at the answer!  The answer is  ${question.correctAnswer}`;
        game.passedQuestions = game.passedQuestions+1;
    }else{
        feedback=`Sorry, you picked the wrong answer!
        You selected ${question.possibleAnswers[question.userAnswerId]} but the answer was ${question.correctAnswer}`;
    }
    document.getElementById("correct-answer-revealed").innerHTML = feedback;

    if(game.qNumber ===12){
        alert("end game");
    }else{
        createQuestion();
    }

}

});