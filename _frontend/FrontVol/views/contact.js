

export default class Contact extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        this.innerHTML = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="../style/contact.css">
        </head>
        <body>
            <h1>contact</h1>
        </body>
        </html>
        `;
    }
}

customElements.define("contact-page", Contact);
