/* jshint expr: true */

'use strict';

var nock    = require( 'nock' );
var expect  = require( 'chai' ).expect;
var wialon  = require( '../' )();
var session = wialon.session;


describe( 'resources/zones', function () {

	// zones object placeholder
	var zones = {};

	before( function ( done ) {
		var credentials = {
			username : 'dummy',
			password : 'pass'
		};

		var scope = nock( session.endpoint() )
			.post( '?svc=core/login' )
			.reply( 200, { eid : '0db2e9fb939253004ac36665c272dd77' } );

		session.start( credentials, function ( err, session ) {
			expect( err ).to.be.null;
			done();
		} );
	} );

	beforeEach( function () {
		zones = wialon.zones();
	} );


	it( 'should return extended zone data', function ( done ) {
		var scope = nock( session.endpoint() )
			.post( '?svc=resource/get_zone_data' )
			.replyWithFile( 200, __dirname + '/fixtures/resources.zones.data.json' );

		zones.data( 1, [ 1 ], function ( err, data ) {
			expect( data ).to.be.an.instanceof( Array );
			expect( data ).to.have.length( 1 );
			expect( data[0] ).to.have.all.keys( [
				'n', 'd', 'id', 'rid', 't', 'w', 'f', 'c', 'b', 'p', 'ct', 'mt'
			] );
			done( err );
		} );
	} );


	context( 'when returning extended zone data', function () {

		it( 'should accept a single zone id', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=resource/get_zone_data' )
				.replyWithFile( 200, __dirname + '/fixtures/resources.zones.data.json' );

			zones.data( 1, 1, function ( err, data ) {
				expect( data ).to.be.an.instanceof( Array );
				expect( data ).to.have.length( 1 );
				expect( data[0] ).to.have.all.keys( [
					'n', 'd', 'id', 'rid', 't', 'w', 'f', 'c', 'b', 'p', 'ct', 'mt'
				] );
				done( err );
			} );
		} );

	} );

} );

