
'use strict';

var apis = require( './apis' );

var W = function ( opts ) {
	this._session = {};

	this.options( opts );
	this.bindAPIs( apis );
};


W.prototype.options = function ( opts ) {
	this._options = opts || {};
};


W.prototype.bindAPIs = function ( apis ) {

	for ( var api in apis ) {
		var a = function ( opts ) {
			var c = require( apis[api] );
			var o = new c( opts );
			o.wialon = this;
			return Object.freeze( o );
		};

		this[api] = a.bind( this );
	}

};


var wialon = new W();

module.exports = wialon;

