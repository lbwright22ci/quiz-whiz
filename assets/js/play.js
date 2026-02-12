document.addEventListener("DOMContentLoaded", function(){   
    const API_URL='https://quizmania-api.p.rapidapi.com/trivia-by-difficulty?difficulty=';
    const difficulty=["easy", "medium", "difficult"];
    // const URL_medium= 'https://quizmania-api.p.rapidapi.com/trivia-by-difficulty?difficulty=medium';
    // const URL_difficult='https://quizmania-api.p.rapidapi.com/trivia-by-difficulty?difficulty=difficult'; 

    // const apiKey ="cc512b1b45msh8fd6c5c28a9e6c9p1554b0jsn16ca0f94870"
    // const host ="quizmania-api.p.rapidapi.com";

    // add in a game object here

    document.getElementById("submit").addEventListener("click", e => startGame(e));
    document.getElementById("info").addEventListener("click", e => toggleInstructions(e));


});

function startGame(e){
    let gameUrl = setGameUrl();

    document.getElementById("form-options").style.display = "none";
    document.getElementById("submit").style.display= "none";
    document.getElementsByClassName("question-zone")[0].style.display="block";
}

function toggleInstructions(e){
    var playInfo = document.getElementById("further-info");
    if(playInfo.style.display ==="none"){
        playInfo.style.display = "block";
    }else{
        playInfo.style.display = "none";
    }
}

function setGameUrl(){
    const API_URL='https://quizmania-api.p.rapidapi.com/trivia-by-difficulty?difficulty=';
    const difficulty=["easy", "medium", "difficult"];
    let levels = document.getElementsByName("difficulty");
    let difficultyLevel =0;

    for (let i=0; i<3; i++){
        if(levels[i].checked ===true){
            difficultyLevel = i;
        }
    }
    displayDifficulty(difficultyLevel);
    let gameUrl = `${API_URL}${difficulty[difficultyLevel]}`;
    console.log(gameUrl);
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