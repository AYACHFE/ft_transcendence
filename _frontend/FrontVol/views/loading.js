export default class Loading extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        this.innerHTML = `
            <div class="Loading">

                <h1> Loading page </h1>
            </div>
        `
    }
}

customElements.define("loading-page", Loading);