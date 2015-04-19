
'use strict';

var assert = require( 'assert' );
var wialon = require( '../' );

describe( 'wialon', function() {

	it( 'should have a session method', function () {
		assert.equal( typeof wialon.session, 'function' );
	} );

	it( 'should be able to create a session object', function () {
		assert.equal( typeof wialon.session(), 'object' );
	} );

	it( 'should have a search method', function () {
		assert.equal( typeof wialon.search, 'function' );
	} );

	it( 'should be able to create a search object', function () {
		assert.equal( typeof wialon.search(), 'object' );
	} );

} );

