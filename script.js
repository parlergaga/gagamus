const motsGaga = [
    "abistrogné", "ablagé", "abouser", "aborgnon", "acanit", "accacasser", "accacassonner", "achattir", "adober", "affiner",
    "affortir", "agotailles", "ambignon", "anganche", "apeger", "apette", "appincher", "applater", "aquiger", "aragni",
    "arraper", "arpions", "artisons", "attraper", "achapeu", "babeau", "babet", "babielle", "bâchat",
    "badabet", "badabeu", "badinguet", "baille", "barjaquer", "bamborgne", "baraban", "baronter", "barreaux", "bartassaille",
    "basane", "batailler", "baveux", "bayayet", "bazeuil", "bazut", "beauseigne", "belet", "benaise", "benon", "berchu",
    "bichette", "biganche", "bitancher", "bitors", "bitognot", "bobiat", "boge", "bougnette", "boutasse", "brandigoler",
    "brave", "broger", "bugne", "cacasson", "cafi", "cafuron", "cagnas", "caisse", "camphrer", "canit", "carcameler",
    "catolle", "chanforgne", "cheneau", "chouiner", "coissou", "consulte", "corbicine", "coufle", "couratter", "crassier",
    "crezieu", "croire", "cuchon", "cuisse", "debarouler", "debeloise", "decubasser", "defiferlé", "degoiser",
    "degrener", "deguiller", "depenaillé", "deprofiter", "dîner", "ebarioles", "ebarliaudes", "ebouillé", "ebravager",
    "ecorpelé", "egrointer", "emaseler", "equevilles", "estanco", "entremi", "ensiauver", "faramelan", "fayard", "fenêtron",
    "fiarde", "fouilla", "fourme", "franc", "fricaude", "galapiat", "gambelle", "gambinotte", "gandou", "gandouze", "gapiand",
    "garagnas", "gâté", "gnaque", "gnaquer", "godiveau", "gôgne", "gouillat", "grabotter", "harte", "jarjille", "jabiasser",
    "jâcounasse", "jâcounasserie", "japille", "japiller", "jumelle", "jupi", "lancer", "lancieu", "lapider", "lavorger",
    "lermuse", "liqueter", "lourde", "luche", "mâchurer", "macle", "maneille", "mani", "manne", "manuchard", "marpailler",
    "matefaim", "matru", "mazanter", "miladzeu", "milapiat", "minater", "moulachique", "nioche", "oublier", "oussu",
    "ollagne", "pagnot", "paillat", "pampille", "patère", "pattemouille", "pège", "pegeat", "petafiner", "pialousse",
    "piat", "pichorgner", "pimpignole", "piquerle", "pitancher", "plaindre", "pranière", "pourette", "quillorches",
    "quillorcher", "quina", "quinarelle", "quiner", "quiniauder", "rabouret", "rachat", "rache", "racine", "raffeter",
    "racuit", "ragraton", "ramasilles", "ramasser", "râpée", "rapiat", "raptaret", "rave", "rédimer", "reiboit", "roupiane",
    "sabouillat", "sabouiller", "saccaraud", "sagouiller", "sarrasson", "satou", "sibère", "tabazut", "tateminette",
    "trempe", "vogue", "viron"
];

// Normalise les mots pour la grille (supprime espaces, tirets, apostrophes)
function normalizeWord(word) {
    return word.replace(/[\s'-]/g, '').toLowerCase();
}

function getDailyWord() {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) hash = (hash * 31 + today.charCodeAt(i)) % motsGaga.length;
    return { original: motsGaga[hash], normalized: normalizeWord(motsGaga[hash]) };
}

function getLastWord() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let hash = 0;
    const yesterdayStr = yesterday.toDateString();
    for (let i = 0; i < yesterdayStr.length; i++) hash = (hash * 31 + yesterdayStr.charCodeAt(i)) % motsGaga.length;
    return { original: motsGaga[hash], normalized: normalizeWord(motsGaga[hash]) };
}

let motATrouver = getDailyWord();
let essaisRestants = 6;
let essaiActuel = 0;
let currentPosition = 1;
let essais = [];

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

const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const replayBtn = document.getElementById("replay-btn");
const shareBtn = document.getElementById("share-btn");

function initGrid() {
    grid.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < motATrouver.normalized.length; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (i < essais.length) {
                cell.textContent = essais[i][j].toUpperCase();
                cell.classList.add(essais[i][j] === motATrouver.normalized[j] ? "correct" : motATrouver.normalized.includes(essais[i][j]) ? "misplaced" : "wrong");
            } else if (i === essaiActuel && j === 0) cell.textContent = motATrouver.normalized[0].toUpperCase();
            if (i === essaiActuel && j === currentPosition && essaisRestants > 0) cell.classList.add("active");
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
}

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
    backspace.addEventListener("click", removeLetter);
    keyboard.appendChild(backspace);
    const enter = document.createElement("div");
    enter.className = "key";
    enter.textContent = "↵";
    enter.addEventListener("click", submitGuess);
    keyboard.appendChild(enter);
}

function addLetter(letter) {
    if (!canPlay()) return;
    const rows = document.querySelectorAll(".row");
    const cells = rows[essaiActuel].querySelectorAll(".cell");
    const key = Array.from(document.querySelectorAll(".key")).find(k => k.textContent === letter);
    if (currentPosition < motATrouver.normalized.length) {
        cells[currentPosition].textContent = letter.toUpperCase();
        cells[currentPosition].classList.remove("active");
        key.classList.add("bounce");
        setTimeout(() => key.classList.remove("bounce"), 300);
        currentPosition++;
        if (currentPosition < motATrouver.normalized.length) cells[currentPosition].classList.add("active");
    }
}

function removeLetter() {
    if (!canPlay() || currentPosition <= 1) return;
    const rows = document.querySelectorAll(".row");
    const cells = rows[essaiActuel].querySelectorAll(".cell");
    currentPosition--;
    cells[currentPosition].textContent = "";
    cells[currentPosition].classList.add("active");
    if (currentPosition + 1 < motATrouver.normalized.length) cells[currentPosition + 1].classList.remove("active");
}

function generateShareText() {
    let text = `Gagamus ${6 - essaisRestants}/6\n`;
    essais.forEach(guess => {
        let line = "";
        for (let i = 0; i < guess.length; i++) line += guess[i] === motATrouver.normalized[i] ? "🟩" : motATrouver.normalized.includes(guess[i]) ? "🟨" : "⬜";
        text += line + "\n";
    });
    return text.trim();
}

function submitGuess() {
    if (!canPlay()) {
        message.textContent = "T’as fini tes 6 essais aujourd’hui, reviens demain !";
        return;
    }
    const rows = document.querySelectorAll(".row");
    const cells = rows[essaiActuel].querySelectorAll(".cell");
    const keys = document.querySelectorAll(".key");
    let guess = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join("");
    if (guess.length !== motATrouver.normalized.length) {
        message.textContent = `Faut ${motATrouver.normalized.length} lettres, t’es à côté, pela !`;
        rows[essaiActuel].classList.add("shake");
        setTimeout(() => rows[essaiActuel].classList.remove("shake"), 500);
        return;
    }
    essais.push(guess);
    essaisRestants--;
    updateDailyEssais();
    cells.forEach((cell, i) => {
        cell.classList.add("flip");
        setTimeout(() => {
            const key = Array.from(keys).find(k => k.textContent === guess[i]);
            if (guess[i] === motATrouver.normalized[i]) {
                cell.classList.add("correct");
                if (key) key.classList.add("used", "correct");
            } else if (motATrouver.normalized.includes(guess[i])) {
                cell.classList.add("misplaced");
                if (key && !key.classList.contains("correct")) key.classList.add("used", "misplaced");
            } else {
                cell.classList.add("wrong");
                if (key && !key.classList.contains("correct") && !key.classList.contains("misplaced")) key.classList.add("used", "wrong");
            }
            cell.classList.remove("active", "flip");
        }, i * 100 + 500);
    });
    essaiActuel++;
    currentPosition = 1;
    if (guess === motATrouver.normalized) {
        setTimeout(() => {
            const essaisUtilises = 6 - essaisRestants;
            message.textContent = `Beau gosse ! '${motATrouver.original}' en ${essaisUtilises} essais ! (Restants : ${MAX_ESSAIS_JOUR - getDailyEssais()})`;
            endGame();
        }, motATrouver.normalized.length * 100 + 500);
    } else if (essaisRestants === 0) {
        setTimeout(() => {
            message.textContent = `Tintin ! C’était '${motATrouver.original}'. (Restants : ${MAX_ESSAIS_JOUR - getDailyEssais()})`;
            endGame();
        }, motATrouver.normalized.length * 100 + 500);
    } else {
        setTimeout(() => {
            message.textContent = `(Restants : ${MAX_ESSAIS_JOUR - getDailyEssais()})`;
            initGrid();
        }, motATrouver.normalized.length * 100 + 500);
    }
}

function initGame() {
    motATrouver = getDailyWord();
    essaisRestants = 6;
    essaiActuel = 0;
    currentPosition = 1;
    essais = [];
    initGrid();
    initKeyboard();
    message.textContent = canPlay() ? 
        `Mot gaga de ${motATrouver.normalized.length} lettres, ça commence par '${motATrouver.normalized[0]}', vas-y ! (Restants : ${MAX_ESSAIS_JOUR - getDailyEssais()})` : 
        "T’as fini tes 6 essais aujourd’hui, reviens demain !";
    replayBtn.style.display = "none";
    shareBtn.style.display = "none";
    document.getElementById("last-word").textContent = `Mot d’hier : ${getLastWord().original}`;
}

function endGame() {
    replayBtn.style.display = "inline-block";
    shareBtn.style.display = "inline-block";
    document.removeEventListener("keydown", handleKeyPress);
}

function shareResult() {
    const text = generateShareText();
    navigator.clipboard.writeText(text).then(() => alert("Résultat copié !")).catch(() => alert("Erreur :\n" + text));
}

function replayGame() {
    initGame();
    document.addEventListener("keydown", handleKeyPress);
}

function handleKeyPress(event) {
    if (!canPlay()) return;
    const key = event.key.toLowerCase();
    if (/^[a-z]$/.test(key)) addLetter(key);
    else if (key === "backspace") removeLetter();
    else if (key === "enter") submitGuess();
}

replayBtn.addEventListener("click", replayGame);
shareBtn.addEventListener("click", shareResult);
window.onload = () => {
    initGame();
    document.addEventListener("keydown", handleKeyPress);
};