search123
=========

Node module for the search123 API

# Install

```bash
npm install search123
```

# Usage

```js
var search123 = require('search123');

var options = {};

search123(options)
	.then(function (results) {
		console.log(results);
	},
	function (error) {
		throw error;
	})
```

# Options

A model for the options can be found at `lib/parameters`.