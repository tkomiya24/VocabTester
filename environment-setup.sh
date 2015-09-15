function outputComment {
  if [ "$1" ]
    then
      outputPoundLine
      echo $1
      outputPoundLine
  fi
}

function outputPoundLine {
	echo "####################################"
}

function installNpmGlobalPackage {
  npm list -g $1 -g &> /dev/null
  if [ $? -ne 0 ] ; then
    npm install -g $1
  fi
}

outputComment "Checking for and installing/updating Homebrew"
which -s brew
if [[ $? != 0 ]] ; then
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
  brew update
fi

outputComment "Checking for and installing Node.js"
which -s node
if [[ $? != 0 ]] ; then
  brew install node
  mkdir ~/npm-global
  npm config set prefix '~/npm-global'
  echo 'export PATH=~/npm-global/bin:$PATH' >> ~/.bash_profile
  source ~/.bash_profile
else
  npm install -g npm@latest
fi

outputComment "Checking for and installing MongoDB"
which -s mongod
if [[ $? != 0 ]] ; then
  brew install mongodb
  sudo mkdir -p /data/db
  sudo chmod -R a+rw /data
fi

outputComment "Installing required npm global packages"
installNpmGlobalPackage "grunt-cli"
installNpmGlobalPackage "bower"
installNpmGlobalPackage "yo"
installNpmGlobalPackage "generator-meanjs"


outputComment "Installing local npm packages"
npm install

grunt seed
