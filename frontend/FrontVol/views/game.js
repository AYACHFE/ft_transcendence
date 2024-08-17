


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
        });
    }
}

customElements.define("game-page", Game);
