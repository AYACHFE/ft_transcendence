export default class Chat extends HTMLElement {
  constructor() {
    super();
    this.userdata = null;
    this.mydata = null;
    this.socket;
    this.users = [];
    this.originalUsers = [];
    this.roomId = null;
    this.innerHTML = "<loading-page></loading-page>";
  }
  async fetchData() {
    try {
      const response = await fetch("/api/main/data/", {
        method: "get",
        credentials: "include",
      });
      this.mydata = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  socketopenfun() {
    if (this.socket) {
      this.socket.close();
    }

    if (this.mydata.id > this.userdata)
      this.socket = new WebSocket(
        `wss://localhost:8443/ws/chat/${this.mydata.id}/${this.userdata}/`
      );
    else
      this.socket = new WebSocket(
        `wss://localhost:8443/ws/chat/${this.userdata}/${this.mydata.id}/`
      );
    this.socket.onopen = function (e) {
      console.log("socket open");
    };

    this.socket.onmessage = (event) => {
      var data = JSON.parse(event.data);
      var messagesContent = document.querySelector(".messages-content");
      var newMessage = document.createElement("div");
      newMessage.textContent = data.content;
      if (data.sender == this.mydata.id) {
        newMessage.classList.add("message", "my-messages", "new");
      } else {
        newMessage.classList.add("message", "your-messages", "new");
      }

      messagesContent.appendChild(newMessage);
      this.insertTime(data.time);
      messagesContent.scrollTop = messagesContent.scrollHeight;
    };

    this.socket.onerror = function (error) {
      console.error("Error:", error);
    };
  }

  insertTime(time) {
    var timestamp = document.createElement("div");
    timestamp.className = "timestamp";

    var messageTime = new Date(time);
    var currentTime = new Date();

    var differenceInMinutes = (currentTime - messageTime) / (1000 * 60);

    if (differenceInMinutes < 1) {
      timestamp.textContent = "Just now";
    } else {
      var minutes = messageTime.getMinutes();
      var seconds = messageTime.getSeconds();
      timestamp.textContent =
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    var lastMessage = document.querySelector(".message:last-child");
    lastMessage.appendChild(timestamp);
  }
  async getChatData() {
    const res = await fetch(
      `/api/chat/?myId=${this.mydata.id}&clickedId=${this.userdata}`
    );
    const data = await res.json();
    var messagesContent = document.querySelector(".messages-content");
    data.forEach((message) => {
      var newMessage = document.createElement("div");
      newMessage.textContent = message.content;

      if (message.sender === this.mydata.id) {
        newMessage.classList.add("message", "my-messages", "new");
      } else {
        newMessage.classList.add("message", "your-messages", "new");
      }
      messagesContent.appendChild(newMessage);
      this.insertTime(message.time);
    });
    messagesContent.scrollTop = messagesContent.scrollHeight;
  }

  insertMessage() {
    var container = document.querySelector(".message-input");

    if (!container.value.trim()) return;

    let datasend = {
      sender: this.mydata.id,
      receiver: this.userdata,
      content: container.value,
      time: new Date().toISOString(),
    };

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(datasend));
    }
  }

  btnhighlightfun(){
      document.querySelectorAll('.btn-highlight').forEach(el => {
        el.classList.remove('btn-highlight');
    });

    const chatButton = document.getElementById('chatbtn');

    if (chatButton) {
        chatButton.classList.add('btn-highlight');
    }
  }
  
  async createRoom() {
		if (!this.roomId) {
			this.roomId = this.generateRoomId();
	
			// Create room in the backend
			const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrf-token')).split('=')[1];
			const response = await fetch('/api/game/create-room/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken':csrftoken, 
				},
				body: JSON.stringify({ room_id: this.roomId })
			});
	
			if (response.ok) {
					this.joinRoomById(this.roomId);
			} else {
				console.log("Error creating room");
			}
		}
	}
	

	// Generate a random room ID
	generateRoomId() {
		return Math.random().toString(36).substring(2, 8).toUpperCase();
	}
  joinRoomById(roomId) {
		let game = document.createElement('online-game-page');
		game.setAttribute('roomid', roomId);

		let parent = document.getElementsByClassName('center-console')[0];
		if (parent) {
			parent.innerHTML = '';
			parent.appendChild(game);
		}
	}

  async connectedCallback() {

 this.btnhighlightfun();
       
    await this.fetchData();
    this.innerHTML = `
		<div class="parent" id="chatid">
			<div class="chat">
				<h1 class="chattext">Chat</h1>
				<div id="search" style="display: flex;">
					<input class="search" type="text" placeholder="Search For Friend">
				</div>
				<div class="users-display overflow-style">
				</div>
			</div>
			<div class="text-chat ">
				
				<div class="messages">
					<div class="triangle-1"></div>
					<div class="messages-content"></div>
				</div>
				<div class="message-box">
					<textarea type="text" class="message-input"></textarea>
					<button type="submit" class="message-submit">
						<img src="../images/send-2.svg" alt="">
					</button>
          <button type="submit" class="send_to_play">
						<img src="../images/online-controller.svg" alt="">
					</button>
				</div>
			</div>
		</div>
		`;

    let usersDisplay = document.querySelector(".users-display");

    let searchInput = document.querySelector(".search");

    searchInput.addEventListener("input", () => {
      while (usersDisplay.firstChild) {
        usersDisplay.removeChild(usersDisplay.firstChild);
      }

      if (searchInput.value) {
        this.users = this.originalUsers.filter((user) =>
          user.username.startsWith(searchInput.value)
        );
      } else {
        this.users = [...this.originalUsers];
      }
      this.userdata = null;

      this.users.forEach((user) => {
        let userComponent = createUserComponent(user, this.mydata.id, user.id);
        
        userComponent.addEventListener("click", async () => {
          if (this.userdata == user.id) {
            console.log("already active");
            return;
          }
          this.userdata = user.id;
          this.socketopenfun();
          await this.getChatData();
        });

        if (usersDisplay) usersDisplay.appendChild(userComponent);
      });
    });

    var searchDiv = document.getElementById("search");

    const getUsers = async () => {
      try {
        const res = await fetch("/api/chat/users/");
        if (!res.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await res.json();

        data.forEach(
          (user) => user.id != this.mydata.id && this.originalUsers.push(user)
        );
        this.users = [...this.originalUsers];
        // if (this.users[0]?.id) {
        //   // this.userdata = this.users[0].id;
        //   // this.socketopenfun();
        //   // await this.getChatData();
        // }
        
        this.users.forEach((user) => {
          let userComponent = createUserComponent(user,this.mydata.id,user.id);
            if (user == this.users[0]) {
              userComponent.classList.add("activeuser");
              userComponent.querySelector(".dots_block").style.display = "block";
              this.userdata = user.id;
              this.socketopenfun();
              this.getChatData();
            }

          userComponent.addEventListener("click", async () => {
            if (this.userdata == user.id) {
              console.log("already active");
              return;
            }
            this.userdata = user.id;
            this.socketopenfun();
            await this.getChatData();
            
          });

          if (usersDisplay) 
            usersDisplay.appendChild(userComponent);
        });
      } catch (err) {
        console.log(
          "There was a problem with the fetch operation: " + err.message
        );
      }
    };

    await getUsers();

    usersDisplay.addEventListener("scroll", function () {
      if (usersDisplay.scrollTop === 0) {
        searchDiv.style.display = "flex";
      } else {
        searchDiv.style.display = "none";
      }
    });

    document.querySelector(".message-submit").addEventListener("click", () => {
      this.insertMessage();
      document.querySelector(".message-input").value = "";
    });
    document.querySelector(".send_to_play").addEventListener("click", () => {
      console.log("send to play");


      this.createRoom();
      

      let datasend = {
        sender: this.mydata.id,
        receiver: this.userdata,
        content: this.roomId,
        time: new Date().toISOString(),
      };

      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(datasend));
      }






    });
    

    document.querySelector(".message-input").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          this.insertMessage();
          event.target.value = "";
        }
    });

    function createUserComponent(user, myId, clickedId) {
      var userDiv = document.createElement("div");
      userDiv.className = "user";
    
      // Event Listener for Active User
      userDiv.addEventListener("click", function () {
        if (this.classList.contains("activeuser")) {
          return;
        }
    
        var messagesContent = document.querySelector(".messages-content");
        while (messagesContent.firstChild) {
          messagesContent.removeChild(messagesContent.firstChild);
        }

        var userslist = document.querySelectorAll(".user");
        userslist.forEach(function (user) {
          user.classList.remove("activeuser");
          const dots_block = user.querySelector(".dots_block");
          if (dots_block) {
            dots_block.style.display = "none";
          }
          const button_div = user.querySelector(".button_div");
          if (button_div) {
            button_div.style.display = "none";
          }
        });
    
        this.classList.add("activeuser");
        const dots_block = this.querySelector(".dots_block");
          if (dots_block) {
            dots_block.style.display = "block";
          }
      });
    
      var img = document.createElement("img");
      img.src = "../images/users/happy-1.svg";
      img.alt = "";
      userDiv.appendChild(img);
    
      var p = document.createElement("p");

    
      // Handle WebSocket for last message
      var lastsocket;
      if (myId > clickedId)
        lastsocket = new WebSocket(
          `wss://localhost:8443/ws/lastmessage/${myId}/${clickedId}/`
        );
      else
        lastsocket = new WebSocket(
          `wss://localhost:8443/ws/lastmessage/${clickedId}/${myId}/`
        );
    
      lastsocket.onopen = function (e) {
        console.log("lastsocket open");
      };
      lastsocket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        p.textContent = data.content;
      };
    
      lastsocket.onerror = function (error) {
        console.error("Error:", error);
      };
    
      var usernameDiv = document.createElement("div");
      usernameDiv.className = "username";
      var h1 = document.createElement("h1");
      h1.textContent = user.username;
      usernameDiv.appendChild(h1);
    
      // Add Dots and Delete Button logic
      let dotsDiv, deleteButton;
    
      dotsDiv = document.createElement("div");
      dotsDiv.className = "dots_block";
      dotsDiv.style.cursor = "pointer";
      dotsDiv.innerText = "...";
      dotsDiv.style.display = "none";
      dotsDiv.style.float = "right";
    
      // Create the delete button

      let buttonDiv = document.createElement("div");
      buttonDiv.className = "button_div";
      buttonDiv.style.display = "none";

      deleteButton = document.createElement("button");
      deleteButton.className = "block_button";
      deleteButton.innerText = "block";
      deleteButton.style.display = "block";

      let profileButton = document.createElement("button");
      profileButton.className = "profile_button";
      profileButton.innerText = "profile";
      profileButton.style.display = "block";

      buttonDiv.appendChild(deleteButton);
      buttonDiv.appendChild(profileButton);
      // deleteButton.style.display = "none"; 
    
      deleteButton.onclick = function () {
        blockusersfun();
      };
      profileButton.onclick = function () {
        showprofileuser(user);
      };
    
      // Add an event listener to the dots div to toggle the delete button
      dotsDiv.addEventListener("click", function (event) {
    
        if (userDiv.classList.contains("activeuser")) {
          if (buttonDiv.style.display === "none") {
            buttonDiv.style.display = "block";
          } else {
            buttonDiv.style.display = "none";
          }
        } else {
          var userslist = document.querySelectorAll(".user");
          userslist.forEach(function (user) {
            user.classList.remove("activeuser");
            const button_div = user.querySelector(".button_div");
            if (button_div) {
              button_div.style.display = "none";
            }
            const dots_block = user.querySelector(".dots_block");
            if (dots_block) {
              dots_block.style.display = "none";
            }
          });

        }
      });
    
      // Append the dots div and the delete button to the user component
      userDiv.appendChild(dotsDiv);
      userDiv.appendChild(buttonDiv);
    
      usernameDiv.appendChild(p);
      userDiv.appendChild(usernameDiv);
    
      return userDiv;
    }
    
    function showprofileuser(user) {
      console.log("prifile function");
      // document.querySelector("#chatid").innerHTML = `<profile-page user=${this.userdata}></profile-page>`;
      // document.querySelector("#chatid").style.display = "none";
      var profilepage = new ProfilePage();
      profilepage.setAttribute("user", JSON.stringify(user));
      document.querySelector("chat-page").appendChild(profilepage);
    }
      
    function blockusersfun() {
      console.log("block function");
    }
    
    
  }
  disconnectedCallback()  {
    console.log("disconnect");
    this.socket.close();
  }
}


class ProfilePage extends HTMLElement {
	constructor() {
	  super();
	  this.user = null;
    this.closeBtn = null;
    this.modal;
    this.innerHTML = `<loading-page></loading-page>`

	}
  openModal() {
	  this.modal.style.display = 'block';
    console.log("openmodal");
	//   document.body.classList.add('blurred-background');
	}
  
	// Close the modal and remove blur effect
	closeModal() {
	  this.modal.style.display = 'none';
	  document.body.classList.remove('blurred-background'); // Remove blur
	}
  connectedCallback(){
    // this.attachShadow({ mode: 'open' });

    this.user = JSON.parse(this.getAttribute("user")); 
      let firstname = this.user.firstname;
      let lastname = this.user.lastname;
      let username = this.user.username;

      if (!firstname) {
        firstname = "firstname";
      }
      if (!lastname) {
        lastname = "lastname";
      }
      if (!username) {
        username = "username";
      }
    this.innerHTML = /*html*/`
    
    
        <div id="profile" class="profile-container">
        <div class="modal-content">
          <span id="closeBtn">&times;</span>
          <div class="profile-image">
              <img src="../images/users/happy-1.svg" alt="Profile Photo" />
          </div>
          <div class="profile-details">
              <div class="name">
                  <h2 id="user-firstname">${firstname}</h2>
                  <h2 id="user-lastname">${lastname}</h2>
              </div>
              <p id="username">@${username}</p>
          </div>
          </div>
      </div>
    `;
    

    this.modal = document.querySelector('#profile');
    this.closeBtn = document.querySelector('#closeBtn');

    this.openModal();
    this.closeBtn.onclick = this.closeModal.bind(this);
    document.onclick = event => {
      if (event.target == this.modal) {
          this.closeModal();
      }
  };
  }
	
  }

customElements.define("profile-page", ProfilePage);
customElements.define("chat-page", Chat);
