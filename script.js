const motsGaga = [
    "abistrogné", "ablagé", "abouser", "aborgnon", "acanit", "accacasser", "accacassonner", "achattir", "adober", "affiner",
    "affortir", "agotailles", "ambignon", "anganche", "apeger", "apette", "appincher", "applater", "aquiger", "aragni",
    "arraper", "arrosser", "arpions", "artisons", "attraper", "achapeu", "bâ", "babeau", "babet", "babielle", "bâchat",
    "badabet", "badabeu", "badinguet", "baille", "bajafle", "bajafler", "bajasser", "bamborgne", "baraban", "barailler",
    "baronter", "barouelle", "baroulade", "barreaux", "bartassaille", "basane", "batailler", "baveux", "bayayet", "bazeuil",
    "bazut", "beauseigne", "belet", "benaise", "benon", "berchu", "bichette", "biganche", "bitancher", "bitors", "bitognot",
    "bobiat", "boge", "bougnette", "bouillou", "boutasse", "bouyou", "brandigoler", "brave", "broger", "bugne", "cacasson",
    "cafi", "cafuron", "cagnas", "caille", "caillon", "caisse", "camphrer", "canit", "canou", "carcameler", "carotterouge",
    "carpette", "catolle", "chanforgne", "cheneau", "chouiner", "claque-dent", "clincaille", "clinquaille", "coissou",
    "consulte", "corbicine", "coufle", "couratter", "coursiere", "cramaillat", "cramiaud", "cramiauter", "crassier",
    "crezieu", "croire", "cuchon", "cuisse", "debarouler", "debeloise", "debigoiser", "debringué", "decubasser", "defiferlé",
    "degobiller", "degoiser", "degrener", "deguiller", "depenaillé", "deprofiter", "desfois", "dîner", "ebarioles",
    "ebarliaudes", "ebouillé", "ebravager", "ebravagé", "ecorpelé", "egrointer", "emaseler", "encaqué", "equevilles",
    "evanlé", "faramelan", "fayard", "fenêtron", "fermer", "fiarde", "flique", "fouilla", "fourme", "franc", "fricaude",
    "gabelou", "galandage", "galapiat", "gambelle", "gambinotte", "gandou", "gandouze", "gapiand", "garagna", "gâté",
    "gnaque", "gnaquer", "godiveau", "gôgne", "gorgeon", "gouillat", "grabotter", "harte", "jarjille", "jabiasser",
    "jâcounasse", "jâcounasserie", "jambe-d'airelle", "jambe-d'herse", "japille", "japiller", "jumelle", "jean-ma-mere", "jupi",
    "lancer", "lancieu", "lapider", "lapide-chretien", "lavorger", "lermuse", "lierche", "liquer", "liqueter", "lourde",
    "luche", "luches", "mâchurer", "manchonner", "mâcle", "malûche", "maneille", "mani", "manne", "manuchard", "marpailler",
    "matefaim", "matru", "mazanter", "mener", "mieux", "miladzeu", "milapiat", "minater", "moments", "moulachique",
    "nioche", "oublier", "oussu", "ollagne", "pagnot", "paillat", "pampille", "patère", "pattemouille", "pège", "pegeat",
    "peger", "petafiner", "pialousse", "piat", "pichorgner", "pimpignole", "piquerle", "pitanche", "pitancher", "plaindre",
    "plat-au-four", "pourette", "quillorches", "quillorcher", "quina", "quinarelle", "quiner", "quiniauder", "rabouret",
    "rachat", "rache", "racine", "raffeter", "racuit", "ragraton", "ramasilles", "ramasser", "râpée", "rapiat", "raptaret",
    "rave", "rédimer", "reiboit", "roupiane", "sabouillat", "sabouiller", "saccaraud", "sagouiller", "sale", "sampiller",
    "sarrasson", "satou", "sibère", "vogue"
];

function getDailyWord() {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) hash = (hash * 31 + today.charCodeAt(i)) % motsGaga.length;
    return motsGaga[hash];
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
        for (let j = 0; j < motATrouver.length; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (i < essais.length) {
                cell.textContent = essais[i][j].toUpperCase();
                cell.classList.add(essais[i][j] === motATrouver[j] ? "correct" : motATrouver.includes(essais[i][j]) ? "misplaced" : "wrong");
            } else if (i === essaiActuel && j === 0) cell.textContent = motATrouver[0].toUpperCase();
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

function addLetter(letter) {
    if (!canPlay()) return;
    const rows = document.querySelectorAll(".row");
    const cells = rows[essaiActuel].querySelectorAll(".cell");
    const key = Array.from(document.querySelectorAll(".key")).find(k => k.textContent === letter);
    if (currentPosition < motATrouver.length) {
        cells[currentPosition].textContent = letter.toUpperCase();
        cells[currentPosition].classList.remove("active");
        key.classList.add("bounce");
        setTimeout(() => key.classList.remove("bounce"), 300);
        currentPosition++;
        if (currentPosition < motATrouver.length) cells[currentPosition].classList.add("active");
    }
}

function removeLetter() {
    if (!canPlay() || currentPosition <= 1) return;
    const rows = document.querySelectorAll(".row");
    const cells = rows[essaiActuel].querySelectorAll(".cell");
    currentPosition--;
    cells[currentPosition].textContent = "";
    cells[currentPosition].classList.add("active");
    if (currentPosition + 1 < motATrouver.length) cells[currentPosition + 1].classList.remove("active");
}

function generateShareText() {
    let text = `Gagamus ${6 - essaisRestants}/6\n`;
    essais.forEach(guess => {
        let line = "";
        for (let i = 0; i < guess.length; i++) line += guess[i] === motATrouver[i] ? "🟩" : motATrouver.includes(guess[i]) ? "🟨" : "⬜";
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
    if (guess.length !== motATrouver.length) {
        message.textContent = `Faut ${motATrouver.length} lettres, t’es à côté, pela !`;
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
            if (guess[i] === motATrouver[i]) {
                cell.classList.add("correct");
                if (key) key.classList.add("used", "correct");
            } else if (motATrouver.includes(guess[i])) {
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
    if (guess === motATrouver) {
        setTimeout(() => {
            const essaisUtilises = 6 - essaisRestants;
            message.textContent = `Beau gosse ! '${motATrouver}' en ${essaisUtilises} essais ! (Restants : ${MAX_ESSAIS_JOUR - getDailyEssais()})`;
            endGame();
        }, motATrouver.length * 100 + 500);
    } else if (essaisRestants === 0) {
        setTimeout(() => {
            message.textContent = `Tintin ! C’était '${motATrouver}'. (Restants : ${MAX_ESSAIS_JOUR - getDailyEssais()})`;
            endGame();
        }, motATrouver.length * 100 + 500);
    } else {
        setTimeout(() => {
            message.textContent = `(Restants : ${MAX_ESSAIS_JOUR - getDailyEssais()})`;
            initGrid();
        }, motATrouver.length * 100 + 500);
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
        `Mot gaga de ${motATrouver.length} lettres, ça commence par '${motATrouver[0]}', vas-y ! (Restants : ${MAX_ESSAIS_JOUR - getDailyEssais()})` : 
        "T’as fini tes 6 essais aujourd’hui, reviens demain !";
    replayBtn.style.display = "none";
    shareBtn.style.display = "none";
}

function endGame() {
    replayBtn.style.display = "block";
    shareBtn.style.display = "block";
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