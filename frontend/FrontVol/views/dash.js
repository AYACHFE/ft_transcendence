import OnlinePopup from './online-popup.js';

export default class Dash extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        this.innerHTML = /*html*/ `
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
            <a href="/dashboard/tournament" class="picker-1" data-link>
                <img src="./images/controller.svg" alt="">
                <p>Tournament</p>
            </a>
            <a href="/dashboard/game"class="picker-2" data-link>
                <img src="./images/double-controller.svg" alt="">
                <p>MULTIPLAYER</p>
            </a>                                
            <a class="picker-3" >
                <img src="./images/online-controller.svg" alt="">
                <p>Online</p>
            </a>
        </div>
        <div class="div3"> 

        </div>
        <div class="search-board">
            <div class="search-bar">
                <input  class="search-input" placeholder="Search" maxlength="30" >
                <button class="friends-accept-list">Requests</button>
            </div>
            <div class="search-result-board">
                <div class="search-result-board-overflow">
                    <div class="search-result-user">
                        <div class="search-user-name">mehdiboulhoujjat1</div>
                        <button id="follow-btn" value="1"> Follow </button>
                    </div>
                    <div class="search-result-user">
                        <div class="search-user-name">mehdiboulhoujjat2</div>
                        <button id="follow-btn" value="2"> Follow </button>
                    </div>
                    <div class="search-result-user">
                        <div class="search-user-name">mehdiboulhoujjat3</div>
                        <button id="follow-btn" value="3"> Follow </button>
                    </div>
                </div>
            </div>
            
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
                            <div>Rachid</div>
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

        // - GET THE DATA NEEDED FOR THE DASHBOARD -//
        // fetch('/api/')
        function fetch_resquests(){


        }
        let searchResultBoard = document.querySelector('.search-result-board-overflow')

        let searchInput = document.querySelector(".search-input");
        let friendsRequests = document.querySelector(".friends-accept-list");
        searchInput.addEventListener("click", ()=>{
            friendsRequests.style.width = "30%";
            searchInput.style.width = "70%";
        })
        friendsRequests.addEventListener("click", ()=>{
            friendsRequests.style.width = "70%";
            searchInput.style.width = "30%";
            fetch('/api/get-requests/')
            .then(response =>response.json())
            .then(data =>{
                searchResultBoard.innerHTML = '';
                data.forEach((item) =>{
                    console.log('hello');
                    searchResultBoard.innerHTML += /*html*/`
                    <div class="search-result-user">
                    <div class="search-user-name">${item.sender.username}</div>
                    <button id="accept-btn" value="${item.id}"> Accept </button>
                    <button id="reject-btn" value="${item.id}"> Reject </button>
                    </div>
                    `
                })
            })
        })

		let picker = document.querySelector('.picker-3');

		picker.addEventListener('click', () => {
			console.log("clicked");
		    let popup = new OnlinePopup();
		    document.body.appendChild(popup);
		    popup.openModal();
		});


        searchInput.addEventListener('input', (event) => {
            // console.log(event.target.value);
            let searchingString = event.target.value;

            if (searchingString.trim() !== "")
            {
                fetch(`/api/search/${searchingString}`)
                .then(response => response.json())
                .then(data => {
                    searchResultBoard.innerHTML = "";
                    data.forEach((item) =>{
                            searchResultBoard.innerHTML += /*html*/`
                            <div class="search-result-user">
                            <div class="search-user-name">${item.username}</div>
                            <button id="follow-btn" value="${item.id}"> Follow </button>
                            </div>
                            `
                    })
                })
            }else{
                //make a functions that runs the first time to get users
            }
            
            let followBtns = document.querySelectorAll('#follow-btn');
            followBtns.forEach(function(btn){
                btn.addEventListener('click', ()=>{
                    fetch(`/api/relations/send-friendship/${btn.value}`)
                    .then(response => response.json())
                    .then(data =>{
                        
                    })
                })
            });
            let accept_btns = document.querySelectorAll('#accept-btn');
            accept_btns.forEach(function(btn){
                btn.addEventListener('click', ()=>{
                    fetch(`/api/relations/accept-friendship/${btn.value}`)
                    .then(response => response.json())
                    .then(data =>{
                        
                    })
                })
            });
            let reject_btns = document.querySelectorAll('#reject-btn');
            reject_btns.forEach(function(btn){
                btn.addEventListener('click', ()=>{
                    fetch(`/api/relations/accept-friendship/${btn.value}`)
                    .then(response => response.json())
                    .then(data =>{
                        
                    })
                })
            });
        })
        
    }
}

customElements.define("dash-page", Dash);
