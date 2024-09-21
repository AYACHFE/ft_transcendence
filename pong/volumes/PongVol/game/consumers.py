import json
from channels.generic.websocket import AsyncWebsocketConsumer

class  PingPongConsumer(AsyncWebsocketConsumer):

    players = []

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'pingpong_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        if len(self.players) == 0:
            role = 'host'
            self.players.append(self.channel_name)
        elif len(self.players) == 1:
            # Check if the host is still connected
            host_channel_name = self.players[0]
            if self.channel_layer.group_exists(host_channel_name):
                role = 'guest'
                self.players.append(self.channel_name)
            else:
                # The host is not connected, so this player becomes the host
                role = 'host'
                self.players[0] = self.channel_name
        else:
            # If more than 2 players try to connect, you can close the connection
            await self.close()
            return

        # Send the assigned role to the connecting player
        await self.send(text_data=json.dumps({
            'type': 'assign_role',
            'role': role
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
        # Remove player from the players list
        if self.channel_name in self.players:
            self.players.remove(self.channel_name)
    
        # If the disconnecting player is the host, assign the host role to the guest
        if self.role == 'host' and len(self.players) > 0:
            # Get the channel name of the new host
            new_host_channel_name = self.players[0]
    
            # Send a message to the new host to assign them the host role
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'assign_role',
                    'role': 'host',
                    'channel_name': new_host_channel_name
                    
                }
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        paddle_pos = data.get('paddle_pos')
        ball_pos = data.get('ball_pos')
        score = data.get('score')
        role = data.get('role')

        # Send the updated game state to all clients in the group
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

        # Broadcast the game state to all clients
        await self.send(text_data=json.dumps({
            'role': role,
            'paddle_pos': paddle_pos,
            'ball_pos': ball_pos,
            'score': score
        }))
