import test from 'ava';
import HttpRequest from '../lib/Edgy/HttpRequest';
import data from './data.json';

const getReq = ( method, protect = false, ct = 'application/json; charset=utf8' ) => {

    if ( ct.indexOf( 'multipart' ) > -1 ) {
        ct += '; charset=utf8; boundary=__EDGY_FORM__';
    }

    const dataObj = {
        http: {
            url: `http://127.0.0.1:3345/api/v1/ping${ protect ? '/protected' : '' }`,
            method,
        },
        headers: {
            'content-type': ct
        }
    };

    if ( protect ) {
        dataObj.headers[ 'Authorization' ] = data.jwt;
    }

    return new HttpRequest( dataObj );
};

const verbs = [

    {
        verb: 'GET',
    },
    {
        verb: 'POST',
        data: {
            foo: 'bar'
        }
    },
    {
        verb: 'PUT',
        data: {
            foo: 'bar'
        }
    },
    {
        verb: 'DELETE'
    }

];

test( 'should be of correct type', t => {

    t.is( typeof HttpRequest, 'function' );
    const req = getReq( 'GET' )

    t.is( typeof req, 'object' );
    t.is( req.__proto__.constructor.name, 'HttpRequest' );
    t.truthy( req instanceof HttpRequest );

} );

verbs.forEach( verb => {

    test( `should make request <${ verb.verb }>`, async ( t ) => {

        try {

            const r = getReq( verb.verb );
            const data = await r.makeRequest( verb.data );
            if ( verb.data ) {
                t.deepEqual( JSON.parse( data ), {
                    payload: {
                        ...verb.data
                    }
                } );
            } else {
                t.is( data, 'Hello World!' );
            }

        } catch ( ex ) {
            console.error( ex.toString() );
            t.fail();
        }

    } );

    test( `should make request <${ verb.verb }/Protected>`, async ( t ) => {

        try {

            const r = getReq( verb.verb, true );
            const data = await r.makeRequest( verb.data );
            if ( verb.data ) {
                t.deepEqual( JSON.parse( data ), {
                    payload: {
                        ...verb.data
                    }
                } );
            } else {
                t.is( data, 'Hello World!' );
            }

        } catch ( ex ) {
            console.error( ex.toString() );
            t.fail();
        }

    } );

    if ( verb.verb === 'POST' || verb.verb === 'PUT' ) {

        [ 'application/x-www-form-urlencoded', 'multipart/form-data' ].forEach( ct => {

            test( `should make request <${ verb.verb }/${ ct }>`, async ( t ) => {

                try {

                    const r = getReq( verb.verb, false, ct );
                    const data = await r.makeRequest( verb.data );
                    if ( verb.data ) {
                        t.deepEqual( JSON.parse( data ), {
                            payload: {
                                ...verb.data
                            }
                        } );
                    } else {
                        t.is( data, 'Hello World!' );
                    }

                } catch ( ex ) {
                    console.error( ex.toString() );
                    t.fail();
                }

            } );

            test( `should make request <${ verb.verb }/Protected/${ ct }>`, async ( t ) => {

                try {

                    const r = getReq( verb.verb, true, ct );
                    const data = await r.makeRequest( verb.data );
                    if ( verb.data ) {
                        t.deepEqual( JSON.parse( data ), {
                            payload: {
                                ...verb.data
                            }
                        } );
                    } else {
                        t.is( data, 'Hello World!' );
                    }

                } catch ( ex ) {
                    console.error( ex.toString() );
                    t.fail();
                }

            } );

        } );

    }

} );
