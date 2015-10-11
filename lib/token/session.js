
'use strict';

var debug   = require( 'debug' )( 'wialon:token:session' );
var request = require( 'request' );


/**
*   Wialon session representation
*
*   @constructor
*   @param {object} opts - Constructor options
*/
var Session = function ( opts ) {
	this._session = {};
	this.options( opts );

	var self = this;
	if ( self._options.authz ) {
		debug( 'authorization parameters found, initialising session...' );
		self._session = new Promise( function ( resolve, reject ) {
			self.start( self._options.authz )
				.then( resolve )
				.catch( reject );
		} );
	}

};


/**
*   Set options
*
*   @param {object} opts - Options
*/
Session.prototype.options = function ( opts ) {
	this._options = opts || {};
};


/**
*   Helper method to get Wialon Remote API endpoint URL
*
*   @return {string} Wialon Remote API endpoint URL
*           e.g. 'https://hst-api.wialon.com/wialon/ajax.html'
*/
Session.prototype.endpoint = function () {
	var url = this._options.url  ||
		'https://hst-api.wialon.com/wialon/ajax.html';

	return url;
};


/**
*   Initiate a session using 'token/login' API command. The session data is saved
*   in module scope so it can be referenced from convenience classes.
*
*   @param {object} authz - Authorization parameters
*   @param {string} authz.token     - Access token
*   @param {string} authz.operateAs - User to use this session as
*   @returns {Promise}
*/
Session.prototype.start = function ( authz ) {

	var self = this;

	return new Promise( function ( resolve, reject ) {

		// validate authorization parameters
		if ( typeof authz !== 'object' ||
			(! authz.token ) ) {
			return reject( new Error( 'Invalid authorization parameters' ) );
		}

		var params = {
			token : authz.token,
			operateAs : authz.operateAs
		};

		self._request( 'token/login', params )
			.then( function ( data ) {
				self._session = data;
				resolve( self._session );
			} )
			.catch( reject );

	} );

};


/**
*   Make an API request
*
*   @param {svc} string - API command (e.g. 'core/search_items')
*   @param {object} params - API parameters for command execution
*   @returns {Promise}
*/
Session.prototype.request = function ( svc, params ) {

	var self = this;

	return new Promise( function ( resolve, reject ) {

		if ( self._session instanceof Promise ) {
			debug( 'waiting for session promise...' );

			self._session
				.then( function () {
					self._request( svc, params )
						.then( resolve )
						.catch( reject );
				} )
				.catch( reject );
		} else {
			debug( 'no waiting' );
			self._request( svc, params )
				.then( resolve )
				.catch( reject );
		}

	} );

};


/**
*   Internal helper method to send API requests
*
*   @private
*   @param {svc} string - API command (e.g. 'core/search_items')
*   @param {object} params - API parameters for command execution
*   @returns {Promise}
*/
Session.prototype._request = function ( svc, params ) {

	var self = this;
	var url  = self.endpoint() + '?svc=' + svc;
	var data = { params : JSON.stringify( params ) };

	return new Promise( function ( resolve, reject ) {

		if ( svc !== 'token/login' ) {
			if (! self._session.eid ) {
				return reject( new Error( 'Invalid session' ) );
			}
			data.sid = self._session.eid;
		}

		request
			.post( {
				url  : url,
				form : data
			} )
			.on( 'error', reject )
			.on( 'data', function ( buffer ) {
				var data = buffer.toString();

				try {
					data = JSON.parse( data );
				} catch ( e ) {
					return reject( e );
				}

				if ( data.error ) {
					return reject( new Error( 'API error: ' + data.error ) );
				}

				resolve( data );
			} );

	} );

};



module.exports = Session;

