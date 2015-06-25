
'use strict';

var debug   = require( 'debug' )( 'wialon:core:session' );
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
	if ( self._options.credentials ) {
		debug( 'creadentials found, initialising session...' );
		self._session = new Promise( function ( resolve, reject ) {
			self.start( self._options.credentials , function ( err, data ) {
				if ( err ) {
					return reject( err );
				}

				resolve( data );
			} );
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
*   Initiate a session using 'core/login' API command. The session data is saved
*   in module scope so it can be referenced from convenience classes.
*
*   @param {object} credentials - Login credentials
*   @param {string} credentials.usename - Username
*   @param {string} credentials.password - Password
*   @param {callback} callback - Callback method to handle the response
*/
Session.prototype.start = function ( credentials, callback ) {

	if (! callback ) {
		callback = this.dummycb;
	}

	// validate credentials
	if ( typeof credentials !== 'object' ||
		(! ( credentials.username && credentials.password ) ) ) {
		return callback( new Error( 'Invalid credentials' ) );
	}

	var self = this;
	var params = {
		user : credentials.username,
		password : credentials.password
	};

	self.request( 'core/login', params, function ( err, data ) {
		if ( err ) {
			return callback( err );
		}

		self._session = data;
		callback( err, self._session );
	} );

};


/**
*   Close an open session using 'core/logout' API command
*
*   @param {callback} callback - Callback method to handle the response
*/
Session.prototype.end = function ( callback ) {
	this.request( 'core/logout', {}, callback );
};


/**
*   Make an API request
*
*   @param {svc} string - API command (e.g. 'core/search_items')
*   @param {object} params - API parameters for command execution
*   @param {callback} callback - Callback method to handle the response
*/
Session.prototype.request = function ( svc, params, callback ) {

	if (! callback ) {
		callback = this.dummycb;
	}


	var self = this;
	if ( self._session instanceof Promise ) {
		debug( 'waiting for session promise...' );

		self._session
			.then( function () {
				self._request( svc, params, callback );
			} )
			.catch( callback );

	} else {
		self._request( svc, params, callback );
	}

};


/**
*   Internal helper method to send API requests
*
*   @private
*   @param {svc} string - API command (e.g. 'core/search_items')
*   @param {object} params - API parameters for command execution
*   @param {callback} callback - Callback method to handle the response
*/
Session.prototype._request = function ( svc, params, callback ) {

	var url  = this.endpoint() + '?svc=' + svc;
	var data = { params : JSON.stringify( params ) };

	if ( svc !== 'core/login' ) {
		if (! this._session.eid ) {
			return callback( new Error( 'Invalid session' ) );
		}
		data.sid = this._session.eid;
	}

	request.post( {
		url  : url,
		form : data
	}, function ( err, res, data ) {
		if ( err ) {
			return callback( err );
		}

		try {
			data = JSON.parse( data );
		} catch ( e ) {
			return callback( e );
		}

		if ( data.error ) {
			return callback( new Error( 'API error: ' + data.error ) );
		}

		callback( err, data );
	} );

};


/**
*   Internal callback method
*
*   @private
*/
Session.prototype.dummycb = function ( err, data ) { };


module.exports = Session;

