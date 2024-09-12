

export default class Dash extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        this.innerHTML = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link rel="stylesheet" href="../style/dash.css">
        </head>
        <body>
        <div class="parent">
        <div class="play-game">
            <div class="play-game-hidden-overflow">
                <div class="star-1"></div>
                <div class="star-2"></div>
                <div class="star-3"></div>
            </div>
            
            <div class="start-game">
                <div class="playnow">PLAY Now</div>
                <a class="play-button" href="/dashboard/game">
                    <img src="./images/Add.svg">
                </a>
            </div>
            <div class="dash-figure">
                <img src="./images/figure.png" >
            </div>

        </div>
        <div class="game-picker">
            <a href="/" class="picker-1">
                <img src="./images/controller.svg" alt="">
                <p>SOLO</p>
            </a>
            <a href="/"class="picker-2">
                <img src="./images/double-controller.svg" alt="">
                <p>MULTIPLAYER</p>
            </a>                                
            <a href="/"class="picker-3">
                <img src="./images/online-controller.svg" alt="">
                <p>Online</p>
            </a>
        </div>
        <div class="div3"> 

        </div>
        <div class="div4">

        </div>
        <div class="leader-board">
            <div class="leader-board_div">
                <div class="leader-board-bg">
                    <div class="triangle-1"></div>
                    <div class="triangle-2"></div>
                </div>
                <div class="leader-board-content">
                    <div class="leader-board-user-header">
                        <p>Rank</p>
                    </div>
                    <div class="leader-board-users0">
                        <p>1</p>
                        <div class="leader-board-img gold-bg">
                            <div class="leader-img-div">
                                <img class="leader-img-profile" src="./images/leader-bg/bakhsous.jpg" alt="">
                            </div>
                        </div>
                        <div class="leader-name-rank">
                            <div>Rachida</div>
                            <div>1</div>
                        </div>
                    </div>
                    <div class="leader-board-users1">
                        <p>2</p>
                        <div class="leader-board-img silver-bg">
                            <div class="leader-img-div">
                                <img class="leader-img-profile" src="./images/leader-bg/bakhsous.jpg" alt="">
                            </div>
                        </div>
                        <div class="leader-name-rank">
                            <div>Ayman</div>
                            <div>2</div>
                        </div>
                    </div>
                    <div class="leader-board-users2">
                        <p>3</p>
                        <div class="leader-board-img bronz-bg">
                            <div class="leader-img-div">
                                <img class="leader-img-profile" src="./images/leader-bg/bakhsous.jpg" alt="">
                            </div>
                            
                        </div>
                        <div class="leader-name-rank">
                            <div>Mehdi</div>
                            <div>3</div>
                        </div>
                    </div>
                    <div class="leader-board-users3">
                        <p>4</p>
                        <div class="leader-board-img iron-bg">
                            <div class="leader-img-div">
                                <img class="leader-img-profile" src="./images/leader-bg/bakhsous.jpg" alt="">
                            </div>

                        </div>
                        <div class="leader-name-rank">
                            <div>Rachid</div>
                            <div>999</div>
                        </div>
                    </div>
                </div>
                <!-- <div class="leader-board-4"></div> -->

            </div>
        </div>
        <div class="best-match"> 
            <div class="best-match-div">
                <div class="bmatch-ellipse-3"></div>
                <div class="bmatch-ellipse-2"></div>
                <div class="bmatch-ellipse-1"></div>
                <div class="bmatch-score">
                    <img src="./images/char.png" class="bmatch-player-one-pic">
                    <div class="bmatch-score-one"> 40</div>
                    <div class="bmatch-score-vs"> VS</div>
                    <div class="bmatch-score-two"> 22</div>
                    <img src="./images/char.png" class="bmatch-player-two-pic">
                    <!-- <div class="bmatch-player-two-pic"></div> -->
                </div>
            </div>
        </div>
        </div>
        </body>
        </html>
        `;
    }
}

customElements.define("dash-page", Dash);
