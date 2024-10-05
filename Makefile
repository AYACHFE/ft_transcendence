

all: createdbvol
	docker-compose up --build
down: 
	docker-compose down 

re:  down all

createdbvol:
	mkdir -p pong/volumes/DatabaseVol

PHONY: all down re 