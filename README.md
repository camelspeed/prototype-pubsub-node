# Pub Sub Application Prototype
Demonstrates a topic drive pub/sub application using Node and RabbitMQ

## Getting Started
### Prerequisites
1. Postman
1. Docker
1. Node
1. npm
### Run App
1. `cd pub-sub-app` home of the prototype where all subsequent commands should execute from.
1. `npm i` installs all the node components
1. `npm mq:install` installs and runs the [RabbitMQ Docker](https://hub.docker.com/_/rabbitmq) container
    1. Go to `http://localhost:8080` to see if the RabbitMQ Management console shows.  Loging is `guest/guest`.  Once you start the app you'll see channels and topics created.
    1. `npm run mq:stop` to stop the container named `jllis-msg`
    1. `npm run mq:start` start the container named `jllis-msg`
1. `npm start` starts the node api service listening on port 3000

### Unit Tests
1. `npm i`
1. `npm test` runs tests without a live messaging server (tbd)

### Integration Tests
Using Postman you can see the pub/sub in action
1. Import `/integration-tests/JLLIS Messaging.postman_collection.json` collection into **Postman**
1. `/GET Get Users` will return {} until you `Create User`
1. `/POST Create User` will create a new user.  The service uses a cache so each restart all data is purged.  The key for a user is `email`.  The call will simply overwrite the user if the key exists.
1. `/GET Get History` will return {} until a user has been created.  The History service will get a message to create a history entry once a `Create User` event (i.e. Request) happens in Step #2 above.