import OnlinePopup from './online-popup.js';
import Game from "../views/game.js";
export default class Dash extends HTMLElement {
    constructor() {
        super()
        this.users = [];
        this.mydata = {};
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

    insertdatatoscores  = async () => {
        //get my data from fetch /main/data
        try {
            const response = await fetch("http://localhost:8000/main/data/", {
              method: "get",
              credentials: "include",
            });
            this.mydata = await response.json();
          } catch (error) {
            console.error("Error:", error);
          }


        let firstuser = document.getElementById('name_first');
        let seconduser = document.getElementById('name_second');
        let thirduser = document.getElementById('name_thred');
        let fourthuser = document.getElementById('name_for');
        let fourthscore = document.getElementById('score_for');
        let firstscore = document.getElementById('score_first');
        let secondscore = document.getElementById('score_second');
        let thirdscore = document.getElementById('score_thred');
        let firstimg = document.getElementById('img_first');
        let secondimg = document.getElementById('img_second');
        let thirdimg = document.getElementById('img_thred');
        let fourthimg = document.getElementById('img_for');


    this.users.sort((a, b) => b.user_wins - a.user_wins);

    let topUsers = this.users.slice(0, 4);
    let isInTopUsers = topUsers.some(user => user.id === this.mydata.id);

    if (!isInTopUsers) {
        topUsers[3] = this.mydata;
    }

    if (topUsers[0]){
        firstuser.innerText = topUsers[0]?.username.substring(0, 10);
        firstscore.innerText = topUsers[0]?.user_wins;
        firstimg.src = topUsers[0]?.avatar_url;
    }
    if (topUsers[1]){
        seconduser.innerText = topUsers[1]?.username.substring(0, 10);
        secondscore.innerText = topUsers[1]?.user_wins;
        secondimg.src = topUsers[1]?.avatar_url;
    }
    if (topUsers[2]){
        thirduser.innerText = topUsers[2]?.username.substring(0, 10);
        thirdscore.innerText = topUsers[2]?.user_wins;
        thirdimg.src = topUsers[2]?.avatar_url;
    }
    if (topUsers[3]){

        fourthuser.innerText = topUsers[3]?.username.substring(0, 10);
        fourthscore.innerText = topUsers[3]?.user_wins;
        fourthimg.src = topUsers[3]?.avatar_url;
    }





    }

    insertlastuserscore = async () => {


        try {
            const response = await fetch('/api/game/get-last-score', {
                method: "get",
                credentials: "include",
            });
                let user_image = document.getElementById('user_image');
                let aadow_image = document.getElementById('aadow_image');
                let user_score = document.getElementById('user_score');
                let aadow_score = document.getElementById('aadow_score');
                let data = await response.json();
                if (data.message == "No data") {
                    user_image.src = this.mydata.avatar_url;
                }
                else{
                   
                    user_image.src = data.last_game.winner;
                    aadow_image.src = data.last_game.loser;
                    user_score.innerText = data.last_game.score_winner;
                    aadow_score.innerText = data.last_game.score_loser;
                }

            } catch (error) {
                console.error("Error:", error);
            }




    }

    getusers = async ()  => {
        await fetch('/api/chat/users/')
        .then(response => response.json())
        .then(data => {
            this.users = data;
        })
    }
    
  
  
    async connectedCallback() {
        this.btnhighlightfun();
        await this.getusers();
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
                <a class="play-button">
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
            <a class="picker-2">
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
                <div class="search-result-board-overflow overflow-style">
                    <div class="search-result-user">
                        <div class="search-user-name">.......</div>
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
                                <img id="img_first" class="leader-img-profile" src="./images/leader-bg/bakhsous.jpg" alt="">
                            </div>
                        </div>
                        <div class="leader-name-rank">
                            <div id="name_first">...</div>
                            <div id="score_first">...</div>
                        </div>
                    </div>
                    <div class="leader-board-users1">
                        <p>2</p>
                        <div class="leader-board-img silver-bg">
                            <div class="leader-img-div">
                                <img id="img_second" class="leader-img-profile" src="./images/leader-bg/bakhsous.jpg" alt="">
                            </div>
                        </div>
                        <div class="leader-name-rank">
                            <div id="name_second">...</div>
                            <div id="score_second">...</div>
                        </div>
                    </div>
                    <div class="leader-board-users2">
                        <p>3</p>
                        <div class="leader-board-img bronz-bg">
                            <div class="leader-img-div">
                                <img id="img_thred" class="leader-img-profile" src="./images/leader-bg/bakhsous.jpg" alt="">
                            </div>
                            
                        </div>
                        <div class="leader-name-rank">
                            <div id="name_thred">...</div>
                            <div id="score_thred">...</div>
                        </div>
                    </div>
                    <div class="leader-board-users3">
                        <p>4</p>
                        <div class="leader-board-img iron-bg">
                            <div class="leader-img-div">
                                <img id="img_for" class="leader-img-profile" src="./images/leader-bg/bakhsous.jpg" alt="">
                            </div>

                        </div>
                        <div class="leader-name-rank">
                            <div id="name_for">...</div>
                            <div id="score_for">...</div>
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
                    <img id="user_image" src="../images/leader-bg/bakhsous.jpg" class="bmatch-player-one-pic">
                    <div id="user_score" class="bmatch-score-one"> 0</div>
                    <div  class="bmatch-score-vs"> VS</div>
                    <div id="aadow_score" class="bmatch-score-two"> 0</div>
                    <img id="aadow_image" src="../images/leader-bg/bakhsous.jpg" class="bmatch-player-two-pic">
                </div>
            </div>
        </div>
        </div>
        </body>
        </html>
        `;
        this.insertdatatoscores();
        this.insertlastuserscore();
        
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
                    searchResultBoard.innerHTML += /*html*/`
                    <div class="search-result-user">
                    <div class="search-user-name">${item.sender.username}</div>
                    <button id="accept-btn" value="${item.sender.id}"> Accept </button>
                    <button id="reject-btn" value="${item.sender.id}"> Reject </button>
                    </div>
                    `
                })
            })
            .finally(()=>{
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
                        fetch(`/api/relations/reject-friendship/${btn.value}`)
                        .then(response => response.json())
                        .then(data =>{
                            
                        })
                    })
                });
            })
        })

		let picker = document.querySelector('.picker-3');

		picker.addEventListener('click', () => {
		    let popup = new OnlinePopup();
		    document.body.appendChild(popup);
		    popup.openModal();
		});
		let picker2_2 = document.querySelector('.picker-2');
		let picker2_1 = document.querySelector('.play-button');
		
		picker2_2.addEventListener('click', () => {
		    let popup = new Game();
			document.querySelector(".center-console").innerHTML = "";
		    document.querySelector(".center-console").appendChild(popup);
		});
		picker2_1.addEventListener('click', () => {
		    let popup = new Game();
			document.querySelector(".center-console").innerHTML = "";
		    document.querySelector(".center-console").appendChild(popup);
		});


        searchInput.addEventListener('input', (event) => {
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
                .finally(()=>{
                    let followBtns = document.querySelectorAll('#follow-btn');
                    followBtns.forEach(function(btn){
                        btn.addEventListener('click', ()=>{
                            fetch(`/api/relations/send-friendship/${btn.value}`)
                            .then(response => response.json())
                            .then(data =>{
                                
                            })
                        })
                    });
                })
            }else{
                //make a functions that runs the first time to get users
            }


        })
        
    }
}

customElements.define("dash-page", Dash);
