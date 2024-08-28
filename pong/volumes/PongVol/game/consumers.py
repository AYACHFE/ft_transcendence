# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PingPongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'pingpong_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        paddle_pos = data.get('paddle_pos')
        ball_pos = data.get('ball_pos')
        score = data.get('score')

        # Send the updated game state to all clients in the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_state',
                'paddle_pos': paddle_pos,
                'ball_pos': ball_pos,
                'score': score
            }
        )

    async def game_state(self, event):
        paddle_pos = event['paddle_pos']
        ball_pos = event['ball_pos']
        score = event['score']

        await self.send(text_data=json.dumps({
            'paddle_pos': paddle_pos,
            'ball_pos': ball_pos,
            'score': score
        }))
