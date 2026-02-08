/* ========= PAGE 1 ========= */

function submitDay() {
    const text = document.getElementById("dayInput").value.trim();
    if (!text) {
        alert("Type something first 😄");
        return;
    }
    document.getElementById("smilePopup").classList.remove("hidden");
}

function smiledYes() {
    document.getElementById("popupContent").innerHTML = `
        <p>
            That means today should feel happy and fulfilled,<br>
            because you smiled.<br><br>
            Now it’s not just a normal day —
            it’s a special one on the calendar 😌✨
        </p>
        <button onclick="goMap()">➡ Next</button>
    `;
}

function smiledNo() {
    document.getElementById("popupContent").innerHTML = `
        <p>
            That’s okay 🌷<br>
            Some days don’t smile first.<br>
            Maybe the next page will give you a reason 😏
        </p>
        <button onclick="goMap()">➡ Next</button>
    `;
}

function goMap() {
    window.location.href = "map.html";
}

/* ========= PAGE 2 ========= */

let currentTreasure = 0;

const answers = {
    1: "nandhu",
    2: "nandhu ki football jersey shoes yedhi aduguthey adi konistha",
    3: "never"
};

const questions = {
    1: "who is yourrrr bestesttesttt frndddd ??? (hint open chey)!!",
    2: "Nandhu ki text chesi aduguu direct ",
    3: "eppudu ina marchipothava nanuuu"
};

const hints = {
    1: "naaa peruuu chepakapothey narikestthaa",
    2: "hint em ledhu nandhuuu kitext chesi adugu",
    3: "narkuthaaa marchipothey!!!"
};

let roses = 0;

function openTreasure(num) {
    if (num !== currentTreasure + 1) {
        alert("Finish the previous treasure first 😏");
        return;
    }

    currentTreasure = num;

    document.getElementById("treasureTitle").innerText = "Treasure " + num;
    document.getElementById("treasureQuestion").innerText = questions[num];
    document.getElementById("hintText").innerText = "";
    document.getElementById("answerInput").value = "";
    document.getElementById("resultText").innerText = "";

    document.getElementById("treasurePopup").classList.remove("hidden");
}

function showHint() {
    document.getElementById("hintText").innerText = hints[currentTreasure];
}

function checkAnswer() {
    const val = document.getElementById("answerInput").value.toLowerCase().trim();
    if (val === answers[currentTreasure]) {
        roses++;
        document.getElementById("roseCount").innerText = roses;
        document.getElementById("resultText").innerText =
            "Correct 🎉 You earned a rose 🌹";
        if (roses === 3) {
          document.getElementById("finalArrow").classList.remove("hidden");

          // SHOW ADDITIONAL TREASURE UI
            const extra = document.getElementById("extraTreasure");
          if (extra) {
           extra.classList.remove("hidden");
            // 🪄 INIT SCRATCH EFFECT
            setTimeout(initScratch, 300);
          }
        }
    } else {
        document.getElementById("resultText").innerText =
            "Not quite 😅 try again";
    }
}

function closeTreasure() {
    document.getElementById("treasurePopup").classList.add("hidden");
}


/* ========= EXTRA ROSE MAGIC ========= */

let bonusGiven = false;

function goFinal() {

    if (roses < 5) {

        // 🔴 CHANGE TOTAL ROSES TO 5 (UI ONLY)
        const totalEl = document.getElementById("roseTotal");
        if (totalEl) {
            totalEl.innerText = "5";
        }

        alert("Sorry 😅 you need 2 more roses to enter");

        // Show hint after 7 seconds
        setTimeout(() => {
            document.getElementById("extraHint").classList.remove("hidden");
        }, 7000);

        return;
    }

    window.location.href = "rose.html";
}


function closeExtraHint() {
    document.getElementById("extraHint").classList.add("hidden");

    // Show gift after 4 seconds
    setTimeout(() => {
        document.getElementById("giftBox").classList.remove("hidden");
    }, 4000);
}

function openGift() {

    if (bonusGiven) return;

    bonusGiven = true;

    roses += 2;
    document.getElementById("roseCount").innerText = roses;

    alert(
        "I know you’re already a rose 🌹\n" +
        "so here’s one  more 😏"+
        "🌹"

    );

    document.getElementById("giftBox").classList.add("hidden");
}
/* ========= SCRATCH TO REVEAL (AUTO COMPLETE AT 70%) ========= */

function initScratch() {

    const canvas = document.getElementById("scratchCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Scratch layer
    ctx.fillStyle = "#cfcfcf";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "destination-out";

    let scratching = false;
    let revealed = false;

    function scratch(x, y) {
        if (revealed) return;

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        checkReveal();
    }

    function checkReveal() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparent = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparent++;
        }

        const percent = transparent / (pixels.length / 4);

        if (percent > 0.7) {
            revealed = true;
            smoothClear();
        }
    }

    function smoothClear() {
        let opacity = 1;

        const fade = setInterval(() => {
            opacity -= 0.1;
            canvas.style.opacity = opacity;

            if (opacity <= 0) {
                clearInterval(fade);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.display = "none";
            }
        }, 30);
    }

    /* Desktop */
    canvas.addEventListener("mousedown", () => scratching = true);
    canvas.addEventListener("mouseup", () => scratching = false);
    canvas.addEventListener("mouseleave", () => scratching = false);

    canvas.addEventListener("mousemove", (e) => {
        if (!scratching) return;
        scratch(e.offsetX, e.offsetY);
    });

    /* Mobile */
    canvas.addEventListener("touchstart", () => scratching = true);
    canvas.addEventListener("touchend", () => scratching = false);

    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (!scratching) return;

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();

        scratch(
            touch.clientX - rect.left,
            touch.clientY - rect.top
        );
    });
}
