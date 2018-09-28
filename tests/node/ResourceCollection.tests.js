import test from 'ava';
import ResourceCollection from '../../lib/Edgy/ResourceCollection';
import * as Errors from '../../lib/Errors';
import Resource from '../../lib/Edgy/Resource';
import sinon from 'sinon';

test( 'it should expose the default ResourceCollection class', t => {

    t.is( typeof ResourceCollection, 'function' );

} );

test( 'it should create a new object properly', t => {

    const rc = new ResourceCollection( {
        resource: 'User',
        headers: {
            'Connection': 'close'
        },
        apiPath: 'http://127.0.0.1:3345/api/v1/ping',
        resourceIdentifier: 'id',
        subUri: '/{id}'
    } );

    t.is( typeof rc, 'object' );
    t.is( rc.__proto__.constructor.name, 'ResourceCollection' );
    t.truthy( rc instanceof ResourceCollection );

} );

test( 'throws an error on no resource identifier', t => {

    t.throws( () => {
        const rc = new ResourceCollection( {
            resource: 'User',
            headers: {
                'Connection': 'close'
            },
            apiPath: 'http://127.0.0.1:3345/api/v1/ping',
        } );
    }, Errors.InvalidResourceError );

} );

test( 'internal configuration is correct', t => {

    const rc = new ResourceCollection( {
        resource: 'User',
        headers: {
            'Connection': 'close'
        },
        apiPath: 'http://127.0.0.1:3345/api/v1/ping',
        resourceIdentifier: 'id',
        subUri: '/{id}'
    } );

    t.is( typeof rc.config, 'object' );
    t.is( rc.config.resource, 'User' );
    t.deepEqual( rc.config.headers, {
        'Connection': 'close'
    } );
    t.is( rc.config.apiPath, 'http://127.0.0.1:3345/api/v1/ping' );
    t.is( rc._resourceIdentifier, 'id' );

} );

test( 'internal configuration creates RUD', t => {

    const rc = new ResourceCollection( {
        resource: 'User',
        headers: {
            'Connection': 'close'
        },
        apiPath: 'http://127.0.0.1:3345/api/v1/ping',
        resourceIdentifier: 'id',
        subUri: '/{id}'
    } );

    t.is( typeof rc._resources, 'object' );
    t.is( typeof rc._resources.GET, 'object' );
    t.is( typeof rc._resources.PUT, 'object' );
    t.is( typeof rc._resources.DELETE, 'object' );

    t.true( rc._resources.GET instanceof Resource );
    t.true( rc._resources.PUT instanceof Resource );
    t.true( rc._resources.DELETE instanceof Resource );


} );

test( 'addMethod() adds the correct resource #Base', t => {

    const rc = new ResourceCollection( {
        resource: 'User',
        headers: {
            'Connection': 'close'
        },
        apiPath: 'http://127.0.0.1:3345/api/v1/ping',
        resourceIdentifier: 'id',
        subUri: '/{id}'
    } );

    t.is( typeof rc._customResources, 'object' );
    t.is( rc._customResources.length, 0 );
    t.is( typeof rc._customResourcesMapping[ 'test' ], 'undefined' );

} );

test( 'addMethod() adds the correct resource #OnAdd', t => {

    const rc = new ResourceCollection( {
        resource: 'User',
        headers: {
            'Connection': 'close'
        },
        apiPath: 'http://127.0.0.1:3345/api/v1/ping',
        resourceIdentifier: 'id',
        subUri: '/{id}'
    } );

    rc.addMethod( 'test', '/{id}', 'POST' );

    t.is( rc._customResources.length, 1 );
    t.is( typeof rc._customResources[ 0 ], 'object' );
    t.is( typeof rc._customResourcesMapping[ 'test' ], 'number' );
    t.is( rc._customResourcesMapping[ 'test' ], 0 );

} );

test( 'addMethod() adds the correct resource #StaticMapping', t => {

    const rc = new ResourceCollection( {
        resource: 'User',
        headers: {
            'Connection': 'close'
        },
        apiPath: 'http://127.0.0.1:3345/api/v1/ping',
        resourceIdentifier: 'id',
        subUri: '/{id}'
    } );

    rc.addMethod( 'test', '/{id}', 'POST' );

    t.is( rc._customResources[ 0 ].name, 'test' );
    t.is( rc._customResources[ 0 ].method, 'POST' );
    t.is( typeof rc._customResources[ 0 ].resource, 'object' );
    t.true( rc._customResources[ 0 ].resource instanceof Resource );

} );

test( 'addMethod() adds the correct resource #InternalMapping', t => {

    const rc = new ResourceCollection( {
        resource: 'User',
        headers: {
            'Connection': 'close'
        },
        apiPath: 'http://127.0.0.1:3345/api/v1/ping',
        resourceIdentifier: 'id',
        subUri: '/{id}'
    } );

    rc.addMethod( 'test', '/{id}', 'POST' );

    t.is( rc._customResources[ rc._customResourcesMapping[ 'test' ] ].name, 'test' );
    t.is( rc._customResources[ rc._customResourcesMapping[ 'test' ] ].method, 'POST' );
    t.is( typeof rc._customResources[ rc._customResourcesMapping[ 'test' ] ].resource, 'object' );
    t.true( rc._customResources[ rc._customResourcesMapping[ 'test' ] ].resource instanceof Resource );

} );

test( 'addMethod() throws an error on a duplicate name', t => {

    t.throws( () => {

        const rc = new ResourceCollection( {
            resource: 'User',
            headers: {
                'Connection': 'close'
            },
            apiPath: 'http://127.0.0.1:3345/api/v1/ping',
            resourceIdentifier: 'id',
            subUri: '/{id}'
        } );

        t.is( typeof rc._customResources, 'object' );
        t.is( rc._customResources.length, 0 );

        rc.addMethod( 'test', '/{id}', 'POST' );

        t.is( rc._customResources.length, 1 );
        t.is( typeof rc._customResources[ 0 ], 'object' );

        t.is( rc._customResources[ 0 ].name, 'test' );
        t.is( rc._customResources[ 0 ].method, 'POST' );
        t.is( typeof rc._customResources[ 0 ].resource, 'object' );
        t.true( rc._customResources[ 0 ].resource instanceof Resource );

        rc.addMethod( 'test', '/{id}', 'POST' );
    }, Errors.InvalidOperationError );

} );

test( 'exec calls the right function with the data', t => {

    const rc = new ResourceCollection( {
        resource: 'User',
        headers: {
            'Connection': 'close'
        },
        apiPath: 'http://127.0.0.1:3345/api/v1/ping',
        resourceIdentifier: 'id',
        subUri: '/{id}'
    } );

    rc.addMethod( 'test', '/{id}', 'POST' );

    const res = {
        makeRequest: sinon.spy()
    }

    rc._customResources[ rc._customResourcesMapping[ 'test' ] ].resource = res;

    rc.exec( 'test', 'id', {
        foo: 'bar'
    } );

    t.true( res.makeRequest.called );
    t.true( res.makeRequest.calledWith( {
        params: {
            id: 'id'
        },
        data: {
            foo: 'bar'
        }
    } ) );

} );

const methods = [ 'GET', 'PUT', 'DELETE' ];
methods.forEach( ( method ) => {

    test( `${ method }`, t => {

        const rc = new ResourceCollection( {
            resource: 'User',
            headers: {
                'Connection': 'close'
            },
            apiPath: 'http://127.0.0.1:3345/api/v1/ping',
            resourceIdentifier: 'id',
            subUri: '/{id}'
        } );

        const res = {
            makeRequest: sinon.spy()
        }

        rc._resources[ method ] = res;

        switch ( method ) {
            case 'GET':
                rc.get( 'id' );
                break;
            case 'PUT':
                rc.update( 'id', {
                    foo: 'bar'
                } );
                break;
            case 'DELETE':
                rc.delete( 'id' );
        }

        t.true( res.makeRequest.called );
        if ( method === 'PUT' ) {
            t.true( res.makeRequest.calledWith( {
                params: {
                    id: 'id'
                },
                data: {
                    foo: 'bar'
                }
            } ) );
        } else {
            t.true( res.makeRequest.calledWith( {
                params: {
                    id: 'id'
                }
            } ) );
        }

    } );

} );
