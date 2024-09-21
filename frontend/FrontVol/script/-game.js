const roomIdElment = document.getElementsByTagName('online-game-page');
const roomName = roomIdElment[0].attributes[0].nodeValue;
// document.querySelector('.time h2').innerHTML = 'RoomID :' + roomName;
console.log(`Room name is : ${roomName}`);
const gameSocket = new WebSocket(
    'ws://' + "localhost:8000" + '/ws/game/' + roomName + '/'
);
var startGameElements = document.querySelectorAll('.start-game h2');
var gameover = document.querySelectorAll('.game-over h2');
var ball_ = document.querySelectorAll('.ball');
let role;
// Create a function to handle the event
function hideStartGameElements() {

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

const leftRacket = document.querySelector('.left-racket img');
const rightRacket = document.querySelector('.right-racket img');
// const leftRacketRect;
// var rightRacketRect;

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
	// if (role == 'host') {
		// console.log(event.key, "role is :",role);
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
    // }
	}
});

document.addEventListener('keyup', function(event) {
    // if (role == 'host') {
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
    // }
	}
});

let newTopRightUp;
let newTopRightDown;
let newTopLeftUp;
let newTopLeftDown;
setInterval(function() {
    // const leftRacket = document.querySelector('.left-racket img');
    // const rightRacket = document.querySelector('.right-racket img');
    const step = 10; // Change this value to make the rackets move faster or slower

	if (role == 'guest') {
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
			if (newTopRightDown <= boardHeight / 2 - 140) {
				rightRacket.style.top = newTopRightDown + 'px';
			}
		}
	}

	if (role == 'host') {
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
    	    if (newTopLeftDown <= boardHeight / 2 - 140) {
    	        leftRacket.style.top = newTopLeftDown + 'px';
    	    }
    	}
	}

}, 20); // Change this value to make the rackets move smoother or choppier

//--------------------------time-counter------------------------------------\\
let counter = 0;
let counterInterval = null;

function startCounter() {
    counterInterval = setInterval(function() {
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

function stopCounter() {
    // Stop the counter
    if (counterInterval) {
        clearInterval(counterInterval);
        counterInterval = null;
    }
}

//--------------------------ball------------------------------------\\
const ballDiameter = ball.clientWidth;
// var leftRacketPos = leftRacket.offsetTop;
let ballX = boardWidth / 2 - ballDiameter + rect.top; // Initial X position at the center of the board
let ballY = boardHeight / 2 - ballDiameter/2 + rect.left; // Initial Y position
let speedX = 5; // Horizontal speed
let speedY = 5; // Vertical speed

let isMoving = false;
document.addEventListener('keydown', function() {
	isMoving = true;
});
// document.addEventListener('click', function() {
// 	isMoving = true;
// });

let scoreP1 = 0;
let scoreP2 = 0;
const scoreP1_html = document.querySelector('.user-1-score > h2');
const scoreP2_html = document.querySelector('.user-2-score > h2');
const racket = document.getElementsByClassName('left-racket')[0];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const initleftRacketRect = leftRacket.getBoundingClientRect();
const initrightRacketRect = rightRacket.getBoundingClientRect();
let newChance;
let newTime = false;

async function moveBall() {
	if (!isMoving) {
		requestAnimationFrame(moveBall);
        return;
    }
	if (!newTime) {
		newTime = true;
		startCounter();
	}
	// console.log('ballX', ballX, 'ballY', ballY);
	scoreP1_html.innerHTML = scoreP1;
	scoreP2_html.innerHTML = scoreP2;
 
	
	if (newChance) {
		// if (role == 'guest')
			console.log('new chance');
		ball.style.left = `${ballX}px`;
		ball.style.top = `${ballY}px`;
		if (scoreP1 == 10 || scoreP2 == 10) {
			const gameOverMessage = document.querySelector('.game-over h2');
			const middle_line = document.querySelector('.middle-line');
			const ball = document.querySelector('.ball');
			
			// // Change the content of the div
			if (role == 'host')
				gameOverMessage.innerHTML = 'You Win!';
			else
				gameOverMessage.innerHTML = 'You Loose!';
				
			middle_line.style.display = 'none';
			ball.style.display = 'none';
			gameOverMessage.style.display = 'block';
			// gameEnded(scoreP1 == 3 ? 1 : 2, scoreP1 == 3 ? 2 : 1, 0, scoreP1 == 3 ? 'win' : 'lose');
			stopCounter();
			return;
		}
		// sendGameState();
		// await sleep(700);
	}
	newChance = false;
	if (role == 'host') {
	
			ballX += speedX;
			ballY += speedY;
			// Check for collision with the walls and reverse direction if needed
			const ballRect = ball.getBoundingClientRect();
			const leftRacketRect = leftRacket.getBoundingClientRect();
			const rightRacketRect = rightRacket.getBoundingClientRect();
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
			if (ballX < rect.left) {
				
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
			if (ballY + ballDiameter > rect.bottom) {
				speedY = -speedY;
			}
			
			if (ballY < rect.top) {
				console.log('ballY:', ballY, 'rect.top:', rect.top);
				ballY = rect.top;
				speedY = -speedY;
			}
			if (role == 'host') {
				ball.style.left = `${ballX}px`;	
				ball.style.top = `${ballY}px`;
			}
		}

	sleep(100);
	sendGameState();
	// updateGameUI();
    requestAnimationFrame(moveBall);
}
moveBall();

////////////////////////// updates the variables for the online game //////////////////////////


var paddlePos = { player1: parseInt(leftRacket.style.top), player2: parseInt(rightRacket.style.top) };
var ballPos = { x: ballX, y: ballY };
var score = { player1: scoreP1, player2: scoreP2 };




function updateGameUI(paddlePos, ballPos, score) {
    // Update paddles' positions
    if (role == 'guest')
		leftRacket.style.top = `${paddlePos.player1}px`;
    if (role == 'host')
		rightRacket.style.top = `${paddlePos.player2}px`;

    // Update ball's position
    if (role == 'guest') {
		ball.style.left = `${ballPos.x}px`;
    	ball.style.top = `${ballPos.y}px`;
    	// Update scores
		scoreP1 = score.player1;
		scoreP2 = score.player2;
	
		// the end of the game
		if (scoreP1 == 10 || scoreP2 == 10) {
			const gameOverMessage = document.querySelector('.game-over h2');
			const middle_line = document.querySelector('.middle-line');
			const ball = document.querySelector('.ball');
			
			gameOverMessage.innerHTML = 'You Loose!';
				
			middle_line.style.display = 'none';
			ball.style.display = 'none';
			gameOverMessage.style.display = 'block';
			stopCounter();
			return;
		}
	}
}

gameSocket.onmessage = function(e) {
	const data = JSON.parse(e.data);
	if (data.type === 'assign_role') {
		role = data.role;
		// const username = data.username;
		console.log('Your role is:', role);
		// console.log('Your username is:', username);
    }
	
    if (data.paddle_pos && data.ball_pos && data.score && role != data.role) {
		// console.log('Received message from the server:', data);
        paddlePos = data.paddle_pos;
        ballPos = data.ball_pos;
        score = data.score;
        updateGameUI(paddlePos, ballPos, score);
		hideStartGameElements();
    }
};

function sendGameState() {
	paddlePos = { player1: parseInt(leftRacket.style.top), player2: parseInt(rightRacket.style.top) };
	ballPos = { x: ballX, y: ballY };
	score = { player1: scoreP1, player2: scoreP2 };
	// console.log('Sending game state to the server:', paddlePos, ballPos, score);
    gameSocket.send(JSON.stringify({
		'role': role,
        'paddle_pos': paddlePos,
        'ball_pos': ballPos,
        'score': score,
    }));
}



////////////////////////// Save game result to the server //////////////////////////

// Function to get the value of a cookie


// function gameEnded(winnerId, loserId, duration, result) {
// 	console.log('Game ended with result:', result);
// 	const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
// 	fetch('http://localhost:8000/game/save_game_result/', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/x-www-form-urlencoded',
// 			'X-CSRFToken': csrftoken
// 		},
// 		body: new URLSearchParams({
// 			'winner_id': winnerId,
// 			'loser_id': loserId,
// 			'duration': duration,
// 			'result': result
// 		})
// 	})
// 	.then(response => response.json())
// 	.then(data => {
// 		if (data.status === 'success') {
// 			console.log('Game result saved successfully');
// 		} else {
// 			console.log('Failed to save game result:', data.message);
// 		}
// 	});
// }


