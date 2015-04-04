
'use strict';

var inject = function ( module ) {
	return function ( opts ) {
		var C = require( module );
		var o = new C( opts );
		o.wialon = this;
		return Object.freeze( o );
	};
};

module.exports = {
	session : inject( './core/session' ),
	search  : inject( './core/search' )
};

