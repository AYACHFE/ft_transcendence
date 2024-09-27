import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PingPongConsumer(AsyncWebsocketConsumer):
    rooms = {}  # A dictionary to track players and usernames in each room

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'pingpong_{self.room_name}'
        self.user = self.scope['user']
        self.role = None
        self.username = None

        # Initialize the room in the dictionary if it doesn't exist
        if self.room_name not in self.rooms:
            self.rooms[self.room_name] = {'players': [], 'usernames': []}

        # Add the player to the WebSocket group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Assign roles based on the number of connected players in the room
        if len(self.rooms[self.room_name]['players']) == 0:
            self.role = 'host'
            self.rooms[self.room_name]['players'].append(self.channel_name)
        elif len(self.rooms[self.room_name]['players']) == 1:
            self.role = 'guest'
            self.rooms[self.room_name]['players'].append(self.channel_name)
        else:
            # If more than 2 players try to connect, close the connection
            await self.close()
            return

        # Send a message to the client requesting the username
        await self.send(text_data=json.dumps({
            'type': 'request_username',
            'message': 'Please provide your username.'
        }))

    async def receive(self, text_data):
        data = json.loads(text_data)

        if 'username' in data:
            # Store the username when received
            self.username = data['username']
            if len(self.rooms[self.room_name]['usernames']) < 2:
                self.rooms[self.room_name]['usernames'].append(self.username)

            # Send the assigned role along with the username
            await self.send(text_data=json.dumps({
                'type': 'assign_role',
                'role': self.role,
                'username': self.username
            }))

            # Notify other players in the room about the username
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'player_joined',
                    'role': self.role,
                    'username': self.username
                }
            )
        else:
            # Handle game state updates (e.g., paddle_pos, ball_pos, score)
            paddle_pos = data.get('paddle_pos')
            ball_pos = data.get('ball_pos')
            score = data.get('score')
            role = data.get('role')

            # Broadcast the updated game state to all clients in the group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_state',
                    'role': role,
                    'paddle_pos': paddle_pos,
                    'ball_pos': ball_pos,
                    'score': score
                }
            )

    async def game_state(self, event):
        paddle_pos = event['paddle_pos']
        ball_pos = event['ball_pos']
        score = event['score']
        role = event['role']

        # Broadcast the game state to all connected clients
        await self.send(text_data=json.dumps({
            'role': role,
            'paddle_pos': paddle_pos,
            'ball_pos': ball_pos,
            'score': score
        }))

    async def player_joined(self, event):
        # Notify all clients that a player has joined with their role and username
        await self.send(text_data=json.dumps({
            'type': 'player_joined',
            'role': event['role'],
            'username': event['username']
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        # Remove the player from the room's player list
        if self.channel_name in self.rooms[self.room_name]['players']:
            idx = self.rooms[self.room_name]['players'].index(self.channel_name)
            del self.rooms[self.room_name]['players'][idx]
            del self.rooms[self.room_name]['usernames'][idx]

        # If the disconnecting player was the host, reassign the host role
        if self.role == 'host' and len(self.rooms[self.room_name]['players']) > 0:
            new_host_channel_name = self.rooms[self.room_name]['players'][0]
            new_host_username = self.rooms[self.room_name]['usernames'][0]

            # Reassign the first remaining player as the new host
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'assign_role',
                    'role': 'host',
                    'channel_name': new_host_channel_name,
                    'username': new_host_username
                }
            )

        # Clean up the room if no players are left
        if len(self.rooms[self.room_name]['players']) == 0:
            del self.rooms[self.room_name]

    async def assign_role(self, event):
        if event['channel_name'] == self.channel_name:
            # Assign the new role to the player
            await self.send(text_data=json.dumps({
                'type': 'assign_role',
                'role': event['role'],
                'username': event['username']
            }))
