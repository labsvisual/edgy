import Resource from './Resource';
import * as Errors from '../Errors';
import Utils from './Utils';

class ResourceCollection {

    constructor( options ) {

        this._resources = {};
        this._customResources = [];
        this._customResourcesMapping = {};

        const { resource, headers, subUri, appendTrailingSlash, apiPath, resourceIdentifier } = options;

        [ 'GET', 'PUT', 'DELETE' ].forEach( method => {

            const resourceOptions = {
                resource,
                headers,
                subUri,
                appendTrailingSlash,
                apiPath,
                method
            };

            this._resources[ method ] = new Resource( resourceOptions );

        } );

        if ( !resourceIdentifier ) {
            throw new Errors.InvalidResourceError( 'For Read, Update and Delete operations, you need to provide the resource identifier.' );
        }

        this._resourceIdentifier = resourceIdentifier;
        delete options.resourceIdentifier;

        this.config = options;

    }

    addMethod( name, subUri, method ) {

        const opts = Object.assign( {}, {
            ...this.config
        }, {
            subUri,
            method
        } );

        if ( Utils.getAllKeys( this._customResourcesMapping ).indexOf( name.toLowerCase() ) > -1 ) {
            throw new Errors.InvalidOperationError( 'The provided name already exists in the current resource context.' );
        }

        this._customResources.push( {
            name: name.toLowerCase(),
            method: method.toUpperCase(),
            resource: new Resource( opts )
        } );

        this._customResourcesMapping[ name ] = this._customResources.length - 1;

    }

    exec( name, id, data ) {

        const _name = name.toLowerCase();
        if ( this._customResources.length === 0 && typeof this._customResourcesMapping[ _name ] === 'undefined' ) {
            throw new Errors.InvalidOperationError( `The specified request for the verb ${ _name } has not been added. Use \`.addMethod()\` to add the method. ` )
        }

        const res = this._customResources[ this._customResourcesMapping[ _name ] ];
        return res.resource.makeRequest( {
            params: {
                [ this._resourceIdentifier ]: id
            },
            data,
        } );

    }

    get( id ) {

        return this._resources[ 'GET' ].makeRequest( {
            params: {
                [ this._resourceIdentifier ]: id
            }
        } );

    }

    update( id, data ) {

        return this._resources[ 'PUT' ].makeRequest( {
            params: {
                [ this._resourceIdentifier ]: id
            },
            data
        } );

    }

    delete( id ) {

        return this._resources[ 'DELETE' ].makeRequest( {
            params: {
                [ this._resourceIdentifier ]: id
            }
        } );

    }

}

export default ResourceCollection;
