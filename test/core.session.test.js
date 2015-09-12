/* jshint expr: true */

'use strict';

var nock    = require( 'nock' );
var chai    = require( 'chai' );
var expect  = chai.expect;
var Session = require( '../lib/core/session' );

describe( 'core/session', function() {

	// session object placeholder
	var session = {};

	beforeEach( function () {

		// create new session object
		session = new Session();

	} );


	it( 'should have _options property', function () {
		expect( session ).to.have.property( '_options' );
	} );


	context( 'when credentials are passed into the constructor', function ( done ) {
		it( 'should create a session promise', function () {
			var sess = new Session ( {
				credentials : { }
			} );

			expect( sess._session ).to.be.instanceof( Promise );
			sess._session
				.then( function () {
					done( new Error( 'session promise should have resolved with an error' ) );
				} )
				.catch( function ( e ) {
					expect( e ).to.be.instanceof( Error );
					done();
				} );
		} );
	} );


	describe( 'endpoint', function () {
		it( 'should have a default url', function() {
			expect( session._options.url ).to.not.exist;
			expect( session.endpoint() ).to.equal( 'https://hst-api.wialon.com/wialon/ajax.html' );
		} );
	} );


	describe( 'start', function () {

		var credentials = {
			username : 'dummy',
			password : 'pass'
		};


		it( 'should validate credentials', function ( done ) {
			session.start( {}, function ( err, data ) {
				expect( err ).to.be.an.instanceof( Error );
				expect( err.message ).to.be.string( 'Invalid credentials' );
				done();
			} );
		} );

		it( 'should make a login request', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=core/login' )
				.reply( 200, { eid : 'cfdf5e9dc900991577c10e3934b6c8f0' } );

			session.start( credentials, function ( err, session ) {
				expect( err ).to.be.null;
				expect( scope.isDone() ).to.be.true;
				done();
			} );
		} );

		context( 'when there is no callback', function () {
			it( 'should use the internal callback method', function ( done ) {
				var scope = nock( session.endpoint() )
					.post( '?svc=core/login' )
					.reply( 200, { eid : 'cfdf5e9dc900991577c10e3934b6c8f0' } );

				session.start( credentials );
				done();
			} );
		} );

		context( 'when API credentials are incorrect', function () {
			it( 'should return an error object', function ( done ) {
				var scope = nock( session.endpoint() )
					.post( '?svc=core/login' )
					.reply( 200, { error : 8 } );

				session.start( credentials, function ( err, sess ) {
					expect( err ).to.be.an.instanceof( Error );
					expect( err.message ).to.be.string( 'API error: 8' );
					done();
				} );
			} );
		} );

	} );


	describe( 'request', function () {

		it( 'should call the endpoint url', function ( done ) {
			var svc    = 'core/login';
			var scope  = nock( session.endpoint() )
				.post( '?svc=' + svc )
				.reply( 200, { error : 0 } );

			session.request( svc, {}, function ( err, data ) {
				expect( scope.isDone() ).to.be.true;
				done();
			} );
		} );

		it( 'should return API errors', function ( done ) {
			var svc    = 'core/login';
			var scope  = nock( session.endpoint() )
				.post( '?svc=' + svc )
				.reply( 200, { error : 8 } );

			session.request( svc, {}, function ( err, data ) {
				expect( err ).to.be.an.instanceof( Error );
				expect( err.message ).to.be.string( 'API error: 8' );
				done();
			} );
		} );

		it( 'should validate the session when not making a login request', function ( done ) {
			session.request( 'dummy', {}, function ( err, data ) {
				expect( err ).to.be.an.instanceof( Error );
				expect( err.message ).to.be.string( 'Invalid session' );
				done();
			} );
		} );

		it( 'should resolve a session promise', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=core/login' )
				.reply( 200, { eid : 'cfdf5e9dc900991577c10e3934b6c8f0' } )
				.post( '?svc=dummy' )
				.reply( 200, { error : 0 } );

			var sess = new Session( {
				credentials : {
					username : 'dummy',
					password : 'pass'
				}
			} );

			expect( sess._session ).to.be.instanceof( Promise );
			sess.request( 'dummy', {}, function ( err, data ) {
				expect( scope.isDone() ).to.be.true;
				done( err );
			} );
		} );


		context( 'when there is no callback', function () {
			it( 'should use the internal callback method', function ( done ) {
				var svc    = 'core/login';
				var scope  = nock( session.endpoint() )
					.post( '?svc=' + svc )
					.reply( 200, { error : 0 } );

				session.request( svc, {} );
				done();
			} );
		} );

		context( 'when failed to reach the API endpoint', function () {
			it( 'should return an error object', function ( done ) {
				var svc    = 'core/login';
				var scope  = nock( session.endpoint() )
					.post( '?svc=' + svc )
					.replyWithError( 'API request failed' );

				session.request( svc, {}, function ( err, data ) {
					expect( err ).to.be.an.instanceof( Error );
					expect( err.message ).to.be.string( 'API request failed' );

					// clear all nocks which seems to be needed after replyWithError()
					nock.cleanAll();
					done();
				} );
			} );
		} );

		context( 'when API response is not JSON', function () {
			it( 'should return an error object', function ( done ) {
				var svc    = 'core/login';
				var scope  = nock( session.endpoint() )
					.post( '?svc=' + svc )
					.reply( 200, 'not JSON' );

				session.request( svc, {}, function ( err, data ) {
					expect( err ).to.be.an.instanceof( SyntaxError );
					done();
				} );
			} );
		} );

	} );

	describe( 'end', function () {
		it( 'should make a logout request', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=core/logout' )
				.reply( 200, { error : 0 } );

			// session data mock
			session._session = {
				eid : 'cfdf5e9dc900991577c10e3934b6c8f0'
			};

			session.end( function ( err, data ) {
				expect( err ).to.be.null;
				expect( scope.isDone() ).to.be.true;
				done();
			} );
		} );
	} );

} );


