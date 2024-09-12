
export default class Chat extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        fetch('/views/chat.html')
        .then(response => response.text())
        .then(data => {
            this.innerHTML = data;

            let script = document.createElement('script');
            script.src = '../script/chat.js';
            document.body.appendChild(script);
        });
    }
}

customElements.define("chat-page", Chat);
