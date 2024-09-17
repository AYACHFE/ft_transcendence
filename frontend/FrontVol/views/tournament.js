

export default class Tournament extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
		fetch('/views/tournament.html')
        .then(response => response.text())
        .then(data => {
            this.innerHTML = data;


        });
    }
}

customElements.define("the-tournament", Tournament);
