export default class Chat extends HTMLElement {
  constructor() {
    super();
    this.userdata = null;
    this.mydata = null;
    this.socket;
    this.users = [];
    this.originalUsers = [];
    // this.innerHTML = "laoding ....";
  }
  async fetchData() {
    try {
      const response = await fetch("http://localhost:8000/main/data/", {
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
        `ws://localhost:8000/ws/chat/${this.mydata.id}/${this.userdata}/`
      );
    else
      this.socket = new WebSocket(
        `ws://localhost:8000/ws/chat/${this.userdata}/${this.mydata.id}/`
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
      `http://localhost:8000/chat/chat/?myId=${this.mydata.id}&clickedId=${this.userdata}`
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

  async connectedCallback() {
    await this.fetchData();
    this.innerHTML = `
		<div class="parent" id="chatid">
			<div class="chat">
				<h1 class="chattext">Chat</h1>
				<div id="search" style="display: flex;">
					<input class="search" type="text" placeholder="Search For Friend">
				</div>
				<div class="users-display overflow-style flex-col">
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
        this.users = this.originalUsers.filter(user => user.name.startsWith(searchInput.value));
      } else {
        this.users = [...this.originalUsers];
      }
    
      this.users.forEach((user) => {
        let userComponent = createUserComponent(user, this.mydata.id, user.id);

        userComponent.addEventListener("click", async () => {
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
        const res = await fetch("http://localhost:8000/chat/users/");
        if (!res.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await res.json();

        data.forEach(
          (user) => user.id != this.mydata.id && this.originalUsers.push(user)
        );
        this.users = [...this.originalUsers];
        if (this.users[0]?.id) {
          this.userdata = this.users[0].id;
          this.socketopenfun();
          await this.getChatData();
        }

        this.users.forEach((user) => {
          let userComponent = createUserComponent(user, this.mydata.id, user.id);

          userComponent.addEventListener("click", async () => {
            this.userdata = user.id;
            this.socketopenfun();
            await this.getChatData();
          });

          if (usersDisplay) usersDisplay.appendChild(userComponent);
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

    

    document
  .querySelector(".message-submit")
  .addEventListener("click", () => {
    this.insertMessage();
    document.querySelector(".message-input").value = "";
  });

  document
  .querySelector(".message-input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      this.insertMessage();
      event.target.value = "";
    }
  });

    function createUserComponent(user, myId, clickedId) {
      var userDiv = document.createElement("div");
      userDiv.className = "user";
      var userslist = document.querySelectorAll(".user");
      if (userslist.length > 0) {
        userslist[0].classList.add("activeuser");
      }
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
        });

        this.classList.add("activeuser");
      });

      var img = document.createElement("img");
      img.src = "../images/users/happy-1.svg";
      img.alt = "";
      userDiv.appendChild(img);

      var userInGameDiv = document.createElement("div");
      userInGameDiv.className = "user-ingame active";
      var p = document.createElement("p");
      p.textContent = "in Game";
      userInGameDiv.appendChild(p);
      userDiv.appendChild(userInGameDiv);
      var lastsocket;
      if (myId > clickedId)
        lastsocket = new WebSocket(
          `ws://localhost:8000/ws/lastmessage/${myId}/${clickedId}/`
        );
      else
        lastsocket = new WebSocket(
          `ws://localhost:8000/ws/lastmessage/${clickedId}/${myId}/`
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
      h1.textContent = user.name;
      usernameDiv.appendChild(h1);
      var p = document.createElement("p");

      usernameDiv.appendChild(p);
      userDiv.appendChild(usernameDiv);

      return userDiv;
    }
  }
}

customElements.define("chat-page", Chat);
