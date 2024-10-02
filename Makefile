

all: 
	sudo docker-compose up --build
down: 
	sudo docker-compose down 
re:  down all

volclean: down
	rm -rf /Users/gebruiker/Desktop/django/django/volume/*
	docker volume prune -f
	# docker volume rm $(docker volume ls -qf dangling=true)



db:
	sudo docker exec -it database sh
dj:
	sudo docker exec -it pong sh
user_api_sh:
	sudo docker exec -it userapi sh
auth:
	sudo docker exec -it authapi sh
pongg:
	sudo docker exec -it pong sh
fronten:
	sudo docker exec -it frontend sh

PHONY: all down re db dj user_api pong frontend