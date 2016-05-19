# MSCschedulizer
[![Build Status](https://travis-ci.org/kyleladd/Chrometana.svg?branch=master)](https://travis-ci.org/mscweb/mscschedulizer)
## Installation
- npm run-script build

- Copy ```/asset/js/config.example.js``` to ```/asset/js/config.js``` and configure

- Execute:

- ```./node_modules/browserify/bin/cmd.js asset/js/bundleme.js -o asset/js/schedulizer_bundle.js```

-- OR --

 ```./node_modules/watchify/bin/cmd.js asset/js/bundleme.js -o asset/js/schedulizer_bundle.js -v```

-- OR (For development) --

```watchify -t -v browserify-shader -d -p [minifyify --no-map] asset/js/bundleme.js -o asset/js/schedulizer_bundle.js```

-- OR (For development - preferred) --

```grunt dev```

## Tests

- ```node-qunit-phantomjs test/index.html```
- Or browse to ```/test/index.html``` within your browser

- Run jshint and qunit tests
- ``` npm test```

## Android App
- [https://play.google.com/store/apps/details?id=us.kyleladd.mscschedulizer](https://play.google.com/store/apps/details?id=us.kyleladd.mscschedulizer)

## Windows Desktop App
- Using Electron (Official Release coming soon) - In Beta

### Trello Board
https://trello.com/b/bNiEIopB/mscschedulizer