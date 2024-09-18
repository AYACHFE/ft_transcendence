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

var boardWidth = gameBoard.clientWidth;
var boardHeight = gameBoard.clientHeight;
var rect = gameBoard.getBoundingClientRect();
//
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
	// document.addEventListener('click', function() {
	// 	isMoving = true;
	// });

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
			gameEnded(scoreP1 == 3 ? 1 : 2, scoreP1 == 3 ? 2 : 1, 0, scoreP1 == 3 ? 'win' : 'lose');
			return;
		}
		await sleep(700);
		moveBall;
		// sendGameState();
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
	sendGameState();
}
moveBall();



    // fetch('http://localhost:8000/main/data/',{
    //     method:"get",
    //     credentials:"include"
    // })
    // .then(response => response.json())
    // .then(data => {
    //         document.getElementById('user_name').innerHTML = data.user_name;
    // })


////////////////////////// updates the variables for the online game //////////////////////////

// Assuming you have variables for paddle positions, ball position, and score
var paddlePos = { player1: parseInt(leftRacket.style.top), player2: parseInt(rightRacket.style.top) };
var ballPos = { x: ballX, y: ballY };
var score = { player1: scoreP1, player2: scoreP2 };

const roomName = 'test';  // This could be dynamically generated
const gameSocket = new WebSocket(
    'ws://' + "localhost:8000" + '/ws/game/' + roomName + '/'
);

gameSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);

    paddlePos = data.paddle_pos;
    ballPos = data.ball_pos;
    score = data.score;
    // updateGameUI(paddlePos, ballPos, score);
};

function sendGameState() {
	console.log('Sending game state to the server:', paddlePos, ballPos, score);
    gameSocket.send(JSON.stringify({
        'paddle_pos': paddlePos,
        'ball_pos': ballPos,
        'score': score,
    }));
}



////////////////////////// Save game result to the server //////////////////////////

// Function to get the value of a cookie


function gameEnded(winnerId, loserId, duration, result) {
	console.log('Game ended with result:', result);
	const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
	fetch('http://localhost:8000/game/save_game_result/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-CSRFToken': csrftoken
		},
		body: new URLSearchParams({
			'winner_id': winnerId,
			'loser_id': loserId,
			'duration': duration,
			'result': result
		})
	})
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
			console.log('Game result saved successfully');
		} else {
			console.log('Failed to save game result:', data.message);
		}
	});
}