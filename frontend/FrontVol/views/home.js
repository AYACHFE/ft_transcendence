
export default class Home extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        this.innerHTML = `
                <html>
                <head>
                    <link rel="stylesheet" href="../style/style.css">
                </head>
                <body>
                    <header>
                        <img class="logo" src="../images/SVGRepo_iconCarrier.svg" alt="">
                        <div class="header-right">
                            <a href="/">Home</a>
                            <a   href="#about">About</a>
                            <a  href="/dashboard" class="nav__link" data-link>Contact</a>
                            <a href="/login" class="nav__link" data-link>login</a>
                        </div>
                    </header>
                    <div class="center">
                        <div class="first">
                            <div class="login">
                                <h1>PingPongParadise</h1>
                                <h3>Play it now</h3>
                                <a href="/login" class="nav__link" data-link >Login</a>
                            </div>
                            <div class="image">
                                <img src="../images/OBJECTS.svg" alt="" srcset="">
                            </div>
                        </div>
                        <div class="second">
                            <div class="login">
                                <h1>Know Us More</h1>
                                
                                <p>Hi , were <span>Aymane</span>, <span>Mehdi</span> and <span>rachid</span> and we are <br>
                                    software engineering students at 1337 coding school<br>
                                     and this is our projects.</p>
                                <div class="botton">
                                    <button id="one">About Us</button>
                                    <button id="two">Contact</button>
                                </div>
                            </div>
                        </div>
                        <div class="tree" id="about">
                            <div class="login">
                                <h1>About us</h1>
                                <h3>Welcome to PingPongPalace, where we've redefined the <br>game of ping pong for the digital age. Founded by a <br>passionate group of friends – Aachfenn, Eboulhou, and <br>Rennatiq – our platform offers a unique blend of <br>technology and ping pong excitement. Using cutting-<br>edge tech like Django and PostgreSQL, we've built a <br>seamless and intuitive experience for players of all <br>levels. With a commitment to performance and <br>reliability, we've embraced a microservices architecture <br>to ensure smooth gameplay and easy scalability. <br>Whether you're a seasoned pro or a newcomer, there's a <br>place for you on our virtual court. Join us today and <br>experience ping pong like never before!</h3>
                            </div>
                            <div class="image">
                                <img src="../images/tennis.svg" alt="" srcset="">
                            </div>
                        </div>
                        <div class="four">
                            <div class="login">
                                <h1>Let’s Work Together</h1>
                                <div class="our_image">
                                    <img src="../images/aymane.svg" alt="" srcset="">
                                    <img src="../images/mehdi.svg" alt="" srcset="">
                                    <img src="../images/rachid.svg" alt="" srcset="">
                                </div>
                                <div class="lien">
                                    <div>
                                        <h3>Aymane</h3>
                                        <div>
                                            <a href="https://github.com/ennatiqi"><img src="../images/github.svg" alt="" srcset=""></a>
                                            <a href=""><img src="../images/linkedin-svgrepo-com (1) 3.png" alt="" srcset=""></a>
                                        </div>
                                    </div>
                                    <div>
                                        <h3>Mehdi</h3>
                                        <div>
                                            <a href=""><img src="../images/github.svg" alt="" srcset=""></a>
                                            <a href=""><img src="../images/linkedin-svgrepo-com (1) 3.png" alt="" srcset=""></a>
                                        </div>
                                    </div>
                                    <div>
                                        <h3>Rachid</h3>
                                        <div>
                                            <a href=""><img src="../images/github.svg" alt="" srcset=""></a>
                                            <a href=""><img src="../images/linkedin-svgrepo-com (1) 3.png" alt="" srcset=""></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
        `;
    }
}

customElements.define("home-page", Home);
