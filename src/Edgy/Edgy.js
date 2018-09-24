import * as Errors from '../Errors';

class Edgy {

    _validateUrl( url ) {
        return url.match( /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g );
    }

    _validateResource( name ) {
        return name.match( /^[A-Za-z0-9]*$/g );
    }

    _buildResourceUrl() {

        let apiPath = '';
        if ( this.config.url.charAt( this.config.url.length - 1 ) === '/' ) {
            apiPath += this.config.url.substring( 0, this.config.url.length - 1 );
        } else {
            apiPath += this.config.url;
        }

        if ( this.config.versioning ) {
            apiPath += `/${ this.config.versioning.prefix ? this.config.versioning.prefix : 'v' }${ this.config.versioning.version }`;
        }

        return apiPath;

    }

    constructor( options ) {

        if ( !options ) {
            throw new Errors.NoConfigurationOptionsError( 'No configuration object was provided for initialization.' );
        }

        if ( !options.url || !this._validateUrl( options.url ) ) {
            throw new Errors.InvalidUrlError( 'The provided URL is invalid.' );
        }

        const defaults = {
            versioning: {
                prefix: 'v',
                version: 1
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };

        this.config = Object.assign( defaults, options );
        this.apiPath = this._buildResourceUrl();

    }

    getApiPath() {
        if ( !this.config ) {
            throw new Errors.InvalidAdapterConfigurationError( 'This instance of Edgy has not been initialized correctly.' );
        }
        
        return this.apiPath;
    }

}

export default Edgy;
