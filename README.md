node-wialon
===========

[![npm version](https://img.shields.io/npm/v/wialon.svg)](https://www.npmjs.com/package/wialon)
[![Build Status](https://travis-ci.org/nukedzn/node-wialon.svg?branch=master)](https://travis-ci.org/nukedzn/node-wialon)
[![Coverage Status](https://coveralls.io/repos/nukedzn/node-wialon/badge.svg)](https://coveralls.io/r/nukedzn/node-wialon)
[![Dependency Status](https://david-dm.org/nukedzn/node-wialon.svg)](https://david-dm.org/nukedzn/node-wialon)
[![devDependency Status](https://david-dm.org/nukedzn/node-wialon/dev-status.svg)](https://david-dm.org/nukedzn/node-wialon#info=devDependencies)

A NodeJS wrapper implementation for [Wialon Remote API](http://sdk.wialon.com/wiki/en/kit/remoteapi/remoteapi)


## Installation

``` sh
$ npm install --save wialon
```


## Usage

**Note:** From 1st of October 2015 you will need to use the new token login method. Use [this link](https://hosting.wialon.com/login.html?client_id=node-wialon&access_type=0xfff&activation_time=0&duration=0&lang=en&flags=0x1)
to generate an access token.

Initialising a session:
``` js
var wialon = require( 'wialon' );

// using session.start()
var session = wialon().session;
session.start( { token : '<access token>' } )
	.then( function ( data ) {
		console.log( data );
	} )
	.catch( function ( err ) {
		console.log( err );
	} );


// auto-initialise a session by passing in authorization parameters to the factory method
var opts = {
	// authz params
	authz : {
		token : '<access token>',
		operateAs : 'username'
	}
};

var session = wialon( opts ).session;
```

Send API requests using session object:
``` js
session.request( 'core/search_items', params )
	.then( function ( data ) {
		console.log( data );
	} )
	.catch( function ( err ) {
		console.log( err );
	} );

```

Using search helpers:
``` js
// grab a new search instance
var search = wialon( opts ).search();

// search for units
search.units( '*' )
	.then( function ( data ) {
		console.log( data );
	} )
	.catch( function ( err ) {
		console.log( err )
	} );
```

## API Documentation

JSDoc generated API documentation can be found at [http://nukedzn.github.io/node-wialon/docs/](http://nukedzn.github.io/node-wialon/docs/).


## Contributing

Contributions are welcome through GitHub pull requests ([using fork & pull model](https://help.github.com/articles/using-pull-requests/#fork--pull)).

