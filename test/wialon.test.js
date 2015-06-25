/* jshint expr: true */

'use strict';

var chai    = require( 'chai' );
var expect  = chai.expect;
var nock    = require( 'nock' );
var wialon  = require( '../' );
var Session = require( '../lib/core/session' );

describe( 'wialon', function() {

	context( 'when not passing any args to factory method', function () {

		var w = wialon();

		it( 'should have _options property', function () {
			expect( w ).to.have.property( '_options' );
		} );

		it( 'should have a session object', function () {
			expect( w.session ).to.be.an( 'object' );
			expect( w.session ).to.be.an.instanceof( Session );
		} );

		it( 'should have a search method', function () {
			expect( w.search ).to.be.a( 'function' );
		} );

		it( 'should be able to create a search object', function () {
			expect( w.search() ).to.be.an( 'object' );
		} );
	} );


	context( 'when passing credentials as args to factory method', function () {

		it( 'should initialise a session', function ( done ) {

			// mock API endpoints
			var sess  = new Session();
			var scope = nock( sess.endpoint() )
				.post( '?svc=core/login' )
				.reply( 200, { eid : 'cfdf5e9dc900991577c10e3934b6c8f0' } );

			// initialise using the factory method
			var w = wialon( {
				credentials : {
					username : 'dummy',
					password : 'pass'
				}
			} );

			expect( w.session._session ).to.be.an.instanceof( Promise );
			w.session._session.then( function () {
				expect( scope.isDone() ).to.be.true;
				done();
			} ).catch( done );

		} );

	} );

} );

