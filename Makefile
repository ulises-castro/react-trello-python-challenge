.PHONY: init copy-example-envs build run 
init: copy-example-envs build run	
	@echo "Init done, envs examples copied and containers running"

copy-example-envs:
	cp backend/.env.example backend/.env
	cp frontend/.env.example frontend/.env

build:
	docker-compose build

run:
	docker-compose up -d

