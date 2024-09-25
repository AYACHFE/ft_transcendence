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
        super();
        this.player1 = '';
        this.player2 = '';
        this.scoreP1 = 0;
        this.scoreP2 = 0;
        this.ballX = 0;
        this.ballY = 0;
        this.speedX = 10;
        this.speedY = 10;
        this.counter = 0;
        this.counterInterval = null;
        this.isMoving = false;
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

        this.initGame();
    }

    initGame() {
        const startGameElements = this.querySelectorAll('.start-game h2');
        const gameOverElement = this.querySelector('.game-over h2');
        const ball = this.querySelector('.ball');

        this.hideStartGameElements(startGameElements);
        this.hideGameOver(gameOverElement);

        document.addEventListener('keypress', () => this.hideStartGameElements(startGameElements));
        this.moveRackets();
        this.moveBall(ball);
        this.startCounter();
    }

    hideStartGameElements(elements) {
        elements.forEach(element => {
            element.style.display = 'none';
        });
    }

    hideGameOver(element) {
        element.style.display = 'none';
    }

    moveRackets() {
        const gameBoard = this.querySelector('.board');
        const leftRacket = this.querySelector('.left-racket img');
        const rightRacket = this.querySelector('.right-racket img');
        const step = 10;

        let moveUpRight = false;
        let moveDownRight = false;
        let moveUpLeft = false;
        let moveDownLeft = false;

        document.addEventListener('keydown', (event) => {
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

        document.addEventListener('keyup', (event) => {
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

        setInterval(() => {
            const boardHeight = gameBoard.clientHeight;

            if (moveUpRight) {
                const newTopRightUp = (parseInt(rightRacket.style.top) || 0) - step;
                if (newTopRightUp >= 0) {
                    rightRacket.style.top = newTopRightUp + 'px';
                }
            }
            if (moveDownRight) {
                const newTopRightDown = (parseInt(rightRacket.style.top) || 0) + step;
                if (newTopRightDown <= boardHeight - 100) {
                    rightRacket.style.top = newTopRightDown + 'px';
                }
            }
            if (moveUpLeft) {
                const newTopLeftUp = (parseInt(leftRacket.style.top) || 0) - step;
                if (newTopLeftUp >= 0) {
                    leftRacket.style.top = newTopLeftUp + 'px';
                }
            }
            if (moveDownLeft) {
                const newTopLeftDown = (parseInt(leftRacket.style.top) || 0) + step;
                if (newTopLeftDown <= boardHeight - 100) {
                    leftRacket.style.top = newTopLeftDown + 'px';
                }
            }
        }, 20);
    }

    moveBall(ball) {
        const boardWidth = this.querySelector('.board').clientWidth;
        const boardHeight = this.querySelector('.board').clientHeight;
        const ballDiameter = ball.clientWidth;

        this.ballX = boardWidth / 2 - ballDiameter / 2;
        this.ballY = boardHeight / 2 - ballDiameter / 2;
        this.speedX = 10;
        this.speedY = 10;

        let isMoving = false;
        document.addEventListener('keydown', () => {
            isMoving = true;
        });

        const scoreP1Html = this.querySelector('.user-1-score > h2');
        const scoreP2Html = this.querySelector('.user-2-score > h2');

        const move = () => {
            if (!isMoving) {
                requestAnimationFrame(move);
                return;
            }

            scoreP1Html.innerHTML = this.scoreP1;
            scoreP2Html.innerHTML = this.scoreP2;

            ball.style.left = `${this.ballX}px`;
            ball.style.top = `${this.ballY}px`;

        
            if (this.scoreP1 === 3 || this.scoreP2 === 3) {
                const gameOverMessage = this.querySelector('.game-over h2');
                const middleLine = this.querySelector('.middle-line');
                const ballElement = this.querySelector('.ball');

            
                gameOverMessage.innerHTML = 'Game Over! Player ' + (this.scoreP1 === 3 ? '1' : '2') + ' wins!';
                middleLine.style.display = 'none';
                ballElement.style.display = 'none';
                gameOverMessage.style.display = 'block';

            
                this.dispatchEvent(new CustomEvent('game-finished', {
                    detail: { winner: this.scoreP1 === 3 ? this.player1 : this.player2 },
                    bubbles: true
                }));

                return;
            }

        
            this.ballX += this.speedX;
            this.ballY += this.speedY;

        
            if (this.ballX <= 0) {
                this.scoreP2++;
                this.ballX = boardWidth / 2 - ballDiameter / 2;
            }
            if (this.ballX + ballDiameter >= boardWidth) {
                this.scoreP1++;
                this.ballX = boardWidth / 2 - ballDiameter / 2;
            }
            if (this.ballY <= 0 || this.ballY + ballDiameter >= boardHeight) {
                this.speedY = -this.speedY;
            }

            requestAnimationFrame(move);
        };

        move();
    }

    startCounter() {
        this.counterInterval = setInterval(() => {
            this.counter++;
            const minutes = Math.floor(this.counter / 60);
            const seconds = this.counter % 60;

            this.querySelector('.time h2').innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    disconnectedCallback() {
        clearInterval(this.counterInterval);
        console.log("Game disconnected");
    }
}

customElements.define('game-tournament', GamePage);

customElements.define("the-tournament", Tournament);
