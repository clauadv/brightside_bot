# bs_bot [![Javascript](https://img.shields.io/badge/language-Javascript-%23f34b7d.svg)](https://en.wikipedia.org/wiki/JavaScript)

discord bot used for brightside javascript project

## notes
- brightside javascript project started on ~15 oct 2020

## requirements
* nodejs
* git
* a mysql database

## installation & configuration & starting up
```js
$ git clone https://github.com/clauadv/bs_bot.git 
$ npm install
```
* create a database with any name you want, then go to SQL tab and paste this
```sql
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `uid` int(50) NOT NULL,
  `discord` varchar(255) NOT NULL,
  `order_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```
* make sure to modify the fields in the .env file and ./utils/globals.js with yours. after you done that, you can run the script by typing
```js
$ node .\app.js
```

## authors
* **clau**

## credits
* **april for onetap-js (https://github.com/aprxl/OnetapJS)**