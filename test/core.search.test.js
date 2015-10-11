/* jshint expr: true */

'use strict';

var nock    = require( 'nock' );
var chai    = require( 'chai' );
var expect  = chai.expect;
var wialon  = require( '../' )();
var session = wialon.session;

describe( 'core/search', function () {

	// search object placeholder
	var search = {};

	before( function ( done ) {
		var authz = {
			token : 'token',
			operateAs : 'dummy'
		};

		var scope = nock( session.endpoint() )
			.post( '?svc=token/login' )
			.reply( 200, { eid : '0db2e9fb939253004ac36665c272dd77' } );

		session.start( authz )
			.then( function ( session ) {
				done();
			} )
			.catch( done );
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

			search.search( 'avl_unit', '*', 0x00000001 )
				.then( function ( data ) {
					expect( data ).to.be.an.instanceof( Array );
					expect( scope.isDone() ).to.be.true;
					done();
				} )
				.catch( done );
		} );


		context( 'when there is an error response', function () {
			it( 'should return an error object', function ( done ) {
				var scope = nock( session.endpoint() )
					.post( '?svc=core/search_items' )
					.reply( 200, { error : 4 } );

				search.search( 'avl_unit', '*', 'x' )
					.catch( function ( err ) {
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

			search.units( '*' )
				.then( function ( data ) {
					expect( data ).to.be.an.instanceof( Array );
					expect( data ).to.have.length.of.at.least( 1 );
					expect( data[0] ).to.have.all.keys( [
						'nm', 'cls', 'id', 'mu', 'uacl'
					] );
					done();
				} )
				.catch( done );
		} );
	} );


	describe( 'zones', function () {
		it( 'should return basic zone data', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=core/search_items' )
				.replyWithFile( 200, __dirname + '/fixtures/search.zones.json' );

			search.geofences( '*' )
				.then( function ( data ) {
					expect( data ).to.be.an.instanceof( Array );
					expect( data ).to.have.length.of.at.least( 1 );
					expect( data[0] ).to.have.all.keys( [
						'nm', 'cls', 'id', 'mu', 'uacl', 'zl'
					] );
					done();
				} )
				.catch( done );
		} );
	} );


	describe( 'retranslators', function () {
		it( 'should return retranslator data', function ( done ) {
			var scope = nock( session.endpoint() )
				.post( '?svc=core/search_items' )
				.replyWithFile( 200, __dirname + '/fixtures/search.retranslators.json' );

			search.retranslators( '*' )
				.then( function ( data ) {
					expect( data ).to.be.an.instanceof( Array );
					expect( data ).to.have.length.of.at.least( 1 );
					expect( data[0] ).to.have.all.keys( [
						'nm', 'cls', 'id', 'mu', 'uacl',
						'rtro', 'rtrc', 'rtru', 'rtrst'
					] );
					done();
				} )
				.catch( done );
		} );
	} );

} );


