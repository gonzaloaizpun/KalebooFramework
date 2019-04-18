# Kaleboo Framework


*The way to get started is to quit talking and begin doing. (Walt Disney)*


### What?
Kaleboo framework will automatically expose ExpressJs routes based on your MySQL structure and handle them for you.


### A lot of value!
If you follow the Kaleboo Framework MySQL nomenclature, then you will get a CRUD (Create, Read, Update and Delete) without writing any line of code! Yes, a lot for free.-

  
### Assumptions.
Kaleboo Framework understands `3 types` of MySQL tables structure strategy.


**TYPE A - Relantionships whitin 2 differentes models:**


MySQL Table: `measurements`
```
mysql> select * from measurements;
+----+-----------+---------+---------+---------------------+
| id | id_metric | id_unit | amount  | created_at          |
+----+-----------+---------+---------+---------------------+
|  1 |         1 |       1 | 37.1200 | 2019-04-18 21:53:01 |
|  2 |         1 |       1 | 36.2400 | 2019-04-18 21:53:01 |
|  3 |         1 |       1 | 38.7100 | 2019-04-18 21:53:01 |
|  4 |         1 |       1 | 35.2900 | 2019-04-18 21:53:01 |
|  5 |         1 |       1 | 38.8100 | 2019-04-18 21:53:01 |
|  6 |         1 |       1 | 37.4100 | 2019-04-18 21:53:01 |
|  7 |         1 |       1 | 36.5600 | 2019-04-18 21:53:01 |
|  8 |         1 |       1 | 37.0500 | 2019-04-18 21:53:01 |
+----+-----------+---------+---------+---------------------+
8 rows in set (0.00 sec)
```


MySQL Table: `metrics`
```
mysql> select * from metrics;
+----+----------------+
| id | description    |
+----+----------------+
|  1 | humidity       |
|  2 | temperature    |
|  3 | precipitations |
|  4 | voltage        |
+----+----------------+
4 rows in set (0.01 sec)
```


MySQL Table: `units`
```
mysql> select * from units;
+----+-------------+------+
| id | description | unit |
+----+-------------+------+
|  1 | percentage  | %    |
|  2 | celsius     | Cº   |
|  3 | millivolt   | mV   |
+----+-------------+------+
3 rows in set (0.00 sec)
```


**TYPE B - Model (2-N) Dependencies:**

MySQL Table: `users`
```
mysql> select * from users;
+----+--------+---------------------+------------+
| id | active | created_at          | updated_at |
+----+--------+---------------------+------------+
|  1 |      1 | 2019-04-18 21:53:01 | NULL       |
|  2 |      1 | 2019-04-18 21:53:01 | NULL       |
|  3 |      1 | 2019-04-18 21:53:01 | NULL       |
+----+--------+---------------------+------------+
3 rows in set (0.00 sec)
```

MySQL Table: `user_permissions`
```
mysql> select * from user_permissions;
+----+---------+---------------+--------+---------------------+------------+
| id | id_user | id_permission | active | created_at          | updated_at |
+----+---------+---------------+--------+---------------------+------------+
|  1 |       1 |             1 |      1 | 2019-04-18 21:53:01 | NULL       |
|  2 |       2 |             2 |      1 | 2019-04-18 21:53:01 | NULL       |
|  3 |       3 |             3 |      1 | 2019-04-18 21:53:01 | NULL       |
|  4 |       4 |             1 |      1 | 2019-04-18 21:53:01 | NULL       |
|  5 |       5 |             3 |      1 | 2019-04-18 21:53:01 | NULL       |
|  6 |       6 |             1 |      1 | 2019-04-18 21:53:01 | NULL       |
|  7 |       7 |             3 |      1 | 2019-04-18 21:53:01 | NULL       |
+----+---------+---------------+--------+---------------------+------------+
7 rows in set (0.00 sec)
```


**TYPE C - Model (1) Dependency:**

MySQL Table: `devices`
```
mysql> select * from devices;
+----+-----------------+----------------------+-------------+---------------------+
| id | id_device_brand | id_device_screensize | description | created_at          |
+----+-----------------+----------------------+-------------+---------------------+
|  1 |               1 |                    2 | Samsung S7  | 2019-04-18 22:15:28 |
|  2 |               1 |                    1 | Samsung S8  | 2019-04-18 22:15:28 |
|  3 |               1 |                    1 | Samsung S9  | 2019-04-18 22:15:28 |
|  4 |               3 |                    1 | iPhone 8    | 2019-04-18 22:15:28 |
+----+-----------------+----------------------+-------------+---------------------+
4 rows in set (0.01 sec)
```

MySQL Table: `user_permissions`
```
mysql> select * from device_brands;
+----+-------------+---------------------+
| id | description | created_at          |
+----+-------------+---------------------+
|  1 | Samsung     | 2019-04-18 22:17:00 |
|  2 | Motorola    | 2019-04-18 22:17:00 |
|  3 | Apple       | 2019-04-18 22:17:00 |
+----+-------------+---------------------+
3 rows in set (0.00 sec)
```

MySQL Table: `user_permissions`
```
mysql> select * from device_screensizes;
+----+-------------+---------------------+
| id | description | created_at          |
+----+-------------+---------------------+
|  1 | 1440×2560   | 2019-04-18 22:17:00 |
|  2 | 750×1334    | 2019-04-18 22:17:00 |
|  3 | 720×1280    | 2019-04-18 22:17:00 |
+----+-------------+---------------------+
3 rows in set (0.01 sec)
```



### Example
Install Kaleboo Framework
```sh
$ npm i kaleboo
```

Code your 10 lines `application.js`
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

```

```

Trying to find models from mysql...

  ✔ Model attributes discovered.
  ✔ Model devices discovered.
     has 1 dependency with device_brands
     has 1 dependency with device_screensizes
  ✔ Model measurements discovered.
     has 1 external relationship with metrics
     has 1 external relationship with units
  ✔ Model metrics discovered.
  ✔ Model organizations discovered.
     has many dependencies with organization_attributes
     has many dependencies with organization_products
     has many dependencies with organization_users
  ✔ Model permissions discovered.
  ✔ Model products discovered.
  ✔ Model units discovered.
  ✔ Model users discovered.
     has many dependencies with user_attributes
     has many dependencies with user_permissions

```

```

Trying to find and assign expressJs routes...

  ✔ GET /attributes created.
  ✔ GET /attributes/:id created.
  ✔ POST /attributes created.
  ✔ DELETE /attributes/:id created.
  ✔ PUT /attributes/:id created.
  ✔ GET /devices/brands created.
  ✔ GET /devices/screensizes created.
  ✔ GET /devices created.
  ✔ GET /devices/:id created.
  ✔ POST /devices created.
  ✔ DELETE /devices/:id created.
  ✔ PUT /devices/:id created.
  ✔ GET /measurements created.
  ✔ GET /measurements/:id created.
  ✔ POST /measurements created.
  ✔ DELETE /measurements/:id created.
  ✔ PUT /measurements/:id created.
  ✔ GET /metrics created.
  ✔ GET /metrics/:id created.
  ✔ POST /metrics created.
  ✔ DELETE /metrics/:id created.
  ✔ PUT /metrics/:id created.
  ✔ GET /organizations created.
  ✔ GET /organizations/:id created.
  ✔ POST /organizations created.
  ✔ DELETE /organizations/:id created.
  ✔ PUT /organizations/:id created.
  ✔ GET /permissions created.
  ✔ GET /permissions/:id created.
  ✔ POST /permissions created.
  ✔ DELETE /permissions/:id created.
  ✔ PUT /permissions/:id created.
  ✔ GET /products created.
  ✔ GET /products/:id created.
  ✔ POST /products created.
  ✔ DELETE /products/:id created.
  ✔ PUT /products/:id created.
  ✔ GET /units created.
  ✔ GET /units/:id created.
  ✔ POST /units created.
  ✔ DELETE /units/:id created.
  ✔ PUT /units/:id created.
  ✔ GET /users created.
  ✔ GET /users/:id created.
  ✔ POST /users created.
  ✔ DELETE /users/:id created.
  ✔ PUT /users/:id created.

• Express Server started in :8000

```

### Example Files
Please, visit [Kaleboo Framework Test folder.](https://github.com/gonzaloaizpun/KalebooFramework/tree/master/test)
