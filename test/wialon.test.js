
'use strict';

var chai   = require( 'chai' );
var expect = chai.expect;
var wialon = require( '../' );

describe( 'wialon', function() {

	it( 'should have _options property', function () {
		expect( wialon ).to.have.property( '_options' );
	} );

	it( 'should have a session method', function () {
		expect( wialon.session ).to.be.a( 'function' );
	} );

	it( 'should be able to create a session object', function () {
		expect( wialon.session() ).to.be.an( 'object' );
	} );

	it( 'should have a search method', function () {
		expect( wialon.search ).to.be.a( 'function' );
	} );

	it( 'should be able to create a search object', function () {
		expect( wialon.search() ).to.be.an( 'object' );
	} );

} );

