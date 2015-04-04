
'use strict';

var debug   = require( 'debug' )( 'core/session' );
var request = require( 'request' );

var Session = function ( opts ) {

	if ( process.env.NODE_ENV !== 'production' ) {
		require( 'request-debug' )( request );
	}

	this.options( opts );

};


Session.prototype.options = function ( opts ) {
	this._options = opts || {};
};


Session.prototype.endpoint = function () {
	var url = this._options.url
		|| this.wialon._options.url
		|| 'https://hst-api.wialon.com/wialon/ajax.html';

	debug( 'endpoint: ' + url );
	return url;
};


Session.prototype.start = function ( credentials, callback ) {

	if (! callback ) {
		callback = this.dummycb;
	}

	// validate credentials
	if ( typeof credentials !== 'object'
		|| (! ( credentials.username && credentials.password ) ) ) {
		return callback( new Error( "Invalid credentials" ) );
	}

	var self = this;
	var login_params = {
		user : credentials.username,
		password : credentials.password
	};

	request.post( {
		url : this.endpoint() + '?svc=core/login',
		form : { params : JSON.stringify( login_params ) }
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
			return callback( new Error( "API error: " + data.error ) );
		}

		self.wialon._session = data
		callback( err, self.wialon._session );
	} );

};


Session.prototype.end = function ( callback ) {
	this.request( 'core/logout', {}, callback );
};


Session.prototype.request = function ( api, params, callback ) {

	if (! callback ) {
		callback = this.dummycb;
	}

	if (! this.wialon._session.eid ) {
		return callback( new Error( "Invalid session" ) );
	}


	request.post( {
		url : this.endpoint() + '?svc=' + api + '&sid=' + this.wialon._session.eid,
		form : { params : JSON.stringify( params ) }
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
			return callback( new Error( "API error: " + data.error ) );
		}

		callback( err, data );
	} );

};


Session.prototype.dummycb = function ( err, data ) { }


module.exports = Session;

