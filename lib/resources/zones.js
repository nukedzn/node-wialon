
'use strict';

var debug = require( 'debug' )( 'wialon:resources:zones' );


var Zones = function () {

};


Zones.prototype.data = function ( resourceId, ids, callback ) {

	// FIXME: validate args

	if (! Array.isArray( ids ) ) {
		ids = [ids];
	}

	var params = {
		itemId : resourceId,
		col    : ids
	};

	this.wialon.session.request( 'resource/get_zone_data', params, callback );

};


module.exports = Zones;

