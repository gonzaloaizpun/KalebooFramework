# Kaleboo Framework


*The way to get started is to quit talking and begin doing. (Walt Disney)*


### What?
Kaleboo framework will automatically expose ExpressJs routes for Listings and Models items by their id's followed by responses generated with the Async Framework.
  
### Assumptions?
Kaleboo Framework understands `3 types` of MySQL tables structure.


**TYPE A - Relantionships whitin 2 differentes models:**

MySQL Table: `users`
```
+----+---------------+------------------+
| id | id_department | fullname         |
+----+---------------+------------------+
|  1 |             3 | Jhon Doe         |
|  2 |             3 | Alice Hanks      |
|  3 |             1 | Ethan McDonald's |
+----+---------------+------------------+
```


MySQL Table: `departments`
```
+----+-----------+
| id | fullname  |
+----+-----------+
|  1 | Sales     |
|  2 | IT        |
|  3 | Legal     |
+----+-----------+
```


**TYPE B - Model Extensions:**

MySQL Table: `device`
```
+----+-----------+-------------------+
| id | id_device | fullname          |
+----+-----------+-------------------+
|  1 |         3 | Testing Device    |
|  2 |         3 | Alice's Device    |
|  3 |         1 | Android S7 Device |
+----+-----------+-------------------+
```

MySQL Table: `device_types`
```
+----+-----------+---------+
| id | id_device | id_type |
+----+-----------+---------+
|  1 |         3 |       3 |
|  2 |         3 |       3 |
|  3 |         1 |       1 |
+----+-----------+---------+
```

### Example
Install Kaleboo Framework
```sh
$ npm i kaleboo
```

Code your `application.js`
```js
"use strict";


// The MySQL and Express Configuration

var Config = {
  Server : {
      Port    : 8000,
      Message : `Kaleboo test application deployed.`
  },
  Database :  {
          host : 'localhost',
          user : 'myuser',
      password : 'mypassword',
      database : 'mydatabase'
  }
}

// The Express application

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
    app.use(bodyParser.json());


// The Kaleboo application

var Kaleboo = require('kaleboo');

    Kaleboo.verbose(true);
    Kaleboo.automatically(Config.Database, Config.Server, app);

```


If verbose is enabled, you will see the following output:
```
Hello! Kaleboo framework was successfully loaded.

  ✔ Model devices created.
  ✔ Model users created.
  
  ✔ GET /devices created.
  ✔ GET /devices/:id created.
  ✔ GET /users created.
  ✔ GET /users/:id created.
```