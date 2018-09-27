import HttpRequest from './HttpRequest';
import * as Errors from '../Errors';
import Utils from './Utils';
import HttpUtils from './HttpUtils';

class Resource extends HttpRequest {

    _constructRequestUrl( options ) {

        let completeUri = `${ this.config.apiPath }/${ this.config.resource }${ ( this.config.subUri === '' ? '' : this.config.subUri ) }`;
        const templateParams = completeUri.match( /(\{[A-Za-z0-9]*\})/g );
        if ( options && options.params && templateParams.length > 0 ) {

            const keys = Utils.getAllKeys( options.params );

            for ( let templateParam of templateParams ) {

                const key = templateParam.substring( 1, templateParam.length - 1 );
                if ( keys.indexOf( key ) > -1 ) {
                    completeUri = completeUri.replace( templateParam, options.params[ key ] );
                }

            }

        }

        if ( completeUri.lastIndexOf( '/' ) === completeUri.length - 1 ) {
            if ( !this.config.appendTrailingSlash ) {
                completeUri = completeUri.substring( 0, completeUri.length - 1 );
            }
        } else {
            if ( this.config.appendTrailingSlash ) {
                completeUri = completeUri + '/';
            }
        }

        if ( options && options.query ) {

            completeUri = completeUri.lastIndexOf( '/' ) === completeUri.length - 1 ? completeUri.substring( 0, completeUri.length - 1 ) : completeUri;
            completeUri += HttpUtils.formatQueryString( options.query );

        }

        return completeUri;

    }

    constructor( options ) {

        const helpers = {
            _validateResource( name ) {
                return name.match( /^[A-Za-z0-9]*$/g );
            },

            _validateHttpVerb( verb ) {
                return [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH' ].indexOf( verb.toUpperCase() ) !== -1;
            },

            _validateOptions( _options ) {

                if ( !options ) {
                    throw new Errors.NoConfigurationOptionsError( 'No configuration object was passed for this initialization.' );
                }

                if ( !options.resource || !helpers._validateResource( options.resource ) ) {
                    throw new Errors.InvalidResourceError( 'The provided resource name is invalid.' );
                }

                const validKeys = {
                    'top': [ 'resource', 'headers', 'subUri', 'appendTrailingSlash', 'apiPath', 'method' ]
                };

                let allKeys = Utils.getAllKeys( options );
                let invalidKeys = allKeys.filter( key => validKeys.top.indexOf( key ) === -1 );
                if ( invalidKeys.length > 0 ) {
                    throw new Errors.InvalidAdapterConfigurationError( `The key(s) ${ invalidKeys.join( ', ' ) } in the configuration is not valid.` );
                }

                if ( !options.method || !helpers._validateHttpVerb( options.method ) ) {
                    throw new Errors.InvalidHttpVerbError( 'The provided verb is invalid.' );
                }

            }
        };

        helpers._validateOptions( options );

        const defaults = {
            subUri: '',
            appendTrailingSlash: false,
            method: 'GET',
            apiPath: 'http//localhost:3345'
        };

        const config = Object.assign( defaults, options );

        super( config );
        this.config = config;

    }

    async makeRequest( options ) {

        const url = this._constructRequestUrl( options );
        return super.makeRequest( url, options.data );

    }

}

export default Resource;
