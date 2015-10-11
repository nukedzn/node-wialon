/* jshint expr: true */

'use strict';

var nock    = require( 'nock' );
var chai    = require( 'chai' );
var expect  = chai.expect;
var Session = require( '../lib/token/session' );

describe( 'token/session', function() {

	// session object placeholder
	var session = {};

	beforeEach( function () {

		// create new session object
		session = new Session();

	} );


	it( 'should have _options property', function () {
		expect( session ).to.have.property( '_options' );
	} );


	context( 'when authorization params are passed into the constructor', function ( done ) {
		it( 'should create a session promise', function () {
			var sess = new Session ( {
				authz : { }
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

		var authz = {
			token : 'token',
			operateAs : 'dummy'
		};


		it( 'should validate authorization params', function ( done ) {
			session.start( {}, function ( err, data ) {
				expect( err ).to.be.an.instanceof( Error );
				expect( err.message ).to.be.string( 'Invalid authorization parameters' );
				done();
			} );
		} );

		it( 'should make a login request', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=token/login' )
				.reply( 200, { eid : 'cfdf5e9dc900991577c10e3934b6c8f0' } );

			session.start( authz, function ( err, session ) {
				expect( err ).to.be.null;
				expect( scope.isDone() ).to.be.true;
				done();
			} );
		} );

		context( 'when there is no callback', function () {
			it( 'should use the internal callback method', function ( done ) {
				var scope = nock( session.endpoint() )
					.post( '?svc=token/login' )
					.reply( 200, { eid : 'cfdf5e9dc900991577c10e3934b6c8f0' } );

				session.start( authz );
				done();
			} );
		} );

		context( 'when API credentials are incorrect', function () {
			it( 'should return an error object', function ( done ) {
				var scope = nock( session.endpoint() )
					.post( '?svc=token/login' )
					.reply( 200, { error : 8 } );

				session.start( authz, function ( err, sess ) {
					expect( err ).to.be.an.instanceof( Error );
					expect( err.message ).to.be.string( 'API error: 8' );
					done();
				} );
			} );
		} );

	} );


	describe( 'request', function () {

		it( 'should call the endpoint url', function ( done ) {
			var svc    = 'token/login';
			var scope  = nock( session.endpoint() )
				.post( '?svc=' + svc )
				.reply( 200, { error : 0 } );

			session.request( svc, {}, function ( err, data ) {
				expect( scope.isDone() ).to.be.true;
				done();
			} );
		} );

		it( 'should return API errors', function ( done ) {
			var svc    = 'token/login';
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
				.post( '?svc=token/login' )
				.reply( 200, { eid : 'cfdf5e9dc900991577c10e3934b6c8f0' } )
				.post( '?svc=dummy' )
				.reply( 200, { error : 0 } );

			var sess = new Session( {
				authz : {
					token : 'token',
					operateAs : 'dummy'
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
				var svc    = 'token/login';
				var scope  = nock( session.endpoint() )
					.post( '?svc=' + svc )
					.reply( 200, { error : 0 } );

				session.request( svc, {} );
				done();
			} );
		} );

		context( 'when failed to reach the API endpoint', function () {
			it( 'should return an error object', function ( done ) {
				var svc    = 'token/login';
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
				var svc    = 'token/login';
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

} );


