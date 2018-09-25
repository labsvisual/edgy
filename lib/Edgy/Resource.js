import HttpRequest from './HttpRequest';
import * as Errors from '../Errors';

// TODO: extend from HttpRequest

class Resource {

    _validateResource( name ) {
        return name.match( /^[A-Za-z0-9]*$/g );
    }

    _validateHttpVerb( verb ) {
        return [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE' ].indexOf( verb.toUpperCase() ) !== -1;
    }

    _constructRequestUrl( options ) {

        let completeUri = `${ this.config.apiPath }/${ this.config.resource }${ ( this.config.subUri === '' ? '' : this.config.subUri ) }`;
        const templateParams = completeUri.match( /(\{[A-Za-z0-9]*\})/g );
        if ( options && options.params && templateParams.length > 0 ) {

            const keys = Object.keys( options.params ).filter( k => options.params.hasOwnProperty( k ) );

            for ( let templateParam of templateParams ) {

                const key = templateParam.substring( 1, templateParam.length - 1 );
                if ( keys.indexOf( key ) > -1 ) {
                    completeUri = completeUri.replace( templateParam, options.params[ key ] );
                }

            }

        }

        return ( this.config.appendTrailingSlash ? completeUri + '/' : completeUri );

    }

    constructor( options ) {

        if ( !options ) {
            throw new Errors.NoConfigurationOptionsError( 'No configuration object was passed for this initialization.' );
        }

        if ( !options.resource || !this._validateResource( options.resource ) ) {
            throw new Errors.InvalidResourceError( 'The provided resource name is invalid.' );
        }

        if ( !options.method || !this._validateHttpVerb( options.method ) ) {
            throw new Errors.InvalidHttpVerbError( 'The provided verb is invalid as per RFC 7231.' );
        }

        const defaults = {
            subUri: '',
            appendTrailingSlash: false
        };

        this.config = Object.assign( defaults, options );

    }

    async makeRequest( options ) {

        const url = this._constructRequestUrl( options );
        super.makeRequest( url, options.data );

    }

}

export default Resource;
