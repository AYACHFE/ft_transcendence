

export default class Tournament extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
		fetch('/views/tournament.html')
        .then(response => response.text())
        .then(data => {
            this.innerHTML = data;


        });
		var script = document.createElement('script');
		script.src = '../script/tournament.js';
		document.head.appendChild(script);
    }
}

customElements.define("the-tournament", Tournament);
