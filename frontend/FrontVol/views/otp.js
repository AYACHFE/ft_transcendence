export default class OTP extends HTMLElement {
    constructor() {super()}
    verifyOTP() {
        const otp = document.getElementById('otpInput').value;
        const messageElement = document.getElementById('message');
        
        if (otp.length !== 6) {
            messageElement.textContent = "Please enter a valid 6-digit OTP.";
            messageElement.style.color = "red";
        } else {
            
            const formdata = new FormData();
            formdata.append('otp', otp)
    
            const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
            fetch('/api/otp/confirm', {
                method: 'POST',
                headers:{
                    'X-CSRFToken':csrftoken,
                },
                body:formdata
            })
            .then(response => {
                    if(response.status === 200)
                    {
                        let btn = document.querySelector(".redirection-a");
                        btn.click();
                    }
                return response.json()
            })
            .then(data => {
                messageElement.textContent = data.message;
            })
        }
    }
    connectedCallback() {
        this.innerHTML= /*html */`
        <div class="otp-container">
            <div class="otp-div">
                <h1 style="color:white;">Enter OTP</h1>
                <input class="otp-input" type="text" id="otpInput" placeholder="Enter OTP" maxlength="6">
                <button  class="verify-otp-btn">Submit OTP</button>
                <a class="redirection-a" href="/dashboard" data-link hidden></a>
                <div class="message" id="message"></div>
            </div>
        </div>
        `;
        let verifyBtn = document.querySelector(".verify-otp-btn")
        verifyBtn.addEventListener("click", this.verifyOTP)

    }
}

customElements.define("otp-page", OTP);