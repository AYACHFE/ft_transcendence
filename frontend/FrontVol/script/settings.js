//show data

var mydata;




fetch('http://localhost:8000/main/data/',{
    method:"get",
    credentials:"include"
})
.then(response => response.json())
.then(data => {
    mydata = data;
    var defaultpage = document.getElementById('submitdefault');
    if (defaultpage)
    {
        ensertdata(mydata);
        tcheckifdatachange(mydata);
    }
    var securitypage = document.getElementById('changepasssubmit');
    if (securitypage)
    {
        tcheckpass(mydata);

    }
    
})

var firstnameInput = document.getElementById('firstname');
var lastnameInput = document.getElementById('lastname');
var usernameInput = document.getElementById('username');
function ensertdata(mydata)
{
    console.log(mydata);
    if (mydata && mydata.first_name) {
        firstnameInput.placeholder = mydata.first_name;
    } else {
        firstnameInput.placeholder = "Enter your firstname";
    }
    if (mydata && mydata.last_name) {
        lastnameInput.placeholder = mydata.last_name;
    } else {
        lastnameInput.placeholder = "Enter your lastname";
    }
    if (mydata && mydata.username) {
        usernameInput.placeholder = mydata.username;
    } else {
        usernameInput.placeholder = "Enter your username";
    }
    
}


function tcheckpass(mydata)
{
    var form_pass = document.getElementById('changepasssubmit');

    if (form_pass)
    {

        form_pass.addEventListener('click', function(event) {
            event.preventDefault();
            var Current_password = document.getElementById('Current_password').value;
            var New_password = document.getElementById('New_password').value;
            var confirm_password = document.getElementById('confirm_password').value;
            
            
            myform = document.querySelector('.Settings_security');
            
            if (tcheckpasswordmatchi(myform ,Current_password, New_password, confirm_password))
            {
                var data = {
                    myId: mydata.id,
                    New_password: New_password,
                    Current_password: Current_password,
                };
                var jsonString = JSON.stringify(data);
                
                fetch(`http://localhost:8000/settings/changepass`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: jsonString,
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    var messageElement = document.createElement('p');

                    messageElement.className = "message good";
                    if (data.Success) {
                        messageElement.textContent = data.Success;
                        myform.prepend(messageElement);
                        setTimeout(function() {
                            myform.removeChild(messageElement);
                        }, 3000);
                    }
                    else{
                        messageElement.textContent = data.error;
                        myform.prepend(messageElement);
                        setTimeout(function() {
                            myform.removeChild(messageElement);
                        }, 3000);
                    }
                    
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }
        });
    }
}

function tcheckpasswordmatchi(myform, Current_password, New_password, confirm_password) {
    if (!Current_password || !New_password || !confirm_password)
    {
        var messageElement = document.createElement('p');

        messageElement.className = "message";

        messageElement.textContent = "entre all passwords";
        myform.prepend(messageElement);
        setTimeout(function() {
            myform.removeChild(messageElement);
        }, 3000);
        return 0;
    }
    if (New_password != confirm_password)
    {
        var messageElement = document.createElement('p');

        messageElement.className = "message";

        messageElement.textContent = "password not match";
        myform.prepend(messageElement);
        setTimeout(function() {
            myform.removeChild(messageElement);
        }, 3000);
        return 0;
    }
    return 1;
}

function tcheckifdatachange(mydata)
{
    var form = document.getElementById('submitdefault');
    if (form)
    {
        // var firstnameInput = document.getElementById('firstname');
        // var lastnameInput = document.getElementById('lastname');
        // var usernameInput = document.getElementById('username');
        form.addEventListener('click', function(event) {
            event.preventDefault();
            var firstnameValue = document.getElementById('firstname').value;
            var lastnameValue = document.getElementById('lastname').value;
            var usernameValue = document.getElementById('username').value;
            
            if (firstnameValue !== '' && firstnameValue !== firstnameInput.placeholder ||
            lastnameValue !== '' && lastnameValue !== lastnameInput.placeholder ||
            usernameValue !== '' && usernameValue !== usernameInput.placeholder) {
                somethingchanged(mydata);
            }
        });
    }

}
function somethingchanged(mydata){
    
    

    var firstnameValue = document.getElementById('firstname').value;
    var lastnameValue = document.getElementById('lastname').value;
    var usernameValue = document.getElementById('username').value;
    var data = {
        myId: mydata.id,
        first_name: firstnameValue,
        last_name: lastnameValue,
        user_name: usernameValue,
    };
    // console.log(data);
    var jsonString = JSON.stringify(data);
    
    fetch(`http://localhost:8000/settings/?myId=${mydata.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonString,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
    


















//main page

var links = document.querySelectorAll('.settings-btn');

function handleClick(e) {
    e.preventDefault();

    var mainContent = document.querySelector('.settings-main');

    while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
    }

    var newElementName = 'settings-' + this.classList[1];

    var newElement = document.createElement(newElementName);
    mainContent.appendChild(newElement);
    
}

links.forEach(function(link) {
    link.addEventListener('click', handleClick);
});

//defoult page

var images = ['1_men.svg', '2_men.svg', '3_men.svg', '4_men.svg', '5_men.svg', '6_men.svg', 'happy-1.svg', 'happy-2.svg', 'happy-3.svg', 'happy-4.svg', 'happy-5.svg', 'happy-6.svg'];

// Function to generate HTML for an image
function generateHTML(image, index) {
    var id = 'avatar' + (index + 1);
    var alt = 'Avatar ' + (index + 1);
    return `
        <div class="avatar-option">
            <input type="radio" id="${id}" name="avatar" value="${image}" hidden>
            <label for="${id}"><img src="../images/users/${image}" alt="${alt}" class="avatar-image"></label>
        </div>
    `;
}

// Generate HTML for all images
var avatar_images = images.map(generateHTML).join('\n');

var avatarchose = document.querySelector('.svg-avatar-selection');
if (avatarchose)
    avatarchose.innerHTML = avatar_images;
