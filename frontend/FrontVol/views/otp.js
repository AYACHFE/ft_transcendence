
export default class OTP extends HTMLElement {
    constructor() {super()}
    connectedCallback() {
        fetch('./views/otp.html')
        .then(response => response.text())
        .then(data => {
            this.innerHTML = data;

            let script = document.createElement('script');
            script.src = '../script/otp_2fa.js';
            document.body.appendChild(script);
        });
    }
}

customElements.define("otp-page", OTP);