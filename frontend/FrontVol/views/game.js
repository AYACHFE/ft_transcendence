export default class Game extends HTMLElement {
    constructor() {super()
        this.innerHTML = `<loading-page></loading-page>`
        this.counterInterval = null;
    }
    startCounter() {
        let counter = 0;
        this.counterInterval = setInterval(function() {
            counter++;

            // Calculate the number of minutes and seconds
            let minutes = Math.floor(counter / 60);
            let seconds = counter % 60;

            // Pad the minutes and seconds with leading zeros if they are less than 10
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            // Update the time element
            document.querySelector('.time h2').innerHTML = minutes + ':' + seconds;
        }, 1000);
    }
    stopCounter() {
		// Stop the counter
		if (this.counterInterval) {
			clearInterval(this.counterInterval);
			this.counterInterval = null;
		}
	}

    btnhighlightfun(){
        document.querySelectorAll('.btn-highlight').forEach(el => {
          el.classList.remove('btn-highlight');
      });
  
      const chatButton = document.getElementById('dashbtn');
  
      if (chatButton) {
          chatButton.classList.add('btn-highlight');
      }
    }
    connectedCallback() {
        this.btnhighlightfun();
    this.innerHTML = `  
        <div class="parent">
            <div class="top-bar">
                <div class="user-1">
                    <img class="tb-user-1-logo" src="../images/users/happy-2.svg" alt="#"> 
                    <h2 class="user-1-name">User1</h2>
                </div>
                <div class="user-1-score"><h2>0</h2></div>
                <div class="time"><h2>00:00</h2></div>
                <div class="user-2-score"><h2>0</h2></div>
                <div class="user-2">
                    <h2 class="user-2-name">User2</h2>
                    <img class="tb-user-2-logo" src="../images/users/1_men.svg" alt="#">
                </div>
            </div>
            <div class="game-board">
                <div class="board">
                    <div class="left-racket"><img src="../images/racket.svg" alt=""></div>
                    <div class="middle-part">
                        <div class="start-game start-game-first"><h2>Start</h2></div>
                        <div class="game-over"><h2>Game-over</h2></div>
                        <div class="middle-line"><img src="../images/middle-line.svg" alt="#"></div>
                        <div class="start-game start-game-second"><h2>Game</h2></div>
                    </div>
                    <div class="right-racket"><img src="../images/racket.svg" alt=""></div>
                    <div class="ball"></div>
                </div>
            </div>
        </div>
    `;
var startGameElements = document.querySelectorAll('.start-game h2');
var gameover = document.querySelectorAll('.game-over h2');
var ball_ = document.querySelectorAll('.ball');

// Create a function to handle the event
function hideStartGameElements() {
    // Loop through each start game text element and hide it
    startGameElements.forEach(function(element) {
        element.style.display = 'none';
    });
}
function hideGameOver() {
    gameover.forEach(function(element) {
        element.style.display = 'none';
    });
}

// Add the function as an event listener for multiple events
// document.addEventListener('click', hideStartGameElements);
document.addEventListener('keypress', hideStartGameElements);
hideGameOver();
//---------------------------rackets-movemnt-----------------------------------\\
//ball data
const gameBoard = document.querySelector('.board');
const ball = document.querySelector('.ball');

var leftRacket = document.querySelector('.left-racket img');
const rightRacket = document.querySelector('.right-racket img');
var leftRacketRect;
var rightRacketRect;

let boardWidth = gameBoard.clientWidth;
let boardHeight = gameBoard.clientHeight;
var rect = gameBoard.getBoundingClientRect();
//
window.addEventListener('load', () => {
    boardHeight = gameBoard.clientHeight;
    boardWidth = gameBoard.clientWidth;
	rect = gameBoard.getBoundingClientRect();
});
window.addEventListener('resize', function() {
    boardHeight = gameBoard.clientHeight;
    boardWidth = gameBoard.clientWidth;
	rect = gameBoard.getBoundingClientRect();
});


//---------------------- racket event listener to move up and down ----------------------\\
var moveUpRight = false;
var moveDownRight = false;
var moveUpLeft = false;
var moveDownLeft = false;

document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            moveUpRight = true;
            break;
        case 'ArrowDown':
            moveDownRight = true;
            break;
        case 'w':
            moveUpLeft = true;
            break;
        case 's':
            moveDownLeft = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            moveUpRight = false;
            break;
        case 'ArrowDown':
            moveDownRight = false;
            break;
        case 'w':
            moveUpLeft = false;
            break;
        case 's':
            moveDownLeft = false;
            break;
    }
});


var newTopRightUp;
var newTopRightDown;
var newTopLeftUp;
var newTopLeftDown;
setInterval(function() {
    const leftRacket = document.querySelector('.left-racket img');
    const rightRacket = document.querySelector('.right-racket img');
    const step = 10; // Change this value to make the rackets move faster or slower

    if (moveUpRight) {
        // Move the right racket up
        newTopRightUp = (parseInt(rightRacket.style.top) || 0) - step;
        if (newTopRightUp >= -boardHeight / 2) {
            rightRacket.style.top = newTopRightUp + 'px';
        }
    }

    if (moveDownRight) {
        // Move the right racket down
        newTopRightDown = (parseInt(rightRacket.style.top) || 0) + step;
        if (newTopRightDown <= boardHeight / 2 - 150) {
            rightRacket.style.top = newTopRightDown + 'px';
        }
    }

    if (moveUpLeft) {
        // Move the left racket up
        newTopLeftUp = (parseInt(leftRacket.style.top) || 0) - step;
        if (newTopLeftUp >= -boardHeight / 2) {
            leftRacket.style.top = newTopLeftUp + 'px';
        }
    }

    if (moveDownLeft) {
        // Move the left racket down
        newTopLeftDown = (parseInt(leftRacket.style.top) || 0) + step;
        if (newTopLeftDown <= boardHeight / 2 - 150) {
            leftRacket.style.top = newTopLeftDown + 'px';
        }
    }
}, 20); // Change this value to make the rackets move smoother or choppier

//--------------------------ball------------------------------------\\
var ballDiameter = ball.clientWidth;
var leftRacketPos = leftRacket.offsetTop;
var ballX = boardWidth / 2 - ballDiameter + rect.top; // Initial X position at the center of the board
var ballY = boardHeight / 2 - ballDiameter/2 + rect.left; // Initial Y position
var speedX = 10; // Horizontal speed
var speedY = 10; // Vertical speed

var isMoving = false;
	document.addEventListener('keydown', function() {
		isMoving = true;
	});

var scoreP1 = 0;
var scoreP2 = 0;
var scoreP1_html = document.querySelector('.user-1-score > h2');
var scoreP2_html = document.querySelector('.user-2-score > h2');
var racket = document.getElementsByClassName('left-racket')[0];


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const initleftRacketRect = leftRacket.getBoundingClientRect();
const initrightRacketRect = rightRacket.getBoundingClientRect();
var newChance;
var newTime = false;
var maxScore = 3;
const moveBall = async () => {
	if (!isMoving) {
		requestAnimationFrame(moveBall);
        return;
    }
	if (!newTime) {
		newTime = true;
		this.startCounter();
	}
	scoreP1_html.innerHTML = scoreP1;
	scoreP2_html.innerHTML = scoreP2;
	// scoreP1 = 3;
	if (newChance) {
		ball.style.left = `${ballX}px`;
		ball.style.top = `${ballY}px`;
		if (scoreP1 == maxScore || scoreP2 == maxScore) {
			const gameOverMessage = document.querySelector('.game-over h2');
			const middle_line = document.querySelector('.middle-line');
			const ball = document.querySelector('.ball');
			
			// // Change the content of the div
			gameOverMessage.innerHTML = 'Game Over!<br> Player ' + (scoreP1 == maxScore ? '1' : '2') + ' wins!';
			middle_line.style.display = 'none';
			ball.style.display = 'none';
			gameOverMessage.style.display = 'block';
			this.stopCounter();
			return;
		}
		await sleep(700);
		moveBall;
	}
	newChance = false;
	
    ballX += speedX;
    ballY += speedY;
    // Check for collision with the walls and reverse direction if needed
	var ballRect = ball.getBoundingClientRect();
	var leftRacketRect = leftRacket.getBoundingClientRect();
	var rightRacketRect = rightRacket.getBoundingClientRect();
    if (ballX + ballDiameter + 10 > rect.right - ballDiameter) {
		if (ballRect.top + ballRect.height >= rightRacketRect.top && ballRect.top <= rightRacketRect.bottom)
		{
			speedX = -speedX;
		}
		else {
			scoreP2++;
			ballX = boardWidth / 2 - ballDiameter / 2 + rect.top;
			ballY = boardHeight / 2 - ballDiameter / 2 + rect.left;
			newChance = true;
		}
	}
	if (ballX + 10 < rect.left) {
		
		if (ballRect.top + ballRect.height >= leftRacketRect.top && ballRect.top <= leftRacketRect.bottom)
		{
			speedX = -speedX;
			ballX = rect.left;
		}
		else {
			scoreP1++;
			ballX = boardWidth / 2 - ballDiameter / 2 + rect.top;
			ballY = boardHeight / 2 - ballDiameter / 2 + rect.left;
			newChance = true;
		}
	}
	if (ballY + ballDiameter + 10 > rect.bottom) {
		speedY = -speedY;
	}
	if (ballY + 10 < rect.top) {
		ballY = rect.top;
		speedY = -speedY;
	}

    // Set the new position
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(moveBall);
}
moveBall();

}

  disconnectedCallback() {
    console.log("dis connected Callback");
    if (this.counterInterval)
        clearInterval(this.counterInterval)
    this.counterInterval = null;
  }
}

customElements.define("game-page", Game);
