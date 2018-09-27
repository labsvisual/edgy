import URL from 'url';
import http from 'http';
import https from 'https';
import * as Errors from '../Errors';
import HttpUtils from './HttpUtils.js';
import Utils from './Utils';

class HttpRequest {

    constructor( options ) {

        if ( !options ) {
            throw new Errors.NoConfigurationOptionsError( 'The specified options object is either invalid or undefined.' );
        }

        this.config = {};

        this.config.headers = {
            'connection': 'close',
            'content-type': 'application/json; charset=utf8'
        };

        let tempHeaders = options.headers || {};
        if ( options.headers ) {
            for ( let header in Utils.getAllKeys( options.headers ) ) {
                tempHeaders[ header.toLowerCase() ] = options.headers[ header ];
            }
        }

        this.config.headers = ( options.headers ) ?
            Object.assign( this.config.headers, tempHeaders ) : this.config.headers;

        for( let headerKey in this.config.headers ) {
            if ( typeof this.config.headers[ headerKey ] === 'undefined' ) {
                delete this.config.headers[ headerKey ];
            }
        }

        this.config.method = options.method  || 'GET';

    }

    async makeRequest( url, data ) {

        let urlObj = url;

        if ( typeof urlObj === 'string' ) {
            urlObj = URL.parse( url );
        }

        const urlKeys = Utils.getAllKeys( urlObj );
        urlObj = urlKeys.reduce( ( acc, current ) => {
            const urlData = urlObj[ current ];
            const filterKeys = [ 'protocol', 'hostname', 'port', 'path' ];

            if ( urlData && filterKeys.indexOf( current ) > -1 ) {
                acc[ current ] = urlObj[ current ];
            }

            return acc;
        }, {} );

        if ( !urlObj.path ) {
            urlObj.path = '/';
        }

        if ( data ) {
            this.data = HttpUtils.formatData( data, this.config.headers );
        }

        if ( typeof window !== 'undefined' && typeof window.XMLHttpRequest !== 'undefined' ) {

            return new Promise( ( resolve, reject ) => {

                const req = new XMLHttpRequest();
                req.onreadystatechange = () => {

                    if ( req.readyState === 4 && req.status === 200 ) {

                        if ( req.status === 200 ) {
                            resolve( req.responseText );
                        } else {
                            resolve( {
                                isErorr: true,
                                statusCode: req.status,
                                statusMessage: req.statusText
                            } )
                        }

                    }

                };

                req.open( this.config.method, url, true );

                const unsafeHeaders = [ 'connection' ];
                const headerKeys = Object.keys( this.config.headers )
                    .filter( k => this.config.headers.hasOwnProperty( k ) )
                    .filter( k => unsafeHeaders.indexOf( k ) === -1 );

                headerKeys.forEach( header => {
                    req.setRequestHeader( header, this.config.headers[ header ] );
                } );

                if ( this.config.method === 'PUT' || this.config.method === 'POST' ) {
                    if ( headerKeys.indexOf( 'content-type' ) === -1 ) {
                        req.setRequestHeader( 'content-type', 'application/json; charset=utf8' );
                    }
                    req.send( this.data );
                } else {
                    req.send();
                }

            } );

        } else {

            const reqObj = ( urlObj.port === 443 ? https : http );
            return new Promise( ( resolve, reject ) => {

                const req = reqObj.request( Object.assign( {}, this.config, urlObj ), res => {

                    let responseBufs = [];
                    let responseStr = '';
                    res.on( 'data', c => {

                        if ( Buffer.isBuffer( c ) ) {
                            responseBufs.push( c );
                        } else {
                            responseStr += c;
                        }

                    } ).on( 'end', () => {

                        responseStr = responseBufs.length > 0 ?
                            Buffer.concat( responseBufs ).toString( 'utf8' ) :
                            responseStr;

                        resolve( responseStr );

                    } );

                } );

                req.on( 'error', e => {
                    reject( e );
                } );

                if ( ( this.config.method === 'POST' || this.config.method === 'PUT' ) && this.data ) {
                    req.write( this.data );
                }

                req.end();

            } );

        }

    }
}

export default HttpRequest;
