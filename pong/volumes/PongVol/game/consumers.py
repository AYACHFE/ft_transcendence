import json
from channels.generic.websocket import AsyncWebsocketConsumer
from users.models import User
from asgiref.sync import sync_to_async

class PingPongConsumer(AsyncWebsocketConsumer):
    rooms = {}  # A dictionary to track players in each room

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'pingpong_{self.room_name}'
        self.username = None
        self.role = None

        # Initialize the room in the dictionary if it doesn't exist
        if self.room_name not in self.rooms:
            self.rooms[self.room_name] = []

        # Add the player to the WebSocket group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        # Assign roles based on the number of connected players in the room
        if len(self.rooms[self.room_name]) == 0:
            self.role = 'host'
            self.rooms[self.room_name].append({'channel': self.channel_name, 'username': self.scope['user'].username, 'role': 'host'})
        elif len(self.rooms[self.room_name]) == 1:
            self.role = 'guest'
            self.rooms[self.room_name].append({'channel': self.channel_name, 'username': self.scope['user'].username, 'role': 'guest'})
            #checks if the account is the same
            if self.rooms[self.room_name][0]['username'] == self.rooms[self.room_name][1]['username']:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'player_disconnected',
                        'channel_name': self.channel_name,
                    }
                )
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'start_game',
                }
            )
        else:
            # If more than 2 players try to connect, close the connection
            await self.close()
            return

        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            await self.accept()
        # Send the assigned role to the connected player
        await self.send(text_data=json.dumps({
            'type': 'assign_role',
            'role': self.role
        }))
        
        
    async def start_game(self, event):
        # Fetch usernames for host and guest
        host_user = self.rooms[self.room_name][0]['username']
        guest_user = self.rooms[self.room_name][1]['username']
        
        # Get the avatar URLs (adjust based on your user model)
        host_user_instance = await sync_to_async(User.objects.get)(username=host_user)
        host_avatar = host_user_instance.avatar.url

        guest_user_instance = await sync_to_async(User.objects.get)(username=guest_user)
        guest_avatar = guest_user_instance.avatar.url


        # Send the start_game event with usernames and avatar URLs
        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'host': {
                'username': host_user,
                'avatar': host_avatar
            },
            'guest': {
                'username': guest_user,
                'avatar': guest_avatar
            }
        }))


    async def disconnect(self, close_code):
       

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        if self.channel_name in self.rooms[self.room_name]:
            self.rooms[self.room_name].remove(self.channel_name)
        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'player_disconnected',
        #         'channel_name': self.channel_name,
        #     }
        # )

        if len(self.rooms[self.room_name]) == 0:
            del self.rooms[self.room_name]

    async def receive(self, text_data):
        data = json.loads(text_data)
        paddle_pos = data.get('paddle_pos')
        ball_pos = data.get('ball_pos')
        score = data.get('score')
        role = data.get('role')

        # Broadcast the updated game state to all clients in the group
        if (data.get('type') == 'player_disconnected'):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'player_disconnected',
                }
            )
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

    #     # Handle username setting
    #     if 'type' not in data:
    #         return
    #     if 'type' in data and data['type'] == 'set_username':
    #         self.username = data['username']  # Set the username
    #         for player in self.rooms[self.room_name]:
    #             if player['channel'] == self.channel_name:
    #                 player['username'] = self.username

    #         await self.send(text_data=json.dumps({
    #             'type': 'username_set',
    #             'username': self.username
    #         }))

    #         # Check if both players have set their usernames
    #         if len(self.rooms[self.room_name]) == 2 and all(player['username'] for player in self.rooms[self.room_name]):
    #             host = self.rooms[self.room_name][0]['username']
    #             guest = self.rooms[self.room_name][1]['username']
                
    #             # Broadcast the usernames of both players to the group
    #             await self.channel_layer.group_send(
    #                 self.room_group_name,
    #                 {
    #                     'type': 'both_usernames',
    #                     'host': host,
    #                     'guest': guest
    #                 }
    #             )



    # async def both_usernames(self, event):
    #     host = event['host']
    #     guest = event['guest']

    #     # Send both usernames to the WebSocket client
    #     await self.send(text_data=json.dumps({
    #         'type': 'both_usernames',
    #         'host': host,
    #         'guest': guest
    #     }))

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

    async def assign_role(self, event):
        if event['channel_name'] == self.channel_name:
            # Assign the new role to the player
            await self.send(text_data=json.dumps({
                'type': 'assign_role',
                'role': event['role']
            }))

    async def player_disconnected(self, event):
        # Broadcast the disconnection event to WebSocket clients
        await self.send(text_data=json.dumps({
            'type': 'player_disconnected',
        }))
