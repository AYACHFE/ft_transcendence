
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
        fetch("/api/logout/", {
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
        this.innerHTML = /*html*/`
            <link rel="stylesheet" href="../style/dashboard.css">

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
                        
                    </div>

                </div>
                
            </div>
        </div>
        <script>
        function logout_post(){
            var csrfToken = getCookie("csrf-token");
            fetch("/api/logout/", {
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

        


        let cadre = document.querySelector(".users-display");
        cadre.innerHTML = '';
        fetch("/api/relations/friends-list/")
        .then(response => response.json())
        .then(data => {
            data.forEach((elem)=>{
                cadre.innerHTML += /*html*/`
                <div class="side-user" style="background-color:#D9D9D9;">
                    <img src="${elem.avatar_url}" alt="">
                    <div class="user-status-side active "></div>
                    
                </div>
                `
            })
        })

        fetch('/api/main/data/',{
            method:"get",
            credentials:"include"
            }).then(response => response.json())
            .then(data => {
                document.getElementById("user_name").innerHTML = data.user_name;
                document.getElementById("proPhoto").src = data.avatar_url;
                
                this.userData = data;
            })
            
        
        var buttons = document.querySelectorAll(".btn-option");
        buttons.forEach(function(btn){
            btn.addEventListener('click', function(){
                buttons.forEach(function(btn_rem){
                    btn_rem.classList.remove("btn-highlight");
                    btn_rem.classList.add('btn-simple');
                });
                this.classList.remove('btn-simple')
                this.classList.add("btn-highlight");
            });
        });

        document.getElementById("logout_btn").onclick =  (e) => this.logout_post(e);
        this.fetchCsrfToken().then(csrfToken => {
            document.querySelector('meta[name="csrf-token"]').setAttribute('content', csrfToken);
        });        
    }
}


customElements.define("dashboard-page", Dashboard);