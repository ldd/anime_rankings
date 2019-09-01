PG_USER="worker"

## install dependencies
CURRENT_FOLDER=`pwd`
cd ~
curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update
sudo apt install -y nodejs postgresql postgresql-contrib build-essential
sudo apt install -y yarn
# for puppeteer (node package) https://github.com/GoogleChrome/puppeteer/issues/3443
sudo apt install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

#add a user for postgres
# https://askubuntu.com/questions/94060/run-adduser-non-interactively
sudo adduser --gecos '' ${PG_USER}
# change a password non-interactively on ubuntu https://obviate.io/2012/02/16/non-interactive-unattended-password-change-under-ubuntu/
echo -e "${PG_USER}:${PG_PASSWORD}" | sudo chpasswd
sudo usermod -aG sudo ${PG_USER}


# setup postgres adequately
sudo -u postgres psql -c "CREATE USER ${PG_USER} WITH PASSWORD '${PG_PASSWORD}';"
sudo -u postgres createdb worker
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"${PG_USER}\" to ${PG_USER};"

cd $CURRENT_FOLDER/scripts
# # make sure to update the systemd's postgres password
sudo sed -i -- "s|PG_PASSWORD|${PG_PASSWORD}|g; s|PG_USER|${PG_USER}|g" anime_rankings.service

# # copy systemd service and timer files
sudo cp anime_rankings.service /etc/systemd/system/anime_rankings.service
sudo chmod 644 /etc/systemd/system/anime_rankings.service

sudo cp anime_rankings.timer /etc/systemd/system/anime_rankings.timer
sudo chmod 644 /etc/systemd/system/anime_rankings.timer

# only start systemd timer
# https://askubuntu.com/questions/1083537/how-do-i-properly-install-a-systemd-timer-and-service
sudo systemctl enable anime_rankings.timer
sudo systemctl start anime_rankings.timer

cd ..
# install npm dependencies with yarn
yarn
# create neccesary tables. Runs last because it may fail if tables are already created
PGPASSWORD=${PG_PASSWORD} node creator.js
