/* jshint expr: true */

'use strict';

var nock    = require( 'nock' );
var chai    = require( 'chai' );
var expect  = chai.expect;
var wialon  = require( '../' )();
var session = wialon.session;

describe( 'search', function () {

	// search object placeholder
	var search = {};

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

		// create a new search object
		search = wialon.search();

	} );


	it( 'should have a wialon object', function() {
		expect( search.wialon ).to.be.an( 'object' );
	} );

	it( 'should have _options property', function () {
		expect( search ).to.have.property( '_options' );
	} );

	it( 'should have _params property', function () {
		expect( search ).to.have.property( '_params' );
	} );


	describe( 'search', function () {
		it( 'should make a search request', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=core/search_items' )
				.replyWithFile( 200, __dirname + '/fixtures/search.units.json' );

			search.search( 'avl_unit', '*', 0x00000001, function ( err, data ) {
				expect( err ).to.be.null;
				expect( data ).to.be.an.instanceof( Array );
				expect( scope.isDone() ).to.be.true;
				done();
			} );
		} );

		context( 'when there is no callback', function () {
			it( 'should use the internal callback method', function ( done ) {
				var scope = nock( session.endpoint() )
					.post( '?svc=core/search_items' )
					.reply( 200, { items : [] } );

				search.search( 'avl_unit', '*', 0x00000001 );
				done();
			} );
		} );

		context( 'when there is an error response', function () {
			it( 'should return an error object', function ( done ) {
				var scope = nock( session.endpoint() )
					.post( '?svc=core/search_items' )
					.reply( 200, { error : 4 } );

				search.search( 'avl_unit', '*', 'x', function ( err, data ) {
					expect( err ).to.be.an.instanceof( Error );
					expect( err.message ).to.be.string( 'API error: 4' );
					done();
				} );
			} );
		} );
	} );


	describe( 'units', function () {
		it( 'should return unit data', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=core/search_items' )
				.replyWithFile( 200, __dirname + '/fixtures/search.units.json' );

			search.units( '*', function ( err, data ) {
				expect( err ).to.be.null;
				expect( data ).to.be.an.instanceof( Array );
				expect( data ).to.have.length.of.at.least( 1 );
				expect( data[0] ).to.have.all.keys( [
					'nm', 'cls', 'id', 'mu', 'uacl'
				] );
				done();
			} );
		} );
	} );


	describe( 'geofences', function () {
		it( 'should return geofence data', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=core/search_items' )
				.replyWithFile( 200, __dirname + '/fixtures/search.geofences.json' );

			search.geofences( '*', function ( err, data ) {
				expect( err ).to.be.null;
				expect( data ).to.be.an.instanceof( Array );
				expect( data ).to.have.length.of.at.least( 1 );
				expect( data[0] ).to.have.all.keys( [
					'nm', 'cls', 'id', 'mu', 'uacl', 'zl'
				] );
				done();
			} );
		} );
	} );


	describe( 'retranslators', function () {
		it( 'should return retranslator data', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=core/search_items' )
				.replyWithFile( 200, __dirname + '/fixtures/search.retranslators.json' );

			search.retranslators( '*', function ( err, data ) {
				expect( err ).to.be.null;
				expect( data ).to.be.an.instanceof( Array );
				expect( data ).to.have.length.of.at.least( 1 );
				expect( data[0] ).to.have.all.keys( [
					'nm', 'cls', 'id', 'mu', 'uacl',
					'rtro', 'rtrc', 'rtru', 'rtrst'
				] );
				done();
			} );
		} );
	} );

} );


