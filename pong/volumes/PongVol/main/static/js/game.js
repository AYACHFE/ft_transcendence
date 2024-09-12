// Get all the start game text elements
let startGameElements = document.querySelectorAll('.start-game h2');
let gameover = document.querySelectorAll('.game-over h2');
let ball_ = document.querySelectorAll('.ball');

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
document.addEventListener('click', hideStartGameElements);
document.addEventListener('keypress', hideStartGameElements);
hideGameOver();
//---------------------------rackets-movemnt-----------------------------------\\
//ball data
const gameBoard = document.querySelector('.board');
const ball = document.querySelector('.ball');

const leftRacket = document.querySelector('.left-racket img');
const rightRacket = document.querySelector('.right-racket img');
let leftRacketRect;
let rightRacketRect;

let boardWidth = gameBoard.clientWidth;
let boardHeight = gameBoard.clientHeight;
let rect = gameBoard.getBoundingClientRect();
//
window.addEventListener('resize', function() {
    boardHeight = gameBoard.clientHeight;
    boardWidth = gameBoard.clientWidth;
	rect = gameBoard.getBoundingClientRect();

});


//---------------------- racket event listener to move up and down ----------------------\\
let moveUpRight = false;
let moveDownRight = false;
let moveUpLeft = false;
let moveDownLeft = false;

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


let newTopRightUp;
let newTopRightDown;
let newTopLeftUp;
let newTopLeftDown;
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
        if (newTopRightDown <= boardHeight / 2 - 100) {
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
        if (newTopLeftDown <= boardHeight / 2 - 100) {
            leftRacket.style.top = newTopLeftDown + 'px';
        }
    }
}, 20); // Change this value to make the rackets move smoother or choppier

//--------------------------ball------------------------------------\\
const ballDiameter = ball.clientWidth;
const leftRacketPos = leftRacket.offsetTop;
let ballX = boardWidth / 2 - ballDiameter + rect.top; // Initial X position at the center of the board
let ballY = boardHeight / 2 - ballDiameter/2 + rect.left; // Initial Y position
let speedX = 10; // Horizontal speed
let speedY = 10; // Vertical speed

let isMoving = false;
	document.addEventListener('keydown', function() {
		isMoving = true;
	});
	document.addEventListener('click', function() {
		isMoving = true;
	});

let scoreP1 = 0;
let scoreP2 = 0;
let scoreP1_html = document.querySelector('.user-1-score > h2');
let scoreP2_html = document.querySelector('.user-2-score > h2');
var racket = document.getElementsByClassName('left-racket')[0];


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const initleftRacketRect = leftRacket.getBoundingClientRect();
const initrightRacketRect = rightRacket.getBoundingClientRect();
let newChance;
async function moveBall() {
	if (!isMoving) {
		requestAnimationFrame(moveBall);
        return;
    }
	scoreP1_html.innerHTML = scoreP1;
	scoreP2_html.innerHTML = scoreP2;
	// scoreP1 = 3;
	if (newChance) {
		ball.style.left = `${ballX}px`;
		ball.style.top = `${ballY}px`;
		if (scoreP1 == 3 || scoreP2 == 3) {
			const gameOverMessage = document.querySelector('.game-over h2');
			const middle_line = document.querySelector('.middle-line');
			const ball = document.querySelector('.ball');
			
			// // Change the content of the div
			gameOverMessage.innerHTML = 'Game Over!<br> Player ' + (scoreP1 == 3 ? '1' : '2') + ' wins!';
			middle_line.style.display = 'none';
			ball.style.display = 'none';
			gameOverMessage.style.display = 'block';
			endGame();
			return;
		}
		await sleep(700);
		moveBall;
	}
	newChance = false;
	
    ballX += speedX;
    ballY += speedY;
    // Check for collision with the walls and reverse direction if needed
	let ballRect = ball.getBoundingClientRect();
	let leftRacketRect = leftRacket.getBoundingClientRect();
	let rightRacketRect = rightRacket.getBoundingClientRect();
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
// moveBall();

// ------------------------------ time-counter ------------------------------\\

let startTime, intervalId;

// Call this function when the game starts
function startGame() {
	startTime = Date.now();
    intervalId = setInterval(updateTime, 1000); // update time every second
	console.log("asdasd");
    // starts the game
	moveBall();
}

// Call this function to update the time
function updateTime() {
	let currentTime = Date.now();
    let timeDiff = currentTime - startTime; // in ms
    let seconds = Math.floor(timeDiff / 1000); // convert to seconds
    document.querySelector('.time h2').textContent = formatTime(seconds);
}

// Call this function to format the time as mm:ss
function formatTime(seconds) {
	let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Call this function when the game ends
function endGame() {
	clearInterval(intervalId); // stop the timer
    // Rest of your game end logic here
}

startGame();