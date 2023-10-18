init:
	docker network create app-network

build:
	docker-compose build $(app)

start:
	docker-compose up -d $(app)

restart:
	docker-compose stop $(app)
	docker-compose up -d $(app)

stop:
	docker-compose stop $(app)

remove:
	docker-compose stop $(app)
	docker-compose rm $(app)

build-production:
	docker-compose -f docker-compose.prod.yml build $(app)

start-production:
	docker-compose -f docker-compose.prod.yml up -d $(app)

restart-production:
	docker-compose -f docker-compose.prod.yml stop $(app)
	docker-compose -f docker-compose.prod.yml up -d $(app)

stop-production:
	docker-compose -f docker-compose.prod.yml stop $(app)

remove-production:
	docker-compose -f docker-compose.prod.yml stop $(app)
	docker-compose -f docker-compose.prod.yml rm $(app)
