// Liste complète des mots en parler gaga
const motsGaga = [
    "abistrogné", "ablagé", "abouser", "aborgnon", "acanit", "accacasser", "accacassonner", "achattir", "adober", "affiner",
    "affortir", "agotailles", "ambignon", "anganche", "apeger", "apette", "appincher", "applater", "aquiger", "aragni",
    "arraper", "arrosser", "arpions", "artisons", "attraper", "achapeu",
    "bâ", "babeau", "babet", "babielle", "bâchat", "badabet", "badabeu", "badinguet", "baille", "bajafle", "bajafler",
    "bajasser", "bamborgne", "baraban", "barailler", "baronter", "barouelle", "baroulade", "barreaux", "bartassaille",
    "basane", "batailler", "baveux", "bayayet", "bazeuil", "bazut", "beauseigne", "belet", "benaise", "benon", "berchu",
    "bichette", "biganche", "bitancher", "bitors", "bitognot", "bobiat", "boge", "bougnette", "bouillou", "boutasse",
    "bouyou", "brandigoler", "brave", "broger", "bugne", "cacasson", "cafi", "cafuron", "cagnas", "caille", "caillon",
    "caisse", "camphrer", "canit", "canou", "carcameler", "carotterouge", "carpette", "catolle", "chanforgne", "cheneau",
    "chouiner", "claquedent", "clincaille", "clinquaille", "coissou", "consulte", "corbicine", "coufle", "couratter",
    "coursiere", "cramaillat", "cramiaud", "cramiauter", "crassier", "crezieu", "croire", "cuchon", "cuisse",
    "debarouler", "debeloise", "debigoiser", "debringué", "decubasser", "defiferlé", "degobiller", "degoiser", "degrener",
    "deguiller", "depenaillé", "deprofiter", "desfois", "dîner",
    "ebarioles", "ebarliaudes", "ebouillé", "ebravager", "ebravagé", "ecorpelé", "egrointer", "emaseler", "encaqué",
    "equevilles", "evanlé",
    "faramelan", "fayard", "fenêtron", "fermer", "fiarde", "flique", "fouilla", "fourme", "franc", "fricaude",
    "gabelou", "galandage", "galapiat", "gambelle", "gambinotte", "gandou", "gandouze", "gapiand", "garagna", "gâté",
    "gnaque", "gnaquer", "godiveau", "gôgne", "gorgeon", "gouillat", "grabotter",
    "harte",
    "jarjille", "jabiasser", "jâcounasse", "jâcounasserie", "jambedairelle", "jambedherse", "japille", "japiller",
    "jumelle", "jeanmamere", "jupi",
    "lancer", "lancieu", "lapider", "lapidechretien", "lavorger", "lermuse", "lierche", "liquer", "liqueter",
    "lourde", "luche", "luches",
    "mâchurer", "manchonner", "mâcle", "malûche", "maneille", "mani", "manne", "manuchard", "marpailler", "matefaim",
    "mâtru", "mazanter", "mener", "mieux", "miladzeu", "milapiat", "minater", "moments", "moulachique",
    "nioche",
    "oublier", "oussu", "ollagne",
    "pagnot", "paillat", "pampille", "patère", "pattemouille", "pège", "pegeat", "peger", "petafiner",
    "pialousse", "piat", "pichorgner", "pimpignole", "piquerle", "pitanche", "pitancher", "plaindre", "plataufour",
    "pourette",
    "quillorches", "quillorcher", "quina", "quinarelle", "quiner", "quiniauder",
    "rabouret", "rachat", "rache", "racine", "raffeter", "racuit", "ragraton", "ramasilles", "ramasser", "râpée",
    "rapiat", "raptaret", "rave", "rédimer", "reiboit", "roupiane",
    "sabouillat", "sabouiller", "saccaraud", "sagouiller", "sale", "sampiller", "sarrasson", "satou",
    "sibère",
    "vogue"
];

// Fonction pour choisir un mot unique par jour
function getDailyWord() {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = (hash * 31 + today.charCodeAt(i)) % motsGaga.length;
    }
    return motsGaga[hash];
}

let motATrouver = getDailyWord();
let essaisRestants = 6;
let essaiActuel = 0;
let currentPosition = 1;
let essais = [];

// Gestion des essais quotidiens
const MAX_ESSAIS_JOUR = 6;
const storageKey = "gagamusEssais";
const dateKey = "gagamusDate";

function getDailyEssais() {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(dateKey);
    const storedEssais = parseInt(localStorage.getItem(storageKey)) || 0;

    if (storedDate !== today) {
        localStorage.setItem(dateKey, today);
        localStorage.setItem(storageKey, "0");
        return 0;
    }
    return storedEssais;
}

function updateDailyEssais() {
    const essais = getDailyEssais() + 1;
    localStorage.setItem(storageKey, essais.toString());
    return essais;
}

function canPlay() {
    return getDailyEssais() < MAX_ESSAIS_JOUR && essaisRestants > 0;
}

// Éléments du DOM
const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const replayBtn = document.getElementById("replay-btn");
const shareBtn = document.getElementById("share-btn");

// Initialiser la grille (6 lignes) avec les essais précédents
function initGrid() {
    grid.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < motATrouver.length; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (i < essais.length) {
                cell.textContent = essais[i][j].toUpperCase();
                if (essais[i][j] === motATrouver[j]) {
                    cell.classList.add("correct");
                } else if (motATrouver.includes(essais[i][j])) {
                    cell.classList.add("misplaced");
                } else {
                    cell.classList.add("wrong");
                }
            } else if (i === essaiActuel && j === 0) {
                cell.textContent = motATrouver[0].toUpperCase();
            }
            if (i === essaiActuel && j === currentPosition && essaisRestants > 0) {
                cell.classList.add("active");
            }
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
}

// Initialiser le clavier virtuel
function initKeyboard() {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    keyboard.innerHTML = "";
    letters.forEach(letter => {
        const key = document.createElement("div");
        key.className = "key";
        key.textContent = letter;
        key.addEventListener("click", () => addLetter(letter));
        keyboard.appendChild(key);
    });
    const backspace = document.createElement("div");
    backspace.className = "key";
    backspace.textContent = "⌫";
    backspace.style.width = "60px";
    backspace.addEventListener("click", removeLetter);
    keyboard.appendChild(backspace);
    const enter = document.createElement("div");
    enter.className = "key";
    enter.textContent = "↵";
    enter.style.width = "60px";
    enter.addEventListener("click", submitGuess);
    keyboard.appendChild(enter);
}

// Ajouter une lettre à la grille avec animation "bounce"
function addLetter(letter) {
    if (!canPlay()) return;
    const rows = document.querySelectorAll(".row");
    const currentRow = rows[essaiActuel];
    const cells = currentRow.querySelectorAll(".cell");
    const key = Array.from(document.querySelectorAll(".key")).find(k => k.textContent === letter);

    if (currentPosition < motATrouver.length) {
        cells[currentPosition].textContent = letter.toUpperCase();
        cells[currentPosition].classList.remove("active");
        key.classList.add("bounce");
        setTimeout(() => key.classList.remove("bounce"), 300); // Retirer après 0.3s
        currentPosition++;
        if (currentPosition < motATrouver.length) {
            cells[currentPosition].classList.add("active");
        }
    }
}

// Supprimer une lettre de la grille
function removeLetter() {
    if (!canPlay()) return;
    const rows = document.querySelectorAll(".row");
    const currentRow = rows[essaiActuel];
    const cells = currentRow.querySelectorAll(".cell");

    if (currentPosition > 1) {
        currentPosition--;
        cells[currentPosition].textContent = "";
        cells[currentPosition].classList.add("active");
        if (currentPosition + 1 < motATrouver.length) {
            cells[currentPosition + 1].classList.remove("active");
        }
    }
}

// Générer le texte de partage
function generateShareText() {
    let shareText = `Gagamus ${6 - essaisRestants}/6\n`;
    essais.forEach(guess => {
        let line = "";
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === motATrouver[i]) {
                line += "🟩";
            } else if (motATrouver.includes(guess[i])) {
                line += "🟨";
            } else {
                line += "⬜";
            }
        }
        shareText += line + "\n";
    });
    return shareText.trim();
}

// Valider l’essai avec animations "flip" et "shake"
function submitGuess() {
    if (!canPlay()) {
        message.textContent = "T’as fait tes 6 essais pour aujourd’hui sur Gagamus, reviens demain !";
        return;
    }

    const rows = document.querySelectorAll(".row");
    const currentRow = rows[essaiActuel];
    const cells = currentRow.querySelectorAll(".cell");
    const keys = document.querySelectorAll(".key");

    let guess = "";
    cells.forEach(cell => guess += cell.textContent.toLowerCase());

    if (guess.length !== motATrouver.length) {
        message.textContent = `Faut ${motATrouver.length} lettres pour Gagamus, t’es dans la gouilla, pela !`;
        currentRow.classList.add("shake");
        setTimeout(() => currentRow.classList.remove("shake"), 500); // Retirer après 0.5s
        return;
    }

    essais.push(guess);
    essaisRestants--;
    updateDailyEssais();

    cells.forEach((cell, index) => {
        cell.classList.add("flip");
        setTimeout(() => {
            if (guess[index] === motATrouver[index]) {
                cell.classList.add("correct");
            } else if (motATrouver.includes(guess[index])) {
                cell.classList.add("misplaced");
            } else {
                cell.classList.add("wrong");
            }
            cell.classList.remove("active", "flip");
        }, index * 100 + 500); // Délai progressif pour chaque cellule
    });

    essaiActuel++;
    currentPosition = 1;

    if (guess === motATrouver) {
        setTimeout(() => {
            message.textContent = `T’es beause ! '${motATrouver}' en ${6 - essaisRestants} essais sur Gagamus ! (Essais restants aujourd’hui : ${MAX_ESSAIS_JOUR - getDailyEssais()})`;
            endGame();
        }, motATrouver.length * 100 + 500);
    } else if (essaisRestants === 0) {
        setTimeout(() => {
            message.textContent = `T’as fait tintin sur Gagamus ! C’était '${motATrouver}'. (Essais restants aujourd’hui : ${MAX_ESSAIS_JOUR - getDailyEssais()})`;
            endGame();
        }, motATrouver.length * 100 + 500);
    } else {
        setTimeout(() => {
            message.textContent = `(Essais restants aujourd’hui : ${MAX_ESSAIS_JOUR - getDailyEssais()})`;
            initGrid();
        }, motATrouver.length * 100 + 500);
    }
}

// Initialiser le jeu
function initGame() {
    motATrouver = getDailyWord();
    essaisRestants = 6;
    essaiActuel = 0;
    currentPosition = 1;
    essais = [];
    initGrid();
    initKeyboard();

    if (!canPlay()) {
        message.textContent = "T’as fait tes 6 essais pour aujourd’hui sur Gagamus, reviens demain !";
        replayBtn.style.display = "none";
    } else {
        message.textContent = `Un mot gaga de ${motATrouver.length} lettres pour Gagamus, ça commence par '${motATrouver[0]}', vas-y ! (Essais restants aujourd’hui : ${MAX_ESSAIS_JOUR - getDailyEssais()})`;
        replayBtn.style.display = "none";
    }
    shareBtn.style.display = "none";
}

// Fin de partie
function endGame() {
    replayBtn.style.display = "block";
    shareBtn.style.display = "block";
    document.removeEventListener("keydown", handleKeyPress);
}

// Partager les résultats
function shareResult() {
    const shareText = generateShareText();
    navigator.clipboard.writeText(shareText).then(() => {
        alert("Résultat copié dans le presse-papiers ! Colle-le où tu veux.");
    }).catch(() => {
        alert("Erreur lors de la copie. Voici ton résultat :\n" + shareText);
    });
}

// Rejouer (seulement possible le lendemain)
function replayGame() {
    initGame();
    document.addEventListener("keydown", handleKeyPress);
}

// Gestion des touches physiques
function handleKeyPress(event) {
    if (!canPlay()) return;

    const key = event.key.toLowerCase();
    if (/^[a-z]$/.test(key)) {
        addLetter(key);
    } else if (key === "backspace") {
        removeLetter();
    } else if (key === "enter") {
        submitGuess();
    }
}

// Événements
replayBtn.addEventListener("click", replayGame);
shareBtn.addEventListener("click", shareResult);
window.onload = function() {
    initGame();
    document.addEventListener("keydown", handleKeyPress);
};