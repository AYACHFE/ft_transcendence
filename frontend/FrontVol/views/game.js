


export default class Game extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        fetch('/views/game.html')
        .then(response => response.text())
        .then(data => {
            this.innerHTML = data;

            let script = document.createElement('script');
            script.src = '../script/game.js';
            document.body.appendChild(script);

			// fetch('http://localhost:8000/main/data/', 
			// {
			// 	method: "get",
			// 	credentials: "include"
			// })
			// .then(response => response.json())
			// .then(data => {
			// 	// document.getElementsByClassName('user-1-name')[0].innerHTML = data.user_name;
			// })
        });
    }
}

customElements.define("game-page", Game);
