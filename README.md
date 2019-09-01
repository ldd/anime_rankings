# Anime ranking crawler

This small collection of scripts will fetch data from [MAL](https://myanimelist.net/) every day.

The idea is to get the daily score changes for each airing show.

If you have an instance on GCP, Azure, AWS, etc, simply run

> `PG_PASSWORD=hunter2 ./scripts/setup.sh`

to install everything on your host, create a systemd service, etc.

If you only want to crawl things once, or have no need for a service:

1. `yarn`
2. `PGPASSWORD=hunter2 node creator.js`
3. `PGPASSWORD=hunter2 node crawler.js`

> Notice that the underscore from `PG_PASSWORD` is gone. This is intentional

## Other useful commands:

- check the state of systemd timers

  `systemctl list-timers`

- copy files to a GCP instance (e.g: `interceptor-01`)

  `gcloud compute scp --recurse git/anime_rankings/scripts worker@interceptor-01:~/git/anime_rankings`

- dump database

  `pg_dump -W -F t $PG_USER > dump.tar`

- restore from dump

  `pg_restore ~/backup/dump.tar -c -U $PG_USER --no-owner`
