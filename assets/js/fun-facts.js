document.addEventListener("DOMContentLoaded", function () {
  const urlRandom = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";
  const urlToday="https://uselessfacts.jsph.pl/api/v2/facts/today?language=en";
  const urlJoke="https://v2.jokeapi.dev/joke/Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart";

  let joke={
    question:"",
    punchLine:"",
  };

  document
    .getElementById("generate-random")
    .addEventListener("click", (e) => getRandomFact(e));
  document
    .getElementById("reveal-punchline")
    .addEventListener("click", (e) => jokePunchLine(e));


async function todaysFact(){
  const response = await fetch(urlToday);
  const result = await response.json();

  document.getElementById("todays-fact").innerHTML= result.text;

  //need to add in error check

}

todaysFact();

async function getJoke(){
  resetJoke();
  const response = await fetch(urlJoke);
  const result = await response.json();
  joke.question = result.setup;
  joke.punchLine = result.delivery;

  document.getElementById("joke-start").innerText= joke.question;

  //need to add in error check
}

getJoke();

function resetJoke(){
  joke.question="";
  joke.punchLine="";
}

  async function getRandomFact(e) {
    document.getElementById("random-fact").classList.remove("hide");

    const response = await fetch(urlRandom);
    const result = await response.json();

    document.getElementById("random-fact").innerText = result.text;

    //need to add in error check
  }

  function jokePunchLine(e){
    document.getElementById("punchline-text").innerText = joke.punchLine;
    document.getElementById("punch-line").classList.remove("hide");
    document.getElementById("reveal-punchline").classList.add("hide");
    document.getElementById("next-joke").addEventListener("click", e => newJoke(e));
  }

  function newJoke(e){
    document.getElementById("punch-line").classList.add("hide");
    document.getElementById("reveal-punchline").classList.remove("hide");
    getJoke();
  }

});