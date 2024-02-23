# Northcoders News API

Link to the hosted API- https://nc-news-lhwd.onrender.com


Summary and Cloning---------------------------------------------------------------


This project creates the backend API endpoints required for the functionality of a front-end website. It suitably handles all data in both a test and developer database, and then also hosts a production database through Elephant SQL and Render.

In order to clone the repository, run 'git clone https://github.com/FredR0101/nc_news.git' in the terminal. You will then have to install multiple dependencies.


Dependency Installs---------------------------------------------------------------


Install these as dev dependencies using 'npm i -D *package name goes here*'
jest
jest-extended
jest-sorted
supertest

Install these as regular dependencies using 'npm i *package name goes here*
dotenv
express
format
husky
pg
pg-format

To check these have been installed correctly, check the package.json file.


Env Variables --------------------------------------------------------------------


Creating Environment Variables: 
In order to connect to the Databases, create two .env files that look like:
 .env.test
 .env.development

Inside each of these files, add PGDATABASE= and the name of each database you are connecting to in each one. It is important to connect the 'test' database to the 
.env.test file and the development database to the development .env.development.

If you need to find the names of the databases, you will find them in the setup.sql file.


Seeding---------------------------------------------------------------------------


in order to create the databases on your system, run 'npm run setup-dbs' in the terminal.

In order to seed the databases, run 'npm run seed'.


Node.js / Postgres versions-------------------------------------------------------


The minimum versions for this to run is:

Node.js- v21.3.0   (*to check, run 'node -v' in the terminal*)
Postgres- v14.10   (*to check, open psql terminal and type 'SELECT version();'*)


Testing---------------------------------------------------------------------------

To run all .test.js files, type 'npm run test'. 