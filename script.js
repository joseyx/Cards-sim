var dealerSum = 0;
var playerSum = 0;

var dealerAceCont = 0;
var playerAceCont = 0;

var hidden;
var deck;

const disabled = document.getElementById("hit");

var canHit = true; // si el jugador tiene menos de 21 puntos puede pedir cartas

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); /* obtendra un numero entre 0 y 1 
        y lo multiplicara por 52, dando un numero entre 0 y 51.9999 */

        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    // console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCont += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    
    while (dealerSum < 17) { // si el dealer tiene menos de 17 puntos se le agrega otra carta
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCont += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    // console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        playerSum += getValue(card);
        playerAceCont += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
    }
    // console.log(playerSum);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}

function hit() {
    if (!canHit) {
        return;
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    playerSum += getValue(card);
    playerAceCont += checkAce(card);
    document.getElementById("player-cards").append(cardImg);

    if (reduceAce(playerSum, playerAceCont) > 21) { // cuenta los A como un 1 de ser necesario
        canHit = false;
    }
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCont);
    playerSum = reduceAce(playerSum, playerAceCont);

    canHit = false;
    document.getElementById("hidden").src = "./cards/"+ hidden + ".png";

    let mensaje = "";

    if (playerSum > 21) {
        mensaje = "Has perdido :(";
    }
    else if (dealerSum > 21) {
        mensaje = "Has ganado :)";
    }
    else if (playerSum == dealerSum) {
        mensaje = "Han empatado :o";
    }
    else if (playerSum > dealerSum) {
        mensaje = "Has ganado :)";
    }
    else if (playerSum < dealerSum) {
        mensaje = "Has perdido :(";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("results").innerText = mensaje;
}

function getValue(card) {
    let data = card.split("-"); // 4-C pase a ser [4, C]
    let value = data[0];

    if (isNaN(value)) { // si no es un numero, A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1
    }
    return 0;
}

function reduceAce(playerSum, playerAceCont) {
    while (playerSum > 21 && playerAceCont > 0) {
        playerSum -= 10;
        playerAceCont -= 1;
    }
    return playerSum;
}