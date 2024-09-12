var messages = document.querySelector('.messages-content');
var d, h, m, i = 0;
var myuser;
var userdata;
var mydata;
var socket;

fetch('http://localhost:8000/main/data/',{
    method:"get",
    credentials:"include"
})
.then(response => response.json())
.then(data => {
    mydata = data;
})

var usersDisplay = document.querySelector(".users-display");

var users = [];

var searchInput = document.querySelector('.search');
var originalUsers = [];

searchInput.addEventListener('input', function() {
    while (usersDisplay.firstChild) {
        usersDisplay.removeChild(usersDisplay.firstChild);
    }

    if (searchInput.value) {
        users = originalUsers.filter(function(user) {
            return user.name.startsWith(searchInput.value);
        });
    } else {
        users = [...originalUsers];
    }

    users.forEach(function(user) {
        var userComponent = createUserComponent(user);
        
        usersDisplay.appendChild(userComponent);
    });
});



var usersDisplay = document.querySelector('.users-display');
var searchDiv = document.getElementById('search');





fetch('http://localhost:8000/chat/users/')
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    data.forEach(user => {
        if (user.id != mydata.id)
            originalUsers.push(user);
    });
    users = [...originalUsers];
    if (users[0]?.id)
    {
        userdata = users[0].id;
        
        opensocket(mydata, userdata);
        fetchdata(socket, mydata, userdata);
    }

    
    users.forEach(function(user) {
        var userComponent = createUserComponent(user, mydata.id, user.id);

        userComponent.addEventListener('click', function() {
            
            userdata = user.id;

            opensocket(mydata, userdata);
            fetchdata(socket, mydata, userdata);
            
        });

        if (usersDisplay) {
            usersDisplay.appendChild(userComponent);
            
        }
        
    });
})
.catch(error => {
    console.log('There was a problem with the fetch operation: ' + error.message);
});

function fetchdata(socket, mydata, userdata)
{
    fetch(`http://localhost:8000/chat/chat/?myId=${mydata.id}&clickedId=${userdata}`)
    .then(response => response.json())
    .then(data => {
        var messagesContent = document.querySelector('.messages-content');
        data.forEach(message => {
            
            var newMessage = document.createElement('div');
            newMessage.textContent = message.content;
                        
            if (message.sender === mydata.id) {
                newMessage.classList.add('message', 'my-messages', 'new');
            } else {
                newMessage.classList.add('message', 'your-messages', 'new');
            }

            messagesContent.appendChild(newMessage);

            insertTime(message.time)
            
        });
        messagesContent.scrollTop = messagesContent.scrollHeight;

    });
}

// usersDisplay.addEventListener('scroll', function() {
    // if (usersDisplay.scrollTop === 0) {
        searchDiv.style.display = 'flex';
    // } else {
    //     searchDiv.style.display = 'none';
    // }
// });


function opensocket(mydata, userdata)
{
    if (socket) {
        socket.close();
    }
    // if (!socket)
    // {
        if (mydata.id > userdata)
            socket = new WebSocket(`ws://localhost:8000/ws/chat/${mydata.id}/${userdata}/`);
            
        else
            socket = new WebSocket(`ws://localhost:8000/ws/chat/${userdata}/${mydata.id}/`);
    // }
    socket.onopen = function(e) {
        console.log("socket open");
    };
    socket.onmessage = function(event) {
        var data = JSON.parse(event.data);
        var messagesContent = document.querySelector('.messages-content');
        var newMessage = document.createElement('div');
        newMessage.textContent = data.content;
        
        if (data.sender == mydata.id) {
            newMessage.classList.add('message', 'my-messages', 'new');
        } else {
            newMessage.classList.add('message', 'your-messages', 'new');
        }

        messagesContent.appendChild(newMessage);
        insertTime(data.time);
        messagesContent.scrollTop = messagesContent.scrollHeight;
    };

    socket.onerror = function(error) {
        console.error('Error:', error);
    };
}




function insertMessage() {
    var container = document.querySelector('.message-input');
    
    if (!container.value.trim())
        return;
    let datasend = {
        sender: mydata.id,
        receiver: userdata,
        content: container.value,
        time: new Date().toISOString()
    };

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(datasend));
    }

    
}

document.querySelector('.message-submit').addEventListener('click', function() {
    insertMessage();
    document.querySelector('.message-input').value = '';

});

document.querySelector('.message-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        insertMessage();
        event.target.value = '';
    }
});


function responcivefun(){
    var textChat = document.querySelector('.text-chat');
    var Chat = document.querySelector('.chat');
    if (window.matchMedia("(max-width: 375px)").matches) {
        textChat.style.display = 'flex';
        Chat.style.display = 'none';
        var userDiv = document.createElement("div");
        userDiv.className = "return";
        userDiv.addEventListener('click', function() {
            userDiv.removeChild(userDiv.firstChild);
            textChat.style.display = 'none';
            Chat.style.display = 'flex';
        });

        var img = document.createElement("img");
        img.src = "../images/backtochat2.svg";
        img.alt = "";
        userDiv.appendChild(img);

        var retur = document.querySelector(".text-chat");
        retur.prepend(userDiv);
    }
}

function createUserComponent(user,myId,clickedId) {
    var userDiv = document.createElement("div");
    userDiv.className = "user";
    var userslist = document.querySelectorAll('.user');
    if(userslist.length > 0) {
        userslist[0].classList.add('activeuser');
    }
    userDiv.addEventListener('click', function() {
        responcivefun();
        

        if (this.classList.contains('activeuser')) {
            return;
        }
        var messagesContent = document.querySelector('.messages-content');

        while (messagesContent.firstChild) {
            messagesContent.removeChild(messagesContent.firstChild);
        }


        var userslist = document.querySelectorAll('.user');
        userslist.forEach(function(user) {
            user.classList.remove('activeuser');
        });

        this.classList.add('activeuser');

    });

    
    var img = document.createElement("img");
    img.src = "../images/users/happy-1.svg";
    img.alt = "";
    userDiv.appendChild(img);

    // var userStatusDiv = document.createElement("div");
    // userStatusDiv.className = "user-status active";
    // userDiv.appendChild(userStatusDiv);


    //todo check if user in gane or not
    var userInGameDiv = document.createElement("div");
    userInGameDiv.className = "user-ingame active";
    var p = document.createElement("p");
    p.textContent = "in Game";
    userInGameDiv.appendChild(p);
    userDiv.appendChild(userInGameDiv);
    var lastsocket
    if (myId > clickedId)
        lastsocket = new WebSocket(`ws://localhost:8000/ws/lastmessage/${myId}/${clickedId}/`);
    else
    lastsocket = new WebSocket(`ws://localhost:8000/ws/lastmessage/${clickedId}/${myId}/`);
    lastsocket.onopen = function(e) {
        console.log("lastsocket open");
    };
    lastsocket.onmessage = function(event) {
        var data = JSON.parse(event.data);
        p.textContent = data.content;
    };

    lastsocket.onerror = function(error) {
        console.error('Error:', error);
    };
        
    var usernameDiv = document.createElement("div");
    usernameDiv.className = "username";
    var h1 = document.createElement("h1");
    h1.textContent = user.name;
    usernameDiv.appendChild(h1);
    var p = document.createElement("p");
    
    


    usernameDiv.appendChild(p);
    userDiv.appendChild(usernameDiv);

    return userDiv;
}




function insertTime(time) {

    var timestamp = document.createElement('div');
    timestamp.className = 'timestamp';

    var messageTime = new Date(time);
    var currentTime = new Date();

    var differenceInMinutes = (currentTime - messageTime) / (1000 * 60);

    if (differenceInMinutes < 1) {
        timestamp.textContent = "Just now";
    } else {
        var minutes = messageTime.getMinutes();
        var seconds = messageTime.getSeconds();
        timestamp.textContent = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    var lastMessage = document.querySelector('.message:last-child');
    lastMessage.appendChild(timestamp);

}




