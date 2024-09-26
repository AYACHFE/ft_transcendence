export default class Tournament extends HTMLElement {
    constructor() {
        super();
        this.players = [];
        this.playButton = null;
        this.elements = null;
        this.rounds = [];
        this.currentMatch = 0;
        this.currentRound = 1;
    }

    startTournament() {
        if (this.currentRound === 1) {
            this.players = [];
            this.createPlayerArray();
        }

        console.log(`Playing match ${this.currentMatch + 1} in round ${this.currentRound}`);
        this.loadGamePage();
    }

    loadGamePage() {
        const player1 = this.players[this.currentMatch * 2];
        const player2 = this.players[this.currentMatch * 2 + 1];


        document.querySelector('the-tournament').style.display = 'none';


        const gamePage = document.createElement('game-tournament');


        gamePage.setAttribute('player1', player1);
        gamePage.setAttribute('player2', player2);

        
        document.querySelector('.center-console').appendChild(gamePage);


        gamePage.addEventListener('game-finished', (event) => {
            const winner = event.detail.winner;
            console.log(`Winner of the game: ${winner}`);

    
            gamePage.remove();

    
            const parentDiv = document.querySelector('the-tournament');
            parentDiv.style.visibility = 'visible'
            parentDiv.style.display = 'grid';     

    
            this.advanceWinner(winner);
        });
    }

    advanceWinner(winner) {
        if (this.currentRound === 1) {
            document.querySelectorAll('.round2 h3')[this.currentMatch].textContent = winner;
        } else if (this.currentRound === 2) {
            document.querySelectorAll('.round3 h3')[this.currentMatch].textContent = winner;
        } else if (this.currentRound === 3) {
    
            document.querySelectorAll('.round4 h3')[0].textContent = winner;
            this.showFinalWinner(winner);
            return;
        }

        this.currentMatch++;

        const totalMatches = this.players.length / 2;
        if (this.currentMatch >= totalMatches) {
            this.prepareForNextRound();
        }
    }

    showFinalWinner(winner) {

        this.playButton.disabled = true;


        const finalWinnerText = document.createElement('h3');
    finalWinnerText.textContent = `Final Winner: ${winner}`;
    finalWinnerText.classList.add('final-winner');
    document.querySelector('.parent').appendChild(finalWinnerText);
        

    }

    prepareForNextRound() {
        const winners = [];
        const nextRoundElements = document.querySelectorAll(`.round${this.currentRound + 1} h3`);


        for (let i = 0; i < nextRoundElements.length; i++) {
            const winner = nextRoundElements[i].textContent.trim();
            if (winner) {
                winners.push(winner);
            }
        }

        this.players = winners;
        this.currentMatch = 0; 
        this.currentRound++;   
    }

    areAllFilled() {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].textContent.trim() === '') {
                return false;
            }
        }
        return true;
    }

    createPlayerArray() {
        for (let i = 0; i < this.elements.length; i++) {
            this.players.push(this.elements[i].textContent.trim());
        }
    }

    updateButtonState() {
        this.playButton.disabled = !this.areAllFilled();
    }

    connectedCallback() {
        this.innerHTML = /*html*/`

            <div class="parent">
                <div class="div1 round1" contenteditable="true">renna</div>
                <div class="div2 round1" contenteditable="true">rachid</div>
                <div class="div3 round1" contenteditable="true">holla</div>
                <div class="div4 round1" contenteditable="true">ayman</div>
                <div class="div5 round1" contenteditable="true">mehdi</div>
                <div class="div6 round1" contenteditable="true">hassan</div>
                <div class="div7 round1" contenteditable="true">whoiam</div>
                <div class="div8 round1" contenteditable="true">none</div>
                <div class="div9 round2"><h3 id="winner"></h3></div>
                <div class="div10 round2"><h3 id="winner"></h3></div>
                <div class="div11 round2"><h3 id="winner"></h3></div>
                <div class="div12 round2"><h3 id="winner"></h3></div>
                <div class="div13 round3"><h3 id="winner"></h3></div>
                <div class="div14 round3"><h3 id="winner"></h3></div>
                <div class="div15 round4"><h3 id="winner"></h3></div>
                <div class="div16"><img src="../images/tournament/small-bracket.svg"></div>
                <div class="div17"><img src="../images/tournament/small-bracket.svg"></div>
                <div class="div18"><img src="../images/tournament/small-bracket.svg"></div>
                <div class="div19"><img src="../images/tournament/small-bracket.svg"></div>
                <div class="div20"><img src="../images/tournament/medium-bracket.svg"></div>
                <div class="div21"><img src="../images/tournament/medium-bracket.svg"></div>
                <div class="div22"><img src="../images/tournament/large-bracket.svg"></div>
                <button class="play_game">Play</button>
            </div>

        `;

        this.playButton = document.querySelector('.play_game');
        this.elements = document.querySelectorAll('.round1[contenteditable]');

        this.updateButtonState();

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].oninput = () => this.updateButtonState();
        }
        this.playButton.onclick = () => this.startTournament();
    }
}



class GamePage extends HTMLElement {
    constructor() {
        super()
        this.player1 = '';
        this.player2 = '';
    }
  connectedCallback() {
    this.player1 = this.getAttribute('player1');
    this.player2 = this.getAttribute('player2');
    this.innerHTML = `
        <div class="parent">
            <div class="top-bar">
                <div class="user-1">
                    <img class="tb-user-1-logo" src="../images/users/happy-2.svg" alt="#"> 
                    <h2 class="user-1-name">${this.player1}</h2>
                </div>
                <div class="user-1-score"><h2>0</h2></div>
                <div class="time"><h2>00:00</h2></div>
                <div class="user-2-score"><h2>0</h2></div>
                <div class="user-2">
                    <h2 class="user-2-name">${this.player2}</h2>
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
var newTime = false;
const moveBall = async () => {
	if (!isMoving) {
		requestAnimationFrame(moveBall);
        return;
    }
	if (!newTime) {
		newTime = true;
		startCounter();
	}
	scoreP1_html.innerHTML = scoreP1;
	scoreP2_html.innerHTML = scoreP2;
	// scoreP1 = 3;
	if (newChance) {
		ball.style.left = `${ballX}px`;
		ball.style.top = `${ballY}px`;
		if (scoreP1 === 3 || scoreP2 === 3) {
            const gameOverMessage = document.querySelector('.game-over h2');
			const middle_line = document.querySelector('.middle-line');
			const ball = document.querySelector('.ball');

        
            gameOverMessage.innerHTML = 'Game Over! Player ' + (scoreP1 === 3 ? this.player2 : this.player1) + ' wins!';
            middle_line.style.display = 'none';
            ball.style.display = 'none';
            gameOverMessage.style.display = 'block';

            await sleep(300);
            this.dispatchEvent(new CustomEvent('game-finished', {
                detail: { winner: scoreP1 === 3 ? this.player2 : this.player1 },
                bubbles: true
            }));

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

}
moveBall();




////////////////////////// updates the variables for the online game //////////////////////////

// Assuming you have variables for paddle positions, ball position, and score
var paddlePos = { player1: parseInt(leftRacket.style.top), player2: parseInt(rightRacket.style.top) };
var ballPos = { x: ballX, y: ballY };
var score = { player1 : scoreP1, player2: scoreP2 };

const roomName = 'test';  // This could be dynamically generated






////////////////////////// Save game result to the server //////////////////////////


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

}

  disconnectedCallback() {
    console.log("dis connected Callback");
    if (this.intervalID)
        clearInterval(this.intervalID)
  }
}

customElements.define('game-tournament', GamePage);


customElements.define("the-tournament", Tournament);
