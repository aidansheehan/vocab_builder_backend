## Requirements
* Node v16.13.2

## Running Backend
* Redis container running
* MongoDB container running

## Environment Variables
### Auth
* NODE_ENV - development or production
* MONGODB_USERNAME - your mongoDB instance username
* MONGODB_PASSWORD - your mongoDB instance password
* MONGODB_DATABASE_NAME - your mongoDB database name
* ACCESS_TOKEN_PRIVATE_KEY /ACCESS_TOKEN_PUBLIC KEY - please generate a set public and private RSA keys (https://travistidwell.com/jsencrypt/demo/), then encode them in base 64. The base64 strings should be set as these two environment variables respectively.

## Frontend Integration
These need to be configured for purpose but at the moment:
* /api/auth/register - register a new user
* /api/auth/login - login a user
* /api/users/me - access an individual users protected content
* /api/users - see all users content (admin only)

## Docker Compose Requirements
Before starting the server run:
````
docker compose build
````
to build and tag services.

Next, run:

```
docker compose up
```
to generate redis, mongoDB and vocab builder app containers.