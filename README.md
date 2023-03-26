# Vocab Builder Backend
Backend services for vocab-builder flashcard memory game generation project. 

## Requirements
* Docker and Docker Compose

## Running Backend
* Redis container running
* MongoDB container running

## Environment Variables
Create a `.env` file in the project root and set the following environment variables:
* MONGODB_USERNAME - your mongoDB instance username
* MONGODB_PASSWORD - your mongoDB instance password
* MONGODB_DATABASE_NAME - your mongoDB database name
* ACCESS_TOKEN_PRIVATE_KEY / ACCESS_TOKEN_PUBLIC KEY - please generate a set public and private RSA keys (https://travistidwell.com/jsencrypt/demo/), then encode them in base 64. The base64 strings should be set as these two environment variables respectively.
* REFRESH_TOKEN_PRIVATE_KEY / REFRESH_TOKEN_PUBLIC KEY - please generate a set public and private RSA keys (https://travistidwell.com/jsencrypt/demo/), then encode them in base 64. The base64 strings should be set as these two environment variables respectively.

## Frontend Integration
Check the API documentation hosted at `/docs` route for available endpoints and their details.

## Docker Compose Requirements
Before starting the server, run the following commands to build and run the services:

For development environment:
````
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
````

For production environment:
````
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up
````

These commands will generate Redis, MongoDB, and vocab-builder app containers.

## Documentation
Documentation is generated using
* swagger-jsdoc - Reads JSDoc annotated source code and generates an OpenAPI (Swagger) specification
* swagger-ui-express - Serves auto-generated swagger-ui API docs hosted from API server

When the vocab-builder application is running, the docs are hosted on the /docs route, eg if running locally `localhost:8000/docs`

## Authors
* **Aidan Sheehan** <aidanmsheehan@gmail.com>

## Ticketing
See [Jira Project](https://vocab-builder.atlassian.net/jira/software/projects/VBB/boards/2) to track current tickets.

## Versioning
TBD

## Contributing
If you are interested in contributing to this project, please contact the author before making any changes or submitting pull requests. You can reach out to the author via [email](mailto:aidanmsheehan@gmail.com).

Please note that this project is the author's private intellectual property and any contributions will be subject to the author's approval and licensing terms.

## License
All rights reserved. This project and its source code are the private intellectual property of the author. No part of this project may be copied, modified, distributed, or used in any manner without the explicit permission of the author.