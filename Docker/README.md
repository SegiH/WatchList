These are scripts that I developed that will build Docker containers for WatchList using the latest source from Github.

It will do the following:

1. Pull WatchList sources lates from GitHub. If you already have an existing directory name "Watchist" you can use `deployWatchList.sh --use-existing` to use the existing Directory.

1. Install dependencies `npm install`

1. Build WatchList `npm run build`

1. Copy files are directories to build folder (.next/standalone)

1. Build Docker container using the specified compose file.

The following variables need to set at the top of the script:

1. COMPOSE_SCRIPT - Set this to the full path to docker-compose.yml

1. DB_FILE - Set this to the full path to database.json

1. DOCKER_FILE - Set this to the full path to Dockerfile. You can use the provided one.

1. ENV_FILE - Set this to the full path to .env. Make sure to set the SECRET.