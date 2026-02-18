document.addEventListener("DOMContentLoaded", function () {
  const urlRandom = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";
  const urlToday="https://uselessfacts.jsph.pl/api/v2/facts/today?language=en";
  const urlJoke="https://v2.jokeapi.dev/joke/Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart";

  document
    .getElementById("generate-random")
    .addEventListener("click", (e) => getRandomFact(e));
  document
    .getElementById("reveal-punchline")
    .addEventListener("click", (e) => jokePunchLine(e));
  document

async function todaysFact(){
  const response = await fetch(urlToday);
  const result = await response.json();

  document.getElementById("todays-fact").innerHTML= result.text;

  //need to add in error check

}

todaysFact();

async function getJoke(){
  const response = await fetch(urlJoke);
  const result = await response.json();

  document.getElementById("joke-start").innerText= result.setup;

  //need to add in error check
}

  async function getRandomFact(e) {
    document.getElementById("random-fact").classList.remove("hide");

    const response = await fetch(urlRandom);
    const result = await response.json();

    document.getElementById("random-fact").innerText = result.text;

    //need to add in error check
  }
});