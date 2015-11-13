function newSectionComment {
  if [[ "$1" ]]
    then
      echo '\n'
      outputPoundLine
      echo $1
  fi
}

function outputPoundLine {
	echo "####################################"
}

function finishedSectionComment {
  echo "Finished installing $1"
  outputPoundLine
}

function installNpmGlobalPackage {
  npm list -g $1 &> /dev/null
  if [[ $? -ne 0 ]] ; then
    npm install -g $1
  fi
}

newSectionComment "Checking for and installing/updating Homebrew"
which -s brew
if [[ $? != 0 ]] ; then
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
  brew update
fi
finishedSectionComment "Homebrew"

newSectionComment "Checking for and installing MongoDB"
which -s mongod
if [[ $? != 0 ]] ; then
  brew install mongodb
else
  brew upgrade mongodb
fi
if [[ ! -d ~/.vocabtester-mongo-dev ]] ; then
  mkdir ~/.vocabtester-mongo-dev
fi
finishedSectionComment "MongoDB"

newSectionComment "Checking for and installing nvm"
if [[ -e ~/.nvm/nvm.sh ]] ; then
  source ~/.nvm/nvm.sh
fi
nvm list &> /dev/null
if [[ $? -ne 0 ]] ; then
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.1/install.sh | bash
fi
finishedSectionComment "nvm"

nvm use &> /dev/null
which -s node
installed=$?
newSectionComment "Checking for and installing Node.js"
nvm install
nvm use
if [[ $installed -ne 0 ]] ; then
  mkdir ~/npm-global
  npm config set prefix '~/npm-global'
  echo 'export PATH=~/npm-global/bin:$PATH' >> ~/.bash_profile
  source ~/.bash_profile
fi
npm install -g npm@latest
finishedSectionComment "Node.js"

newSectionComment "Installing required npm global packages"
installNpmGlobalPackage "grunt-cli"
installNpmGlobalPackage "bower"
installNpmGlobalPackage "yo"
installNpmGlobalPackage "generator-meanjs"
finishedSectionComment "global npm packages"

newSectionComment "Installing local npm packages"
npm install
finishedSectionComment "local npm packages"

grunt seed
