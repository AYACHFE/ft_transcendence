export default class OnlinePopup extends HTMLElement {
	constructor() {
	  super();
	  
	  // Create a shadow DOM
	  this.attachShadow({ mode: 'open' });
  
	  // HTML structure for the modal
	  this.shadowRoot.innerHTML = /*html*/`
		<style>
		  .modal {
			display: none;
			position: fixed;
			z-index: 1;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
		  }
  
		  .modal-content {
			background-color: #00453F;
			margin: 15% auto;
			padding: 2%;
			border-radius: 25px;
			width: 30%;
			height: auto;
			text-align: center;
			z-index: 2;
			color: #3DBDA7;
			padding-bottom: 3%;
		  }
		  input {
			padding: 10px;
			border: 1px solid #ccc;
			border-radius: 4px;
			font-size: 16px;
		  }
		  input:focus {
			outline: none; /* removes the default browser outline */
			box-shadow: 0 0 10px #9ecaed; /* adds a glow effect */
		  }
		  button {
			padding: 10px 20px;
			border: none;
			border-radius: 5px;
			background-color: #00453F;
			color: #3DBDA7;
			font-size: 1.1rem;
			cursor: pointer;
			background-color: white;
		  }
  
		  #closeBtn {
			float: right;
			cursor: pointer;
		  }
  
		  /* Add a class for blur effect on background */
		  
		  input {
			margin: 10px;
		  }
		</style>
  
		<div id="modal" class="modal">
		  <div class="modal-content">
			<span id="closeBtn">&times;</span>
			<h2>Create or Join a Room</h2>
			<button id="createRoomBtn">Create Room</button>
			<p id="roomId"></p>
			<p id="waitingMessage" style="display: none;">Waiting for a player to join the room...</p>
			<input type="text" id="joinRoomInput" placeholder="Enter Room ID to Join" />
			<button id="joinRoomBtn">Join Room</button>
			<p id="errorMessage" style="display: none;">Please enter a valid Room ID!</p>
		  </div>
		</div>
	  `;
  
	  // Variables to store room state
	  this.roomId = null; // To store the room ID after the first generation
  
	  // Get elements
	  this.modal = this.shadowRoot.querySelector('#modal');
	  this.closeBtn = this.shadowRoot.querySelector('#closeBtn');
	  this.createRoomBtn = this.shadowRoot.querySelector('#createRoomBtn');
	  this.roomIdElement = this.shadowRoot.querySelector('#roomId');
	  this.waitingMessage = this.shadowRoot.querySelector('#waitingMessage');
	  this.errorMessage = this.shadowRoot.querySelector('#errorMessage');
	  this.joinRoomBtn = this.shadowRoot.querySelector('#joinRoomBtn');
	  this.joinRoomInput = this.shadowRoot.querySelector('#joinRoomInput');
  
	  // Bind event listeners
	  this.closeBtn.addEventListener('click', this.closeModal.bind(this));
	  this.createRoomBtn.addEventListener('click', this.createRoom.bind(this));
	  this.joinRoomBtn.addEventListener('click', this.joinRoom.bind(this));
	}
  
	// Show the modal and add blur effect to background
	openModal() {
	  this.modal.style.display = 'block';
	//   document.body.classList.add('blurred-background');
	}
  
	// Close the modal and remove blur effect
	closeModal() {
	  this.modal.style.display = 'none';
	  document.body.classList.remove('blurred-background'); // Remove blur
	}
  
	createRoom() {
		if (!this.roomId) {
		  this.roomId = this.generateRoomId();
		  this.roomIdElement.textContent = `Room ID: ${this.roomId}`;
		  this.roomIdElement.style.display = 'block';
		  this.waitingMessage.style.display = 'block';

		//   setTimeout(() => {
			this.joinRoomById(this.roomId);
		//   }, 3000);
		}
	  }
	  

// Generate a random room ID
generateRoomId() {
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Handle joining the room
joinRoom() {
	const roomId = this.joinRoomInput.value;
	if (roomId) {
		this.joinRoomById(roomId);
	} else {
		this.errorMessage.style.display = 'block';
	  }
	}
  
	joinRoomById(roomId) {
	  this.closeModal();
	  let game = document.createElement('online-game-page');
	  game.setAttribute('roomid', roomId);
	//   console.log(roomId);
	  let parent = document.getElementsByClassName('center-console')[0];
	  if (parent) {
		parent.innerHTML = '';
		parent.appendChild(game);
	  }
	}
  }
  
  // Define the new element
  customElements.define('online-popup', OnlinePopup);
  