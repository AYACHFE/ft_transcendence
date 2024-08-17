

// changing the highligth of buttons
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



function logoutRequest()
{
    fetch("http://localhost:8000/api/token/", {
        method:'post',
        credentials: 'include'
    })
    .then(data=>{
        csrftoken = data.csrfToken;
        fetch("http://localhost:8000/api/logout/", {
            method: 'post',
            credentials: 'include',
            'X-CSRFToken': csrftoken
        })
        .then(response => response.json())
        .then(data => {
            console.log("logged out ", data);
        })
        .catch(error => console.log("error", error));
    })
    
}

fetch('http://localhost:8000/main/data/',{
    method:"get",
    credentials:"include"
})
.then(response => response.json())
.then(data => {
        document.getElementById('user_name').innerHTML = data.user_name;
})


