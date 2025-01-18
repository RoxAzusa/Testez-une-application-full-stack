# Yoga

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Start the project

Git clone:

> git clone https://github.com/RoxAzusa/Testez-une-application-full-stack.git

Go inside folder:

> cd yoga

Install dependencies:

> npm install

Launch Front-end:

> npm run start;


## Ressources


### Postman collection

For Postman import the collection

> ressources/postman/yoga.postman_collection.json 

by following the documentation: 

https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman


### MySQL

SQL script for creating the schema is available `ressources/sql/script.sql`

By default the admin account is:
- login: yoga@studio.com
- password: test!1234


## Test

### Front

#### Unitary test

Launching test:

> npm run test

for following change:

> npm run test:coverage

Report is available here:
> front/coverage/jest/lcov-report/index.html

#### E2E

Launching e2e test:

> npm run e2e

Generate coverage report (you should launch e2e test before):

> npm run e2e:coverage

Report is available here:

> front/coverage/lcov-report/index.html

### Back

#### Unitary & integration test

Launching test:

> mvn clean install

> mvn test

Report is available here:
> back/target/site/jacoco/index.html
