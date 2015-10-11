
'use strict';

var debug = require( 'debug' )( 'wialon:resources:zones' );


/**
*   Zone resources API
*
*   @constructor
*/
var Zones = function () {

};


/**
*   Get detailed information for a set of zone resources
*
*   @param {string} resourceId - Resource ID
*   @param {array|string} ids  - Zone IDs
*   @returns {Promise}
*
*   @see {@link http://sdk.wialon.com/wiki/en/kit/remoteapi/apiref/resource/get_zone_data}
*/
Zones.prototype.data = function ( resourceId, ids ) {

	if (! Array.isArray( ids ) ) {
		ids = [ids];
	}

	var params = {
		itemId : resourceId,
		col    : ids
	};

	return this.wialon.session.request( 'resource/get_zone_data', params );

};


module.exports = Zones;

