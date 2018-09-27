import test from 'ava';
import Resource from '../../lib/Edgy/Resource';
import { Errors } from '../../lib';

test( 'should be of correct type', t => {

    t.is( typeof Resource, 'function' );
    const res = new Resource( {
        resource: 'user',
        method: 'GET',
        apiPath: 'https://test.com/api/v1'
    } );

    t.is( typeof res, 'object' );
    t.is( res.__proto__.constructor.name, 'Resource' );
    t.truthy( res instanceof Resource );

} );

test( 'should initialize correctly with sub URI', t => {

    const res = new Resource( {
        resource: 'user',
        method: 'GET',
        apiPath: 'https://test.com/api/v1',
        subUri: '/get'
    } );

    t.is( res.config.subUri, '/get' );

} );

test ( 'should throw an error when no options are passed', t => {

    t.throws( () => {

        const res = new Resource();

    }, Errors.NoConfigurationOptionsError );

} );

test( 'should throw an error on invalid initialization <InvalidResourceError>', t => {

    t.throws( () => {

        const res = new Resource( {
            resource: ':sasdadad:',
            method: 'GET',
            apiPath: 'https://test.com'
        } );

    }, Errors.InvalidResourceError );

    t.throws( () => {

        const res = new Resource( {
            method: 'GET',
            apiPath: 'https://test.com'
        } );

    }, Errors.InvalidResourceError );

} );

test( 'should throw an error on invalid initialization <InvalidHttpVerbError>', t => {

    t.throws( () => {

        const res = new Resource( {
            resource: 'user',
            apiPath: 'https://test.com'
        } );

    }, Errors.InvalidHttpVerbError );

    t.throws( () => {

        const res = new Resource( {
            resource: 'user',
            method: 'INVALIDMETHOD',
            apiPath: 'https://test.com'
        } );

    }, Errors.InvalidHttpVerbError );

} );

test ( 'should throw an error when invalid option keys are passed', t => {

    t.throws( () => {

        const res = new Resource( {
            resource: 'test',
            method: 'GET',
            test: 'new'
        } );

    }, Errors.InvalidAdapterConfigurationError );

} );

test( 'should build the correct endpoint', t => {

    const res = new Resource( {
        resource: 'user',
        method: 'GET',
        apiPath: 'https://test.com/api/v1',
    } );

    t.is( res._constructRequestUrl(), 'https://test.com/api/v1/user' );

} );

test( 'should build the correct endpoint with the trailing slash', t => {

    const res = new Resource( {
        resource: 'user',
        method: 'GET',
        apiPath: 'https://test.com/api/v1',
        appendTrailingSlash: true
    } );

    t.is( res._constructRequestUrl(), 'https://test.com/api/v1/user/' );

} );

test( 'should build the correct endpoint with the sub uri', t => {

    const res = new Resource( {
        resource: 'user',
        method: 'GET',
        apiPath: 'https://test.com/api/v1',
        subUri: '/get'
    } );

    t.is( res._constructRequestUrl(), 'https://test.com/api/v1/user/get' );

} );

test( 'should build the correct endpoint with one param', t => {

    const res = new Resource( {
        resource: 'user',
        method: 'GET',
        apiPath: 'https://test.com/api/v1',
        subUri: '/{id}'
    } );

    t.is( res._constructRequestUrl( {
        params: {
            id: 'testId'
        }
    } ), 'https://test.com/api/v1/user/testId' );

} );

test( 'should build the correct endpoint with multiple params', t => {

    const res = new Resource( {
        resource: 'user',
        method: 'GET',
        apiPath: 'https://test.com/api/v1',
        subUri: '/{firstName}/{lastName}'
    } );

    t.is( res._constructRequestUrl( {
        params: {
            firstName: 'Foo',
            lastName: 'Bar'
        }
    } ), 'https://test.com/api/v1/user/Foo/Bar' );

} );

test( 'should build the correct endpoint with one param and one qs', t => {

    const res = new Resource( {
        resource: 'user',
        method: 'GET',
        apiPath: 'https://test.com/api/v1',
        subUri: '/{id}'
    } );

    t.is( res._constructRequestUrl( {
        params: {
            id: 'testId'
        },
        query: {
            test: 'name'
        }
    } ), 'https://test.com/api/v1/user/testId?test=name' );

} );

test( 'should build the correct endpoint with one param and multiple qs', t => {

    const res = new Resource( {
        resource: 'user',
        method: 'GET',
        apiPath: 'https://test.com/api/v1',
        subUri: '/{id}',
    } );

    t.is( res._constructRequestUrl( {
        params: {
            id: 'testId'
        },
        query: {
            test: 'name',
            key: 'value'
        }
    } ), 'https://test.com/api/v1/user/testId?test=name&key=value' );

} );

test( 'should make all requests', async ( t ) => {

    let res = new Resource( {
        resource: 'ping',
        method: 'GET',
        apiPath: 'http://localhost:3345/api/v1',
        subUri: '/{pathName}',
        appendTrailingSlash: false
    } );

    try {

        const data = await res.makeRequest( {
            params: {
                pathName: ''
            }
        } );

        t.is( data, 'Hello World!' );

    } catch ( ex ) {
        console.log( ex.toString() );
        t.fail();
    }

    try {

        const data = await res.makeRequest( {
            query: {
                key1: 'val1'
            },
            params: {
                pathName: ''
            }
        } );

        t.deepEqual( JSON.parse( data ), {
            query: {
                key1: 'val1'
            }
        } );

    } catch ( ex ) {
        console.log( ex.toString() );
        t.fail();
    }

} );
