# Movies api (Netguru recruitment task)

## Setup
Make sure that you have docker and docker-compose installed.
Create two env files based on template:

`cp .env.example .env.development && cp .env.example .env.test`

Fill in the db connection string and your OMDB API key in both of those files.

Run `./run dev` to start up the development server. At the first start the app container will build
and install all dependencies. The app should be accessible at `http://127.0.0.1:3000/`.

## Helper script
In the root directory of the project there is a file, called `run`. It is a simple bash script to
make starting the whole docker setup more convenient. It takes one parameter:
- `dev` - starts up the development docker stack,
- `test` - starts up the tests.

Before the script exists, it stops the docker stack by running `docker-compose stop`.

## Usage
### GET /movies
Query params (all optional):
  - *title* - string - title of the movie - `The Godfather`
  - *minYear* - number - min year of release - `1994`
  - *maxYear* - number - max year of realease - `1994`
  - *minRuntime* - number - min runtime in minutes - `120` 
  - *maxRuntime* - number - max runtime in minutes - `130`
  - *genre* - string - movie genre - `Drama`
  - *director* - string - movie director - `Francis Ford Coppola`
  - *actor* - string - actor - `Marlon Brando`
  - *language* - string - language - `English`
  - *country* - string - country - `USA`
  - *imdbId* - string - IMDB ID - `tt0068646`
  - *id* - string - movie ID - `5c15afd96197100a1201cc59`
  - *limit* - number, default 10, max 10 - limit per page
  - *search* - string - title search
  - *page* - number - page, starting from 0

### POST /movies
Body
  - title - string, required - movie title as in OMDB - `The Godfather`

### GET /comments
Query params (all optional)
  - *movie* - string - movie id - `5c15afd96197100a1201cc59`
  - *limit* - number - limit, default 10, max 10 - `5`
  - *page* - number - page, starting from 0 - `1`

### POST /comments
Body (all required)
  - *author* - string - comment author - min length 3, max length 100 - `Daniel Kanas`
  - *content* - string - comment content - min length 5, max length 8000 - `This is a very nice
    movie`
  - *movie* - string - movie id - `5c15afd96197100a1201cc59`

## Testing
Make sure you have set up the project correctly and then run `./run test`. A docker-compose stack, consisting
of a MongoDB container and the app container will start. After the tests finish,
the containers will be stopped.

## Thanks
[Docker](https://www.docker.com/)
[Fastify](https://www.fastify.io/)
[Mocha](https://mochajs.org/)
[Chai](https://www.chaijs.com/)
[Mongoose](https://mongoosejs.com/)
[PM2](http://pm2.keymetrics.io/)


## Live demo
An example deployment is running at `https://netguru-task.herokuapp.com`
