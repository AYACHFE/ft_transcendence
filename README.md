# ft_transcendence - Multiplayer Ping-Pong Game

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technologies Used](#technologies-used)
4. [Setup Instructions](#setup-instructions)
5. [Game Play](#game-play)
6. [WebSocket Implementation](#websocket-implementation)
7. [Security](#security)
8. [License](#license)

---

## Project Overview

**ft_transcendence** is a web-based multiplayer ping-pong game built to demonstrate a full-stack web application with real-time interactivity, leveraging WebSocket connections for live gameplay. The project features user authentication, a game lobby, live multiplayer matches, and a chat application integrated within the same platform.

---

## Key Features
- **Multiplayer Mode:** Play live ping-pong matches against other online players.
- **Real-time Communication:** WebSockets ensure smooth, real-time interaction during matches and in the chat.
- **Game Lobby:** Join or create game rooms to challenge opponents.
- **User Authentication:** JWT-based login and session management.
- **Chat Application:** Integrated chat system allowing players to communicate while in-game or in the lobby.
- **Responsive Design:** The game is optimized for both desktop and mobile browsers.

---

## Technologies Used

- **Frontend:**
  - HTML5, CSS3, JavaScript (ES6+)
  
- **Backend:**
  - Python, Django
  
- **Database:**
  - PostgreSQL

- **WebSocket Communication:**
  - Django Channels for handling WebSocket connections.

- **Containerization:**
  - Docker to containerize the frontend, backend, Redis, and Nginx for production-ready deployment.
  
- **Authentication:**
  - JWT for securing WebSocket connections and API requests.

---

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:

- Docker and Docker Compose

### Running Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/ft_transcendence.git
   cd ft_transcendence
## Game Play

### Controls:
- Use the mouse or touch to move the paddle up and down.
- The game updates in real-time based on WebSocket connections between the players.

### Roles:
- The game has two roles: `host` (left paddle) and `guest` (right paddle).
- The first player to join a game becomes the `host`, while the second one becomes the `guest`.

### Scoring:
- Points are awarded when the ball passes the opponent’s paddle.
- The game ends when one player reaches the winning score (can be configured).

---

## WebSocket Implementation

WebSockets are used to maintain real-time communication between the players and the server. The ping-pong game and chat feature both utilize WebSocket connections. Below is a high-level overview:

- **Game WebSocket:**
  - Keeps track of paddle positions, ball movements, and game state.
  - The server broadcasts the game state to all connected clients in real-time.
  
- **Chat WebSocket:**
  - Enables real-time chat communication during the game.

The WebSocket connections are secured using JWT tokens to authenticate users before they can join or create a game room.

---

## Security

### Authentication:
- The application uses JWT for session management and securing WebSocket connections.

### WebSocket Security:
- All WebSocket connections are authenticated using JWT tokens to prevent unauthorized access.

### CORS:
- CORS is configured to allow requests from the appropriate origins.

### SSL:
- The project is configured to run behind Nginx with SSL (using self-signed certificates for local development).
