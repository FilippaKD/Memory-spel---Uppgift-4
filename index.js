
let memoryCards; //Korten både fram och baksida

let firstCard, secondCard; // Första kortet som väljs och andra kortet

let hasClickedCard = false; // Kontroll för om ett kort är klickat eller ej

let lockCard = false; // Kontroll för om ett kort kan flippa eller ej

let startTime;

let timerInterval;

let activeGame;

let resultDialog;

let firstcard;

let secondcard;

function init() {


    let startBtn = document.querySelector("#startBtn");
    startBtn.addEventListener("click", startGame);

    let endBtn = document.querySelector("#endBtn");
    endBtn.disabled = true;


    endBtn.addEventListener("click", function () {

        endTimer();
        resetCards();
        disableAllCards();
        startBtn.disabled = false;
        endBtn.disabled = true;
        gameActive = false;
    });


    memoryCards = document.querySelectorAll(".memoryCard");

    for (let i = 0; i < memoryCards.length; i++) {
        memoryCards[i].disabled = true;
    }




    resultDialog = document.querySelector("#resultPage");

    timerInterval = null;
    activeGame = false;

}

window.addEventListener("load", init);


// Startar spelet, aktiverar asvluta knappen, blandar korten, startar timern och aktiverar alla kort
function startGame() {

    startBtn.disabled = true;

    enableAllCards();


    let shuffle = new Audio("sound/shuffle.mp3");
    shuffle.play();


    endBtn.disabled = false;

    shuffleCards();

    timerBox = document.querySelector("#timerbox");
    timerBox.style.visibility = "visible";


    let now = new Date()
    startTime = now.getTime();
    timerInterval = setInterval(updateTimer, 100);


    activeGame = true;
}

//Updaterar timern på webbsidan
function updateTimer() {
    let now = new Date();
    let currentTime = now.getTime();
    let elapsedTime = currentTime - startTime;
    let formattedTime = formatTime(elapsedTime);

    document.querySelector("#timer").textContent = `${formattedTime}`;


}

//Formaterar om tiden från millisekunder till sekunder eller minuter 
function formatTime(time) {
    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(seconds / 60);

    // Lägg till en nolla för sekunder om de är ensiffriga
    seconds = seconds % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${seconds}.`;
}

// Kollar klicken på korten, om det är det första sparas det om det är det andra kontrollerar den om dem matchar
function clickedCard() {

    if (lockCard) return; // Om lockCard är true avslutas funktionen diekt

    this.classList.add('flip');

    let flip = new Audio("sound/flippedcard.mp3");

    if (!hasClickedCard) {
        hasClickedCard = true;
        firstCard = this;
        flip.play();
        return;
    } else {
        secondCard = this;
        hasClickedCard = false;
        flip.play();
        checkMatch()
        hasClickedCard = false;
    }

    if (this == firstCard) return;
}

// Kontrollerar om två kort matchar utifrån dess alt namn
function checkMatch() {

    let twoCardsMatch = getCardName(firstCard) === getCardName(secondCard);

    console.log("First Card: ", getCardName(firstCard));
    console.log("Second Card: ", getCardName(secondCard));

    if (twoCardsMatch) {
        console.log("Match!");
        disableCards();
    } else {
        console.log("No match!");
        nonMatch();
    }

}

// Få fram alt namnen på bilderna till korten
function getCardName(card) {
    return card.querySelector(".cardFront").getAttribute("alt");

}

// Inaktiverar de två matchande korten
function disableCards() {

    firstCard.removeEventListener("click", clickedCard);

    secondCard.removeEventListener("click", clickedCard);

    if (document.querySelectorAll(".flip").length == memoryCards.length) {
        endGame()
    }

}

// Vänder tillbaka på korten om de ej matchar
function nonMatch() {

    lockCard = true;

    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        lockCard = false;
        resetBoard()
    }, 500);
}

// Återställer relevanta variabler
function resetBoard() {
    [hasClickedCard, lockCard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Återställer och vänder alla kort
function resetCards() {
    for (let i = 0; i < memoryCards.length; i++) {
        memoryCards[i].classList.remove('flip');
        memoryCards[i].addEventListener("click", clickedCard);
    }
}

// Avslutar spelet, visar tiden i en dialogruta
function endGame() {

    startBtn.disabled = false;


    let now = new Date()
    let endTime = now.getTime();
    let elapsedTime = endTime - startTime;
    let seconds = Math.floor(elapsedTime / 1000);

    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;


    let resultText = "Din tid blev ";

    if (minutes > 0) {
        resultText += `${minutes} minut${minutes > 1 ? "er" : ""} och `;
    }

    if (seconds > 0) {
        resultText += `${seconds} sekund${seconds > 1 ? "er" : ""}`;
    }

    resultText += ".";

    let result = document.querySelector("#result");
    result.innerHTML = resultText;

    resultDialog.showModal();

    clearInterval(timerInterval);
    isGameActive = false;

    resetCards();
    clearInterval(timerInterval);

    let restartBtn = document.querySelector("#restartBtn");
    restartBtn.addEventListener("click", function () {
        resultDialog.close();
        startGame();
    });

    let closeBtn = document.querySelector("#closeBtn");
    closeBtn.addEventListener("click", function () {
        resultDialog.close();
        disableAllCards();
        endTimer()
        init();
    });

}


// Inaktiverar alla kort
function disableAllCards() {
    for (let i = 0; i < memoryCards.length; i++) {
        memoryCards[i].removeEventListener("click", clickedCard);
    }
}

//Aktiverar alla kort
function enableAllCards() {
    for (let i = 0; i < memoryCards.length; i++) {
        memoryCards[i].addEventListener("click", clickedCard);
    }
}

//Blandar korten
function shuffleCards() {
    for (let i = 0; i < memoryCards.length; i++) {
        let randomCards = Math.floor(Math.random() * 12);
        memoryCards[i].style.order = randomCards;
        memoryCards[i].classList.remove('flip');
        memoryCards[i].addEventListener("click", clickedCard);
        memoryCards[i].disabled = false;
    }
}

// Tar bort timern
function endTimer() {
    clearInterval(timerInterval);
    timerBox.style.visibility = "hidden";
}
