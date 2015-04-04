
'use strict';

var debug   = require( 'debug' )( 'core/session' );
var request = require( 'request' );

var Session = function ( opts ) {
	this.options( opts );
};


Session.prototype.options = function ( opts ) {
	this._options = opts || {};
};


Session.prototype.start = function () {

};


Session.prototype.end = function () {


}


Session.prototype.dummy = function () {
	debug( 'dummy: ' + JSON.stringify( this._options ) );
	debug( this.wialon );
};


module.exports = Session;

