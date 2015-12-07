#Vocab Learner

## 1. What is it?

This is a [MEAN.js] (http://meanjs.org/) webapp I've made for two reasons  
  1. To practice using the MEAN.js stack  
  2. To help myself learn Korean.

It is therefore going to be very particular to my needs and studying habits. The code will also likely be far from adhering to the professional conventions of MEAN.js and webapp developers in general. I hope that over time the latter will improve.

## 2. Installation

### 2.1 Prerequisites

  * MongoDB version 3
  * Node v0.12.7
  * XCode via the Appstore (make sure you run it at least once!)
  * The command line tools for XCode

  * Some Node global packages:
    * grunt-cli
    * bower
    * yo
    * generator-meanjs
    * jsonlint
    * jshint
    * nodemon
    * node-inspector

### 2.2 Database setup

  1. \*Make a folder called '.vocabtester-mongo-dev' in your home directory. `mkdir ~/.vocabtester-mongo-dev` on Mac OS X

 \*If you would like to use a different location for the MongoDB database, modify the Gruntfile 'shell:mongodbStart' task to use your path.  
 
### 2.3 Install process

  1. Run `npm install`  

### 2.4 Seeding the database

  1. Run `grunt seed`. Alternatively, run `node seeder.js` while MongoDB instance is active.

## 3. Running

In shell, from the root folder of this project use the command  
`grunt`  
