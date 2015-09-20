function outputComment {
  if [[ "$1" ]]
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
  if [[ $? -ne 0 ]] ; then
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

outputComment "Checking for and installing MongoDB"
which -s mongod
if [[ $? != 0 ]] ; then
  brew install mongodb
fi
if [[ ! -d ~/.vocabtester-mongo-dev ]] ; then
  mkdir ~/.vocabtester-mongo-dev
fi

outputComment "Checking for and installing Node.js"
if [[ -e ~/.nvm/nvm.sh ]] ; then
  source ~/.nvm/nvm.sh
fi
nvm list &> /dev/null
if [[ $? -ne 0 ]] ; then
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.1/install.sh | bash
  nvm install v0.12.7
  nvm use
  $installed = which -s node
  if [[ $installed != 0 ]] ; then
    mkdir ~/npm-global
    npm config set prefix '~/npm-global'
    echo 'export PATH=~/npm-global/bin:$PATH' >> ~/.bash_profile
    source ~/.bash_profile
  fi
else
  nvm install v0.12.7
  nvm use
  npm install -g npm@latest
fi

outputComment "Installing required npm global packages"
installNpmGlobalPackage "grunt-cli"
installNpmGlobalPackage "bower"
installNpmGlobalPackage "yo"
installNpmGlobalPackage "generator-meanjs"

outputComment "Installing local npm packages"
npm install

grunt seed
