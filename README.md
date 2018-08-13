# declarative-db
![NpmVersion](https://img.shields.io/npm/v/declarative-db.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/declarative-db.svg?style=flat-square)
![NodeVersion](https://img.shields.io/node/v/declarative-db.svg?style=flat-square)
![GitHub](https://img.shields.io/github/license/loarca/declarative-db.svg?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/loarca/declarative-db.svg?style=flat-square&label=Stars)
![GitHub issues](https://img.shields.io/github/issues/loarca/declarative-db.svg?style=flat-square)
![GitHub closed issues](https://img.shields.io/github/issues-closed/loarca/declarative-db.svg?style=flat-square)

An easy-to-use declarative json-based database for Node

## Installation
```sh
npm install declarative-db
```

## Usage
```js
const path = require('path');
const declare = require('declarative-db');

// Declare json-based database
declare({
  filename: path.join(__dirname, './db.json'),
}).then(db => {
  // Use it as you would normally use an object (or array)
  db.users = [{
    username: 'loarca',
  }];

  // It will automatically save to disk asynchronously when appropriate
});
````

Since it's Promise based you can also use async-await
```js
const path = require('path');
const declare = require('declarative-db');

(async () => {
  // Declare json-based database
  let db = await declare({
    filename: path.join(__dirname, './db.json'),
  });

  // Use it as you would normally use an object (or array)
  db.users = [{
    username: 'loarca',
  }];

  // It will automatically save to disk asynchronously when appropriate
})();
```

You should `declare()` only once per file
and share declared objects/arrays across all modules,
as every declared object/array is... exactly that... an object/array in memory
that automatically saves to disk when appropriate

## Options
```js
{
  filename: path.join(__dirname, './db.json'),
  initialState: {},
  compression: 0,
}
```

### filename
File to store data

### initialState (default = {})
When no database file exists `initialState` is used,
it may be an object or array

### compression (default = 0)
Compression level ranging from `0` to `9`

Level `0` outputs database to readable json
```json
{
  "users": [
    {
      "username": "loarca"
    }
  ]
}
```
Levels from `1` to `9` match DEFLATE compression levels

## To do
- Documentation
- Extensive testing
- Smart scheduled saving
- Protect scheduled saving from unexpected process termination
- When `filename` option is not present, manage database in memory
