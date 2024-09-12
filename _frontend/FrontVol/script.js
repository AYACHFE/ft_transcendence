

var todash = document.querySelectorAll('.login loggin-todash');

var home = document.querySelectorAll('.home');
var dashboard = document.querySelectorAll('.dashboard');


todash.forEach(function(button) {
  button.addEventListener('click', function() {
    home.forEach(function(element) {
      element.style.display = 'none';
    });
    dashboard.forEach(function(element) {
      element.style.display = 'block';
    });
  });
});
