// const roomName = 'test_1';
// const gameSocket = new WebSocket(
// 	'ws://' + "localhost:8000" + '/ws/game/' + roomName + '/'
// 	);
	
// 	const leftRacket = document.querySelector('.left-racket img');
// 	const rightRacket = document.querySelector('.right-racket img');
// 	const ball = document.querySelector('.ball');
// 	const gameBoard = document.querySelector('.board');
// 	var rect = gameBoard.getBoundingClientRect();
// 	var scoreP1_html = document.querySelector('.user-1-score > h2');
// 	var scoreP2_html = document.querySelector('.user-2-score > h2');
	

// const ballDiameter = ball.clientWidth;
// var ballX = boardWidth / 2 - ballDiameter + rect.top;
// var ballY = boardHeight / 2 - ballDiameter/2 + rect.left;
// var boardWidth = gameBoard.clientWidth;
// var boardHeight = gameBoard.clientHeight;

// let paddlePos = { player1: parseInt(leftRacket.style.top), player2: parseInt(rightRacket.style.top) };
// let ballPos = { x: ballX, y: ballY };
// var scoreP1 = 0;
// var scoreP2 = 0;
// let score = { player1: scoreP1, player2: scoreP2 };

// // Handle incoming WebSocket messages
// gameSocket.onmessage = function(e) {
//     const data = JSON.parse(e.data);

// 	console.log("Message received from server:", data);

//     updateGameUI(data.paddle_pos, data.ball_pos, data.score);
// };

// // Update game state and send it to the server
// function sendGameState() {
//     gameSocket.send(JSON.stringify({
//         'paddle_pos': paddlePos,
//         'ball_pos': ballPos,
//         'score': score,
//     }));
// }

// let moveUpRight = false;
// let moveDownRight = false;
// let moveUpLeft = false;
// let moveDownLeft = false;
// // Handle player controls and update paddle positions
// document.addEventListener('keydown', function(event) {
//     switch(event.key) {
		
//         case 'ArrowUp':
//             moveUpRight = true;
//             break;
//         case 'ArrowDown':
//             moveDownRight = true;
//             break;
//         case 'w':
//             moveUpLeft = true;
//             break;
//         case 's':
//             moveDownLeft = true;
//             break;
//     }
//     // updatePaddlePositions();
// });

// document.addEventListener('keyup', function(event) {
//     switch(event.key) {
//         case 'ArrowUp':
//             moveUpRight = false;
//             break;
//         case 'ArrowDown':
//             moveDownRight = false;
//             break;
//         case 'w':
//             moveUpLeft = false;
//             break;
//         case 's':
//             moveDownLeft = false;
//             break;
//     }
//     // updatePaddlePositions();
// });

// function updatePaddlePositions() {
//     // Update local paddle positions based on user input
//     if (moveUpRight) {
//         rightRacket.style.top = Math.max(0, (parseInt(rightRacket.style.top) || 0) - 10) + 'px';
//     }
//     if (moveDownRight) {
//         rightRacket.style.top = Math.min(boardHeight - rightRacket.clientHeight, (parseInt(rightRacket.style.top) || 0) + 10) + 'px';
//     }
//     if (moveUpLeft) {
//         leftRacket.style.top = Math.max(0, (parseInt(leftRacket.style.top) || 0) - 10) + 'px';
//     }
//     if (moveDownLeft) {
//         leftRacket.style.top = Math.min(boardHeight - leftRacket.clientHeight, (parseInt(leftRacket.style.top) || 0) + 10) + 'px';
//     }

//     // Update paddlePos based on new positions
//     paddlePos = {
//         player1: parseInt(leftRacket.style.top),
//         player2: parseInt(rightRacket.style.top)
//     };

//     // Send updated game state to the server
//     sendGameState();
// }
// // Update the game UI based on the received game state
// function updateGameUI(paddlePos, ballPos, score) {
//     // Update paddle positions
//     leftRacket.style.top = paddlePos.player1 + 'px';
//     rightRacket.style.top = paddlePos.player2 + 'px';

//     // Update ball position
//     ball.style.left = ballPos.x + 'px';
//     ball.style.top = ballPos.y + 'px';

//     // Update scores
//     scoreP1 = score.player1;
//     scoreP2 = score.player2;
//     scoreP1_html.innerHTML = scoreP1;
//     scoreP2_html.innerHTML = scoreP2;
// }
