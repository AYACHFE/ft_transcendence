

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
