# Northcoders News API

Creating Environment Variables: 
In order to connect to the Databases, create two .env files that look like:
 .env.test
 .env.development

Inside each of these files, add PGDATABASE= and the name of each database you are connecting to in each one. It is important to connect the 'test' database to the 
.env.test file and the development database to the development .env.development.

If you need to find the names of the databases, you will find them in the setup.sql file.