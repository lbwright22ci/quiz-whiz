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

/**
 * function calls Useless facts API to collect and display the fact of the day when the page loads
 */
async function todaysFact(){
  const response = await fetch(urlToday);
  const result = await response.json();

  document.getElementById("todays-fact").innerHTML= result.text;

  //api does not have an error message specifically associated with the API call.

}

todaysFact();

/**
 * function calls jokeapi API to generate a random joke (pun, two line joke, clean humour)
 * when the page loads. Populates the joke object
 */
async function getJoke(){
  resetJoke();
  const response = await fetch(urlJoke);
  const result = await response.json();
  joke.question = result.setup;
  joke.punchLine = result.delivery;

  document.getElementById("joke-start").innerText= joke.question;

  if(joke.error){
    throw("error in generating the joke on page loading");
  }
}

getJoke();

/**
 * Function resets joke object so that a new joke can be generated
 */
function resetJoke(){
  joke.question="";
  joke.punchLine="";
}

/**
 * Function calls Useless Facts API to generate a random fact. This fact is displayed when
 * user presses button on the page
 */
  async function getRandomFact(e) {

    document.getElementById("random-fact").classList.remove("hide");
    document.getElementById("fact-placeholder").classList.add("col-12", "justify-content-center");

    const response = await fetch(urlRandom);
    const result = await response.json();

    document.getElementById("random-fact").innerText = result.text;
    document.getElementById("generate-random").innerText ="New fact!";
    //api does not have an error message specifically associated with the API call.
  }

  /**
   * Function displays the joke punchline and allows the user to generate a new joke
   */
  function jokePunchLine(e){
    document.getElementById("punchline-text").innerText = joke.punchLine;
    document.getElementById("punch-line").classList.remove("hide");
    document.getElementById("reveal-punchline").classList.add("hide");
    document.getElementById("next-joke").addEventListener("click", e => newJoke(e));
  }

  /**
   * Generates a new joke on user's request
   */
  function newJoke(e){
    document.getElementById("punch-line").classList.add("hide");
    document.getElementById("reveal-punchline").classList.remove("hide");
    getJoke();
  }

});