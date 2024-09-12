

export default class E404 extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        this.innerHTML = `
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <h1>404ss</h1>
            </body>
            </html>
        `;
    }
}

customElements.define("e404-page", E404);
