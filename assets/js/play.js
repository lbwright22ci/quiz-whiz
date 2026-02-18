document.addEventListener("DOMContentLoaded", function(){   
    const urlStart="https://opentdb.com/api.php?amount=12&difficulty=";
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
    document.getElementById("category").addEventListener('click', e => displayHint());
    document.addEventListener("keydown", e => enterKey(e));

function enterKey(e){
    if(e.key ==="Enter"){
        e.preventDefault();
        if(document.getElementsByClassName("question-zone")[0].classList.contains("hide")){
            startGame(e);
        }else if(!document.getElementById("submit-answer").classList.contains("hide") && document.getElementById("next-question").classList.contains("hide")){
            collectUserAnswer(e);
        }else if(document.getElementById("submit-answer").classList.contains("hide") && !document.getElementById("next-question").classList.contains("hide") && game.qNumber <1){
            setNextQ(e);
        }else if(document.getElementById("submit-answer").classList.contains("hide") && !document.getElementById("next-question").classList.contains("hide") && game.qNumber===1){
            endGame(e);
        }
        }else if(!document.getElementsByClassName("question-options")[0].classList.contains("hide") && e.key ==="ArrowUp"){
            e.preventDefault();
            let currentChecked = 10;
            let options=document.getElementsByName("possible-answer");

            for(let i=0; i<5; i++){
                if(options[i].checked===true){
                    currentChecked = i;
                    options[i].checked= false;
                }
            }

            if(currentChecked ===0){
                options[4].checked = true;
            }else{
                options[(currentChecked-1)].checked=true;
            }
            console.log(currentChecked);

        }else if(!document.getElementsByClassName("question-options")[0].classList.contains("hide") && e.key ==="ArrowDown"){
            e.preventDefault();
            let currentChecked = 10;
            let options=document.getElementsByName("possible-answer");

            for(let i=0; i<5; i++){
                if(options[i].checked===true){
                    currentChecked = i;
                    options[i].checked= false;
                }
            }
            if(currentChecked ===4){
                options[0].checked = true;
            }else{
                options[(currentChecked+1)].checked=true;
            }
        }

}

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
    game.passedQuestions=0;
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

    document.getElementById("question-number").innerText = `Question ${game.qNumber+1}`;

    document.getElementById("question").innerHTML= `${game.question.qText[(game.qNumber)]}`;
    

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

    let options = document.getElementsByName("possible-answer");
        let userOption =200;

       for (let i=0; i<4; i++){
        
        if(options[i].checked ===true){
            userOption = i;
        }
    }

    if(userOption===200){
        alert("Take a guess at the answer! You've got 25% chance of picking the correct one ;-)");
    }else{
    document.getElementById("submit-answer").classList.add("hide");
        game.question.userAnswerId[game.qNumber] = userOption;
    console.log(userOption);

    displayFeedback();

        game.qNumber = game.qNumber+1;

    if(game.qNumber ===1){
        alert("end game");
        document.getElementById("next-question").addEventListener("click", e => endGame(e));
    }else{
        document.getElementById("next-question").addEventListener("click", e => setNextQ(e));
    }
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

    }else if(game.question.userAnswerId[game.qNumber] ===4){
        feedback =`<span class="correct-answer">The answer is  ${game.question.correctAnswer[game.qNumber]}</span>
        <i class="fa-regular fa-face-smile-wink"></i> Why not take a guess at the answer next time?`;
        game.passedQuestions = game.passedQuestions+1;
    }else{
        feedback=`<i class="fa-regular fa-face-frown"></i> Sorry, you picked the wrong answer!
        <span class="correct-answer">The correct answer was ${game.question.correctAnswer[game.qNumber]}</span>`;
    }
    
    console.log(`${game.qNumber} the feedback is ${feedback}`);

    document.getElementById("correct-answer-revealed").innerHTML = feedback;
    document.getElementById("current-score-update").innerHTML = `Current score is: ${game.correctAnswers}/${game.qNumber+1}`;

   //     document.getElementById("next-question").addEventListener("click", e => setNextQ(e));
}

function setNextQ(e){
    console.log("enters setNextQ");
    
        document.getElementById("submit-answer").classList.remove("hide");
        document.getElementById("next-question").classList.add("hide");
        document.getElementById("correct-answer-revealed").classList.add("hide");
        document.getElementsByClassName("question-options")[0].classList.remove("hide");
        for(let i=0; i<5; i++){
            document.getElementsByName("possible-answer")[i].checked=false;
            }
            document.getElementsByName("possible-answer")[4].checked=true;
        displayQuestion();
        }

function endGame(e){
    document.getElementsByClassName("play-zone")[0].classList.add("hide");
    document.getElementById("end-game-feedback").classList.remove("hide");

    document.getElementById("final-score").innerHTML=` Your final score was ${game.correctAnswers}/12.
                                    `;

    if(game.correctAnswers <4){
        document.getElementById("feedback-image").innerHTML='<img src="./assets/images/loser.webp" alt="image of brain with wooden spoon, crying">';
        document.getElementById("feedback-comment").innerHTML='Oh dear!  You could have done better by guess work alone!  Time to start knuckling down and studying to improve your general knowledge';
    }else if(game.correctAnswers>=4 || game.correctAnswers <7){
        document.getElementById("feedback-image").innerHTML='<img src="./assets/img/.." alt="image of brain studying">';
        document.getElementById("feedback-comment").innerHTML='Did you guess or did you know the answers?  Either way, room for improvement!';
    }else if(game.correctAnswers>=7 || game.correctAnswers <10){
        document.getElementById("feedback-image").innerHTML='<img src="./assets/img/.." alt="image of brain with pile of books to read">';
        document.getElementById("feedback-comment").innerHTML="You've definitely got talent!  Hit the books and you'll be a pro in no time!";
    }else{
        document.getElementById("feedback-image").innerHTML='<img src="./assets/images/winner.webp" alt="image of brain with trophey, happy">';
        document.getElementById("feedback-comment").innerHTML='Genius!!!  Enter the next pub quiz immediately and impress your friends!';
    }
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

function displayHint(e){
    if(!document.getElementsByClassName("question-options")[0].classList.contains("hide")){
        if(document.getElementById("category").innerText==="Hint"){
        document.getElementById("category").innerHTML= `Question genre is ${game.question.category[(game.qNumber)]}`;
    }else{
        document.getElementById("category").innerHTML= `Hint`;
    }
}

}
});