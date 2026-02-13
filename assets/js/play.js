document.addEventListener("DOMContentLoaded", function(){   
    const urlStart="https://opentdb.com/api.php?amount=1&difficulty=";
    const urlEnd="&type=multiple";
    const difficulty=["easy", "medium", "hard"];

    // add in a game object here
    let game={
        qNumber:0,
        correctAnswers:0,
        sessionToken:"",
    };

    let question={
        qText:"",
        possibleAnswers:[],
        correctAnswer:"",
        correctAnswerId:100,
        category:"",
    };

    document.getElementById("submit").addEventListener("click", e => startGame(e));
    document.getElementById("info").addEventListener("click", e => toggleInstructions(e));


function startGame(e){

    clearGameOject();

    let gameUrl = setGameUrl();

    document.getElementById("form-options").style.display = "none";
    document.getElementById("submit").style.display= "none";
    document.getElementsByClassName("question-zone")[0].style.display="block";

   // while(game.qNumber<13){
        createQuestion(gameUrl);
        // displayQuestion();
        // checkAnswer();
        // displayFeedback();
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
    console.log(game.sessionToken);
    displayDifficulty(difficultyLevel);
    let gameUrl = `${urlStart}${difficulty[difficultyLevel]}${urlEnd}&token=${game.sessionToken}`;
 //   console.log(gameUrl);
    return gameUrl;
}

function displayDifficulty(difficultyLevel){
    const starIcon='<i class="fa-solid fa-star"></i>';
    let displayIcon;
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

async function createQuestion(gameUrl){
    clearQuestion();

    const response = await fetch(gameUrl);
    const result = await response.json();

    console.log(result.response_code);
    game.qNumber =game.qNumber + 1;

    if(result.response_code ===0){
        console.log(`no errors for generating question ${game.qNumber}`);
    }else{
        alert(`Response code is ${result.response_code} for generating question ${game.qNumber}`);
    }
}


function clearQuestion(){
    question.qText="";
    question.possibleAnswers=[];
    question.correctAnswer="";
    question.correctAnswerId=100;
    question.category="";
}

async function getTokenForGame(){
    const tokenRequest="https://opentdb.com/api_token.php?command=request";

    const response = await fetch(tokenRequest);
    const result = await response.json();
    
    if(result.response_code ===0){
        console.log(`no errors for token request, response message was ${result.response_message}`);
    }else{
        alert(`Response code is ${result.response_code} for token request, response message was ${result.response_message}`);
    }

    console.log(`Game token is ${result.token} in get token for game function`);
    game.sessionToken= result.token;

}

});