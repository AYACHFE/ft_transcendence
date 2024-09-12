
function verifyOTP() {
    console.log("mehdi");
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
            if(response.redirected){
                window.location.href = response.url;
            }
            return response.json()
        })
        .then(data => {
                messageElement.textContent = data.message;
        })
    }
}
