document.addEventListener("DOMContentLoaded", function(){   
    // const API_KEY_easy=;
    // const API_KEY_medium=;
    // const API_KEY_difficult=; 

    // add in a game object here

    document.getElementById("submit").addEventListener("click", e => startGame(e));
    document.getElementById("info").addEventListener("click", e => toggleInstructions(e));


});

async function startGame(e){
    const form = new FormData(document.getElementById("select-difficulty"));
}

function toggleInstructions(e){
    var playInfo = document.getElementById("further-info");
    if(playInfo.style.display ==="none"){
        playInfo.style.display = "block";
    }else{
        playInfo.style.display = "none";
    }
}
