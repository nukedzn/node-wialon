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

Send API requests using session object:
``` js
var session = require( 'wialon' )().session;

// login credentials
var credentials = {
	username : 'wialon_test',
	password : 'test'
};

// start a session
session.start( credentials, function ( err, data ) {
	console.log( data );
} );

// send a request
session.request( 'core/search_items', params, function ( err, data ) {

} );

// close session
session.end( function ( err, data ) {
	console.log( data );
} );
```


## API Documentation

JSDoc generated API documentation can be found at [http://nukedzn.github.io/node-wialon/docs/](http://nukedzn.github.io/node-wialon/docs/).


## Contributing

Contributions are welcome through GitHub pull requests ([using fork & pull model](https://help.github.com/articles/using-pull-requests/#fork--pull)).

