////////////////////////// updates the variables for the online game //////////////////////////

const leftRacket = document.querySelector('.left-racket img');
const rightRacket = document.querySelector('.right-racket img');
const ball = document.querySelector('.ball');
const gameBoard = document.querySelector('.board');
var rect = gameBoard.getBoundingClientRect();
var scoreP1_html = document.querySelector('.user-1-score > h2');
var scoreP2_html = document.querySelector('.user-2-score > h2');
	

const ballDiameter = ball.clientWidth;
var ballX = boardWidth / 2 - ballDiameter + rect.top;
var ballY = boardHeight / 2 - ballDiameter/2 + rect.left;
var boardWidth = gameBoard.clientWidth;
var boardHeight = gameBoard.clientHeight;

let paddlePos = { player1: parseInt(leftRacket.style.top), player2: parseInt(rightRacket.style.top) };
let ballPos = { x: ballX, y: ballY };
var scoreP1 = 0;
var scoreP2 = 0;
let score = { player1: scoreP1, player2: scoreP2 };

var speedX = 10; // Horizontal speed
var speedY = 10; // Vertical speed

var isMoving = false;
	document.addEventListener('keydown', function() {
		isMoving = true;
	});
	document.addEventListener('click', function() {
		isMoving = true;
	});



const roomName = 'test';  // This could be dynamically generated
const gameSocket = new WebSocket(
    'ws://' + "localhost:8000" + '/ws/game/' + roomName + '/'
);

gameSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);

    // Update game state based on received data
    paddlePos = data.paddle_pos;
    ballPos = data.ball_pos;
    score = data.score;

    // Update your game UI accordingly
    updateGameUI(paddlePos, ballPos, score);
};

// Helper function to update the game UI (rackets and ball)
function updateGameUI(paddlePos, ballPos, score) {
    // Update paddles' positions
    leftRacket.style.top = `${paddlePos.player1}px`;
    rightRacket.style.top = `${paddlePos.player2}px`;

    // Update ball's position
    ball.style.left = `${ballPos.x}px`;
    ball.style.top = `${ballPos.y}px`;

    // Update scores
    scoreP1_html.innerHTML = score.player1;
    scoreP2_html.innerHTML = score.player2;
}

////////////////////////// Ball and Racket Movement Logic //////////////////////////



async function moveBall() {
    // Check if this player should control the ball (you could have a "host" or server-side logic)
    const isHost = true; // This logic depends on your implementation
	console.log("is host: ", isHost);
    if (!isMoving) {
        requestAnimationFrame(moveBall);
        return;
    }

    // Move ball only if this player is the host
	ballX += speedX;
	ballY += speedY;
    if (isHost) {

        // Check for collision with the walls and reverse direction if needed
        var ballRect = ball.getBoundingClientRect();
        var leftRacketRect = leftRacket.getBoundingClientRect();
        var rightRacketRect = rightRacket.getBoundingClientRect();

        if (ballX + ballDiameter + 10 > rect.right - ballDiameter) {
            if (ballRect.top + ballRect.height >= rightRacketRect.top && ballRect.top <= rightRacketRect.bottom) {
                speedX = -speedX;
            } else {
                scoreP2++;
                resetBall();
            }
        }
        if (ballX + 10 < rect.left) {
            if (ballRect.top + ballRect.height >= leftRacketRect.top && ballRect.top <= leftRacketRect.bottom) {
                speedX = -speedX;
                ballX = rect.left;
            } else {
                scoreP1++;
                resetBall();
            }
        }
        if (ballY + ballDiameter + 10 > rect.bottom || ballY + 10 < rect.top) {
            speedY = -speedY;
        }

        // Send ball and score update to the other player
        sendGameState();
    }

    // Update the ball's position locally for both players
	console.log("ballX: ", ballX, " ballY: ", ballY);
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(moveBall);
}
moveBall();

function sendGameState() {
    if (gameSocket.readyState === 1) {
        gameSocket.send(JSON.stringify({
            'paddle_pos': paddlePos,
            'ball_pos': { x: ballX, y: ballY },
            'score': { player1: scoreP1, player2: scoreP2 },
        }));
    } else {
        console.log('WebSocket is not open. readyState: ', gameSocket.readyState);
    }
}

function resetBall() {
    ballX = boardWidth / 2 - ballDiameter / 2;
    ballY = boardHeight / 2 - ballDiameter / 2;
    speedX = -speedX; // Reverse direction after a goal
    newChance = true;
    isMoving = false; // Pause movement after a goal until a player interacts
}

////////////////////////// Racket Movement Event Handlers //////////////////////////
let moveUpRight = false;
let moveDownRight = false;
let moveUpLeft = false;
let moveDownLeft = false;
document.addEventListener('keydown', function(event) {
    switch (event.key) {
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
	paddlePos = { player1: parseInt(leftRacket.style.top), player2: parseInt(rightRacket.style.top) };
    sendGameState();
});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
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
	paddlePos = { player1: parseInt(leftRacket.style.top), player2: parseInt(rightRacket.style.top) };
    sendGameState();
});

setInterval(function() {
    const step = 10; // Racket movement speed

    if (moveUpRight) {
        newTopRightUp = (parseInt(rightRacket.style.top) || 0) - step;
        if (newTopRightUp >= -boardHeight / 2) {
            rightRacket.style.top = newTopRightUp + 'px';
            paddlePos.player2 = newTopRightUp; // Update paddle position for right player
        }
    }
    if (moveDownRight) {
        newTopRightDown = (parseInt(rightRacket.style.top) || 0) + step;
        if (newTopRightDown <= boardHeight / 2 - 100) {
            rightRacket.style.top = newTopRightDown + 'px';
            paddlePos.player2 = newTopRightDown;
        }
    }
    if (moveUpLeft) {
        newTopLeftUp = (parseInt(leftRacket.style.top) || 0) - step;
        if (newTopLeftUp >= -boardHeight / 2) {
            leftRacket.style.top = newTopLeftUp + 'px';
            paddlePos.player1 = newTopLeftUp; // Update paddle position for left player
        }
    }
    if (moveDownLeft) {
        newTopLeftDown = (parseInt(leftRacket.style.top) || 0) + step;
        if (newTopLeftDown <= boardHeight / 2 - 100) {
            leftRacket.style.top = newTopLeftDown + 'px';
            paddlePos.player1 = newTopLeftDown;
        }
    }

    // Send paddle updates to the server
    sendGameState();
}, 20); // Adjust interval as needed for smoothness
