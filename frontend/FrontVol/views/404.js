

export default class E404 extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        this.innerHTML = `

        <div class="error404">
            <div class="center">
                <h1>404 - Page Invaded!</h1>
                <h5>go back to your Home</h5>

                <a href="/" id="back-home" class="nav__link"  data-link>
                Back to Home
                </a>
            </div>
        </div>
         
        `;
        
    }
}

customElements.define("e404-page", E404);
