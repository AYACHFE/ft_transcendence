// Select all contenteditable elements
var elements = document.querySelectorAll('[contenteditable]');

// Loop over the elements and add an input event listener to each one
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('input', function() {
        // Get the user input
        var userInput = this.innerText;

        // Do something with the user input
        console.log(userInput);
    });
}