
'use strict';

var debug = require( 'debug' )( 'wialon:resources:geofences' );


var Geofences = function () {

};


Geofences.prototype.data = function ( resourceId, ids, callback ) {

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


module.exports = Geofences;

