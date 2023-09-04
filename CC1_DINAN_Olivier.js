"use strict";


const $startBtn = document.getElementById("start-btn");
const $guessBtn = document.getElementById("guess-btn");
const $cowBtn = document.getElementById("cow-btn");
const $output = document.getElementById("output");
const $numUsr = document.getElementById("num-usr");
const $maxUsr = document.getElementById("max-usr");

// définir le mode de fonctionnement de la vache + style du boutonn
let $vacher = false;
const style = document.createElement("style");
style.innerText = `
.green {
  background-color: green;
}
.cow {
  transform: translate(-50%, -50%);
  animation: rotateCow 4s linear infinite;
}
@keyframes rotateCow {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}`;
document.querySelector("head").appendChild(style);


// définir le nombre secret + nombre de tentative
let secretNumber = 0;
let maxGuesses = 0;
let remainingGuesses = 0;

// Afficher message
function showMessage(message) {
  const li = document.createElement("li");
  li.style.listStyleType = "none"; // Ajoute le style CSS à l'élément li
  li.textContent = message;
  $output.appendChild(li);
}

// Fonction Lancer le jeu
function launchGame() {
  // Suppression des messages dans la balise code
  while ($output.firstChild) {
    $output.removeChild($output.firstChild);
  }
  // nombre valide
  if (!$maxUsr.value) {
    showMessage(`Erreur: Veuillez entrer un nombre valide.`);
    return;
  }
  // Génération du nombre secret + essais restants
  secretNumber = Math.floor(Math.random() * $maxUsr.value) + 1;
  maxGuesses = Math.ceil(Math.log($maxUsr.value) / Math.log(2)) + 1;
  remainingGuesses = maxGuesses;

  // valeur de saisie initialisée a 0
  $numUsr.value = "0";

  $maxUsr.disabled = true
  $numUsr.disabled = false;
  $guessBtn.disabled = false;
  $startBtn.disabled = true;

  showMessage(`Devinez un nombre entre 1 et ${$maxUsr.value}. Vous avez ${remainingGuesses} essais.`);
}
function checkGuess() {
  const guess = parseInt($numUsr.value);

  // Verifier si c'est un chiffre
  if (isNaN(guess) || guess < 1 || guess > $maxUsr.value) {
    showMessage(`Veuillez saisir un nombre valide entre 1 et ${$maxUsr.value}.`);
    return;
  }

  // nbre de tentative - 1 si le chiffre est valide
  remainingGuesses--;
  // si le nombre correspond au nombre secret, victoire
  if (guess == secretNumber) {
    showMessage(`Bravo ! Vous avez trouvé le nombre ${secretNumber} en ${maxGuesses - remainingGuesses} essai(s).`);
    $numUsr.disabled = true;
    $maxUsr.disabled = false
    $guessBtn.disabled = true;
    $startBtn.disabled = false;
    $numUsr.value = "";
  // si le nombre de tentative = 0, perdu
  } else if (remainingGuesses === 0) {
    showMessage(`Désolé, vous avez épuisé tous vos essais. Le nombre secret était ${secretNumber}.`);
    $numUsr.disabled = true;
    $maxUsr.disabled = false
    $guessBtn.disabled = true;
    $startBtn.disabled = false;
    $numUsr.value = "";
  // Indice si le chiffre est trop haut/bas
  } else if (guess < secretNumber) {
    showMessage(`Chiffre trop bas. Il vous reste ${remainingGuesses} essai(s).`);
  } else {
    showMessage(`Chiffre trop haut. Il vous reste ${remainingGuesses} essai(s).`);
  }
}


// Deviner le nombre secret (compatible avec la touche entrée)
$guessBtn.addEventListener("click", checkGuess);
$numUsr.onkeydown = function (event) {
  if (event.key === "Enter") {
    checkGuess()
  }
}

// Commence le jeu devine le nombre secret
$startBtn.addEventListener("click", launchGame);
$maxUsr.onkeydown = function (event) {
  if (event.key === "Enter") {
    launchGame()
  }
}

function addCow(evt) {
  // TODO : compléter ici
  const cowImage = document.createElement("img");
  cowImage.src = "https://upload.wikimedia.org/wikipedia/commons/3/30/Cowicon.svg";
  cowImage.classList.add("cow");

  // Position de la vache au clic de la souris
  cowImage.style.left = `${evt.x + window.scrollX }px`;
  cowImage.style.top = `${evt.y + window.scrollY }px`;

  // Rotation random de la vache
  const randomRotation = Math.floor(Math.random() * 360);
  cowImage.style.transform = `rotate(${randomRotation}deg)`;

  // Ajout de la vache dans la balise code
  document.body.appendChild(cowImage);
}

// Exécution de la vache quand bouton vacher/dévacher cliqué
$cowBtn.addEventListener("click", function () {
  if ($vacher) {
    document.onmousedown = null;
    $vacher = false;
  } else {
    document.onmousedown = addCow;
    $vacher = true;
  }
  // ajout du style vert pour distinguer cacher et dévacher
  this.classList.toggle('green')
});

