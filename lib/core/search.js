
'use strict';

var debug = require( 'debug' )( 'core/search' );

var Search = function ( opts ) {
	this.options( opts );
};


Search.prototype.options = function ( opts ) {
	this._options = opts || {};
};


module.exports = Search;

