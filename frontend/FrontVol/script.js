
var buttons = document.querySelectorAll(".btn-option");
buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
        buttons.forEach(function(btn_rem){
            btn_rem.classList.remove("btn-highlight");
            btn_rem.classList.add('btn-simple');
        });
        this.classList.remove('btn-simple')
        this.classList.add("btn-highlight");
    });
});



function getCookie(name) {
    var cookieArr = document.cookie.split(";");

    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }

    return null;
}

function logout_post()
{

    var csrfToken = getCookie("csrf-token");
    fetch("http://localhost:8000/api/logout/", {
        method: 'post',
        credentials: 'include',
        headers:{
            'X-CSRFToken':csrfToken
        }
    })
    .then(() =>{
        window.location.href = "/login";
    })
    .catch(error => console.log("error", error));
}

fetch('http://localhost:8000/main/data/',{
    method:"get",
    credentials:"include"
})
.then(response => response.json())
.then(data => {
        document.getElementById('user_name').innerHTML = data.user_name;
})




async function fetchCsrfToken() {
    const response = await fetch('/api/csrf-token/', {
        credentials: 'include'
    });
    const data = await response.json();
    return data.csrfToken;
}

fetchCsrfToken().then(csrfToken => {
    document.querySelector('meta[name="csrf-token"]').setAttribute('content', csrfToken);
});        