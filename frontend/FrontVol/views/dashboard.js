
export default class Dashboard extends HTMLElement {
    constructor() {
        super()
        this.userData = null
        this.innerHTML = `<loading-page></loading-page>`
    }

    async  fetchCsrfToken() {
        const response = await fetch('/api/csrf-token/', {
            credentials: 'include'
        });
        const data = await response.json();
        return data.csrfToken;
    }

    logout_post()
    {
        const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
        fetch("http://localhost:8000/api/logout/", {
            method: 'post',
            credentials: 'include',
            headers:{
                'X-CSRFToken':csrftoken
            }
        })
        .then(() =>{
            window.location.href = "/login";
        })
        .catch(error => console.log("error", error));
    }
    connectedCallback() {
        this.innerHTML = `
                <head>
                    <link rel="stylesheet" href="../style/dashboard.css">
                    <meta name="csrf-token" content="">
                </head>
        <div class="container" id="dashboardid">
            <div class="side-panel">
                <a href="/dashboard" class="logo" data-link>
					<img src="../images/Logo.svg">
				<a>
                <div class="nav-options" >
                    <a href="/dashboard" id="dashbtn" class="btn-option flex-center btn-simple btn-simple nav__link"  data-link>
                        <img src="../images/Home.svg">
                    </a>
                
                    <a href="/dashboard/tournament" id="tournamentbtn" class="btn-option flex-center btn-simple  nav__link"  data-link>
                        <img  src="../images/Users.svg">
                    </a>
                    <a href="/dashboard/chat" id="chatbtn" class="btn-option flex-center btn-simple  nav__link " data-link>
                        <img src="../images/Sms.svg">
                    </a>
					<a href="/dashboard/settings" id="settingsbtn" class="btn-option flex-center btn-simple  nav__link" data-link>
                        <img src="../images/Settings.svg">
                    </a>
                </div> 
                <button  id="logout_btn"  class="nav__link logout flex-center" >
                    <img src="../images/Logout.svg">
                </button>
            </div>
            <div class="main">
                <div class="header-bar">
                    <div id="user_name" class="header-name">
                        
                    </div>
                    <input class="header-search" type="text" placeholder="Search For Friends">
                    <div class="header-notifications">
                        <div class="notifications-widget"></div>
                        <div class="notifications-widget"></div>
                    </div>
                </div>
                <div class="center-console" id="dashscripte">
                 


                </div>
            </div>
            <div class="right-side-panel">
                 <div class="upper-section">
                    <div  class="profile-photo">
                        <img id="proPhoto" src="">
                    </div>
                    <img class="upper-section-icone" src="../images/Vector.svg">
                    <div class="users-display overflow-style flex-col">
                        <div class="side-user" style="background-color:#D9D9D9;">
                            <img src="../images/users/happy-1.svg" alt="">
                            <div class="user-status-side active "></div>
                            <div class="user-ingame-side active"><p>in Game</p></div>
                        </div>
                        <div class="side-user" style="background-color:#F7C5BF;">
                            <img src="../images/users/happy-2.svg" alt="">
                            <div class="user-status-side active "></div>
                            <div class="user-ingame-side active"><p>in Game</p></div>
                            
                        </div>
                        <div class="side-user" style="background-color:#FF8A8A;">
                            <img src="../images/users/happy-3.svg" alt="">
                            <div class="user-status-side active "></div>
                            <div class="user-ingame-side "><p>in Game</p></div>
                            
                        </div>
                        <div class="side-user" style="background-color:#FFBEB8;">
                            <img src="../images/users/happy-6.svg" alt="">
                            <div class="user-status-side active "></div>
                            <div class="user-ingame-side "><p>in Game</p></div>
                        </div>
                        <div class="side-user" style="background-color:#C5C6C6;">
                            <img src="../images/users/happy-5.svg" alt="">
                            <div class="user-status-side "></div>
                            <div class="user-ingame-side "><p>in Game</p></div>
                        </div>
                        <div class="side-user" style="background-color:#CEC3FF;">
                            <img src="../images/users/happy-4.svg" alt="">
                            <div class="user-status-side "></div>
                            <div class="user-ingame-side "><p>in Game</p></div>
                        </div>
                        <div class="side-user" style="background-color:#D9D9D9;">
                            <img src="../images/users/happy-1.svg" alt="">
                            <div class="user-status-side "></div>
                            <div class="user-ingame-side "><p>in Game</p></div>
                        </div>
                        <div class="side-user" style="background-color:#F7C5BF;">
                            <img src="../images/users/happy-2.svg" alt="">
                            <div class="user-status-side "></div>
                            <div class="user-ingame-side "><p>in Game</p></div>
                        </div>
                        <div class="side-user" style="background-color:#D9D9D9;">
                            <img src="../images/users/happy-1.svg" alt="">
                            <div class="user-status-side "></div>
                            <div class="user-ingame-side "><p>in Game</p></div>
                        </div>
                    </div>

                </div>
                <div class="lower-section">
                        <div class="lower-section-header-img flex-center">
                            <img  src="../images/Chat.svg">
                        </div>
                        <div class="friends-list overflow-style">
                            <div class="friend" style="background-color: #D9D9D9;">
                                <img src="../images/users/1_men.svg">
                                <div class="user-status-side active"></div>
                            </div>
                            <div class="friend" style="background-color: #D9D9D9;">
                                <img src="../images/users/2_men.svg">
                                <div class="user-status-side"></div>
                            </div>
                            <div class="friend" style="background-color: #D9D9D9;">
                                <img src="../images/users/3_men.svg">
                                <div class="user-status-side"></div>
                            </div>
                        </div>
                </div> 
            </div>
        </div>
        <script>
        function logout_post(){
            var csrfToken = getCookie("csrf-token");
            fetch("http://localhost:8000/api/logout/", {
                method: 'post',
                credentials: 'include',
                headers:{
                    'X-CSRFToken':csrfToken
                }
            })
            .then(() =>{
                window.location.href = "/login";
            })
            .catch(error => console.log("error", error));
        }
        </script>
        `;
        fetch('http://localhost:8000/main/data/',{
            method:"get",
            credentials:"include"
            }).then(response => response.json())
            .then(data => {
                document.getElementById("user_name").innerHTML = data.user_name;
                document.getElementById("proPhoto").src = '';
                document.getElementById("proPhoto").src = '/api/profile-img/';
                
                this.userData = data;
            })


        document.getElementById("logout_btn").addEventListener("click", this.logout_post);
        this.fetchCsrfToken().then(csrfToken => {
            document.querySelector('meta[name="csrf-token"]').setAttribute('content', csrfToken);
        });        
    }
}


customElements.define("dashboard-page", Dashboard);