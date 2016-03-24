# MSCschedulizer
[![Build Status](https://travis-ci.org/kyleladd/Chrometana.svg?branch=master)](https://travis-ci.org/mscweb/mscschedulizer)
## Installation
- ```bower install```
- ```npm install```
- Copy ```/asset/js/config.example.js``` to ```/asset/js/config.js```

- ```./node_modules/browserify/bin/cmd.js asset/js/bundleme.js -o asset/js/schedulizer_bundle.js```

-- OR --

 ```./node_modules/watchify/bin/cmd.js asset/js/bundleme.js -o asset/js/schedulizer_bundle.js -v```
 
-- OR --

```watchify -t -v browserify-shader -d -p [minifyify --no-map] asset/js/bundleme.js -o asset/js/schedulizer_bundle.js```

- ```node-qunit-phantomjs test/index.html```
- Or browse to ```/test/index.html``` within your browser

- Run jshint and qunit tests
- ``` npm test```

## Android App
- Using Cordova (Official Release coming soon) - In Beta

## Windows Desktop App
- Using Electron (Official Release coming soon) - In Beta

### Trello Board
https://trello.com/b/bNiEIopB/mscschedulizer