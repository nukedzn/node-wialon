
'use strict';

var inject = function ( module ) {
	return function ( opts ) {
		var c = require( module );
		var o = new c( opts );
		o.wialon = this;
		return Object.freeze( o );
	};
};

module.exports = {
	session : inject( './core/session' ),
	search  : inject( './core/search' )
};

