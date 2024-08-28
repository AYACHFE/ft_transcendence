

all: 
	docker-compose up --build
down: 
	docker-compose down 
re:  down all

volclean: down
	rm -rf /Users/rennatiq/Desktop/django/django/volume/*
	docker volume prune -f
	# docker volume rm $(docker volume ls -qf dangling=true)



db:
	docker exec -it database sh
dj:
	docker exec -it pong sh
user_api_sh:
	docker exec -it userapi sh
auth:
	docker exec -it authapi sh
pongg:
	docker exec -it pong sh
fronten:
	docker exec -it frontend sh

PHONY: all down re db dj user_api pong frontend