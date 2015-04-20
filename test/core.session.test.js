/* jshint expr: true */

'use strict';

var chai    = require( 'chai' );
var expect  = chai.expect;
var session = require( '../' ).session();

describe( 'session', function() {

	it( 'should have a wialon object', function() {
		expect( session.wialon ).to.be.an( 'object' );
	} );

	it( 'should have _options property', function () {
		expect( session ).to.have.property( '_options' );
	} );

	describe( 'endpoint', function () {
		it( 'should have a default url', function() {
			expect( session._options.url ).to.not.exist;
			expect( session.wialon._options.url ).to.not.exist;
			expect( session.endpoint() ).to.equal( 'https://hst-api.wialon.com/wialon/ajax.html' );
		} );
	} );

	describe( 'start', function () {
		it( 'should validate credentials', function ( done ) {
			session.start( {}, function ( err, data ) {
				expect( err ).to.be.an.instanceof( Error );
				expect( err.message ).to.be.string( 'Invalid credentials' );
				done();
			} );
		} );
	} );

} );


