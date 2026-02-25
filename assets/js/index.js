document.addEventListener("DOMContentLoaded", function(){
    
    const detailedReason=["Each quiz consists of 12 randomly generated questions.","A quiz for everyone from beginner to mastermind","Learn new facts to improve your general knowledge"];
    let reasons = document.getElementsByClassName("reasons-images");

    for (let j=0; j<3; j++){
        reasons[j].addEventListener("click", function(){
            reasons[j].removeAttribute("id");
            reasons[j].classList.add("reasons-extra");
            reasons[j].innerText = detailedReason[j];
            setTimeout( () =>{     
                reasons[j].setAttribute("id", "reason-"+(j+1));
                reasons[j].classList.remove("reasons-extra");
                reasons[j].innerText="";
            }, 4000);
        });
        reasons[j].addEventListener("mouseenter",function(){
            reasons[j].removeAttribute("id");
            reasons[j].classList.add("reasons-extra");
            reasons[j].innerText = detailedReason[j];
            setTimeout( () =>{     
                reasons[j].setAttribute("id", "reason-"+(j+1));
                reasons[j].classList.remove("reasons-extra");
                reasons[j].innerText="";
            }, 4000);
        });
    }
});

