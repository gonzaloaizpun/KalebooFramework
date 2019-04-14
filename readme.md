# Kaleboo Framework
___

*The way to get started is to quit talking and begin doing. (Walt Disney)*


### What?
Kaleboo framework will automatically expose ExpressJs routes for Listings and Models items by their id's followed by responses generated with the Async Framework.
  
### Assumptions?
Kaleboo Framework understands only `2 types` of MySQL tables structure.


**TYPE A - Relantionships whitin 2 differentes models:**

MySQL Table: `users`
| id | id_department | fullname         |
| -  | -             | -                |
| 1  |      3        | Jhon Doe         |
| 2  |      3        | Alice Hanks      |
| 3  |      1        | Ethan McDonald's |

MySQL Table: `departments`
| id | fullname         |
| -  | -                |
| 1  | Sales            |
| 2  | IT               |
| 3  | Legal            |


**TYPE B - Model Extensions:**

MySQL Table: `device`
| id | id_device | fullname         |
| -  | -             | -                |
| 1  |      3        | Testing Device         |
| 2  |      3        | Alice's Device      |
| 3  |      1        | Android S7 Device |

MySQL Table: `device_types`
| id | id_device       | id_type    |
| -  | -             | -                |
| 1  |      1        | 3                |
| 2  |      2        | 3                |
| 3  |      3        | 1                |

### Usage
Install Kaleboo Framework
```sh
$ npm i kaleboo
```

Require the framework in your `application.js`
```js
var Kaleboo = require('kaleboo');
```

Verbose?
```js
Kaleboo.verbose(true);
```

Define your models.
```js
// Type A - Relationships whitin 2 models.
Kaleboo.model('users').with(['departments']);
// Type B - Relationships whitin 2 models. 
Kaleboo.model('device').has(['types']); // ('types' instead of 'device_types')
```

Set the MySQL configuration
```js
var config = {
        host : 'localhost',
        user : 'root',
    password : 'mypassword',
    database : 'yourproject'
}

Kaleboo.database(config);
```

Set the the ExpressJs application in order to automatically make the routes
```js
var express = require('express');

var app = express();
    app.use(bodyParser.json());
    
Kaleboo.routes(app);
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