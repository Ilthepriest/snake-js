const board = document.querySelector(".board");
const scoreDom = document.querySelector(".score");
const maxScoreDom = document.querySelector(".maxScore");
let audio = new Audio("burp.wav");
let intervalRight;
let intervalLeft;
let intervalUp;
let intervalDown;
let speed = 100;
const numberCell = 801;
let posAttuale = 300;
let direction;
let frutto;
let body = [];
const posPrecedenteTesta = [];
let score = 0;
let maxScore = 0;
// const posAggiornataBody =[]

scoreDom.textContent = ` ${score}`;
maxScoreDom.textContent = ` ${maxScore}`;

function game() {
  //creo la board
  for (let i = 1; i < numberCell; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data", i);
    // cell.textContent = i;
    board.appendChild(cell);
  }

  const cells = document.querySelectorAll(".cell");

  //draw snake

  cells.forEach((el) => {
    if (el.getAttribute("data") == 300) {
      el.classList.add("head");
    }
  });

  const wallRight = [];
  //set number wall right
  for (let i = 40; i < numberCell; i = i + 40) {
    wallRight.push(i);
  }

  const wallLeft = [];
  //set number wall left
  for (let i = 1; i < numberCell; i = i + 40) {
    wallLeft.push(i);
  }

  //event listener
  document.addEventListener("keydown", moveRight);

  function moveRight(event) {
    if (event.key === "ArrowRight") {
      direction = "right";
      console.log(direction);
      //remove per non andare due volte a destra o a sinista nello stesso senso
      document.removeEventListener("keydown", moveLeft);
      document.removeEventListener("keydown", moveRight);

      //attivo le direzioni corrette
      setTimeout(function () {
        document.addEventListener("keydown", moveUp);
        document.addEventListener("keydown", moveDown);
      }, speed);

      clearInterval(intervalUp);
      clearInterval(intervalDown);
      clearInterval(intervalLeft);

      intervalRight = setInterval(function () {
        posPrecedenteTesta.unshift(posAttuale);
        if (wallRight.includes(posAttuale)) {
          posAttuale = posAttuale - 39;
        } else {
          posAttuale++;
        }
        move();
      }, speed);
    }
  }

  document.addEventListener("keydown", moveLeft);

  function moveLeft(event) {
    if (event.key == "ArrowLeft") {
      direction = "left";
      console.log(direction);
      //remove per non andare due volte a destra o a sinista nello stesso senso
      document.removeEventListener("keydown", moveLeft);
      document.removeEventListener("keydown", moveRight);
      //attivo le direzioni corrette
      setTimeout(function () {
        document.addEventListener("keydown", moveUp);
        document.addEventListener("keydown", moveDown);
      }, speed);
      clearInterval(intervalDown);
      clearInterval(intervalUp);
      clearInterval(intervalRight);

      intervalLeft = setInterval(function () {
        posPrecedenteTesta.unshift(posAttuale);
        if (wallLeft.includes(posAttuale)) {
          posAttuale = posAttuale + 39;
        } else {
          posAttuale--;
        }
        move();
      }, speed);
    }
  }

  document.addEventListener("keydown", moveUp);

  function moveUp(event) {
    if (event.key == "ArrowUp") {
      direction = "up";
      console.log(direction);
      //remove per non andare due volte a su o giù nello stesso senso
      document.removeEventListener("keydown", moveUp);
      document.removeEventListener("keydown", moveDown);
      //attivo le direzioni corrette
      setTimeout(function () {
        document.addEventListener("keydown", moveRight);
        document.addEventListener("keydown", moveLeft);
      }, speed);

      clearInterval(intervalLeft);
      clearInterval(intervalRight);
      clearInterval(intervalDown);
      intervalUp = setInterval(function () {
        posPrecedenteTesta.unshift(posAttuale);
        if (posAttuale < 1) {
          posAttuale = posAttuale + 800;
        } else {
          posAttuale -= 40;
        }
        move();
      }, speed);
    }
  }

  document.addEventListener("keydown", moveDown);

  function moveDown(event) {
    if (event.key == "ArrowDown") {
      direction = "down";
      console.log(direction);
      //remove per non andare due volte giù o sù nello stesso senso
      document.removeEventListener("keydown", moveDown);
      document.removeEventListener("keydown", moveUp);
      //attivo le direzioni corrette
      setTimeout(function () {
        document.addEventListener("keydown", moveRight);
        document.addEventListener("keydown", moveLeft);
      }, speed);

      clearInterval(intervalLeft);
      clearInterval(intervalRight);
      clearInterval(intervalUp);
      intervalDown = setInterval(function () {
        posPrecedenteTesta.unshift(posAttuale);
        posAttuale += 40;
        if (posAttuale > 800) {
          posAttuale = posAttuale - 800;
        }
        move();
      }, speed);
    }
  }

  //movimento
  function move() {
    cells.forEach((el) => {
      el.classList.remove("head");
      el.classList.remove("snake");
      if (el.getAttribute("data") == posAttuale) {
        el.classList.add("head");
        increment(el);
      }
    });

    for (let i = 0; i < body.length; i++) {
      cells.forEach((cella) => {
        if (cella.getAttribute("data") == posPrecedenteTesta[i]) {
          cella.classList.add("snake");
          /* posAggiornataBody.unshift(cella.getAttribute("data"))
          console.log(posAggiornataBody); */
          if (posAttuale == cella.getAttribute("data")) {
            clearInterval(intervalLeft);
            clearInterval(intervalRight);
            clearInterval(intervalUp);
            clearInterval(intervalDown);

            if (score > maxScore) {
              localStorage.setItem("score", JSON.stringify(score));
            }
            alert("Hai perso");
            location.reload();
          }
        }
      });
    }

    //pulisco l'array per non bloccare la memoria
    if(posPrecedenteTesta.length > numberCell){
      posPrecedenteTesta.pop()
    }
    // console.log(posPrecedenteTesta);

    /* //ottengo la posizione aggiornata del posAggiornataBody del serpente
    for (let i = 0; i < body.length; i++) {
      posAggiornataBody.pop()
    }
 */
    //genero nuovo frutto
    if (!frutto) {
      updateFrutto();
    } 
    // console.log(frutto);
    
  }
  //incremento dopo che mangia il frutto
  function increment(element) {
    if (posAttuale == frutto) {
      audio.play();
      score = score + 1;
      scoreDom.textContent = ` ${score}`;
      element.classList.remove("frutto");
      let bodyCell;
      for (let i = 0; i < posPrecedenteTesta.length; i++) {
        if (body.length == 0) {
          const element = posPrecedenteTesta[body.length];
          bodyCell = element;
          body.push(bodyCell);
          break;
        } else if (body.length > 0) {
          const element = posPrecedenteTesta[body.length];
          bodyCell = element;
          body.push(bodyCell);
          break;
        }
      }
      frutto = null;
    }
  }

  //draw frutto
  function updateFrutto() {
    do {
      frutto = Math.floor(Math.random() * numberCell - 1);
    } while (frutto == posAttuale);
   
    cells.forEach((el) => {
      if (el.getAttribute("data") == frutto) {
        el.classList.add("frutto");
      }
    });
  }
  updateFrutto();
}

game();

const storageScore = JSON.parse(localStorage.getItem("score"));
if (score > storageScore) {
  maxScore = score;
  maxScoreDom.textContent = ` ${maxScore}`;
} else if (score < storageScore) {
  maxScore = storageScore;
  maxScoreDom.textContent = ` ${maxScore}`;
}
