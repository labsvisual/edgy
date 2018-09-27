describe( '#Edgy.Object', function() {
    it( 'exposes the Edgy object', function() {

        expect( Edgy ).to.be.a( 'object' );

    } );

    it( 'exposes the Edgy constructor function', function() {

        expect( Edgy.Edgy ).to.be.a( 'function' );

    } );

    it( 'exposes the Edgy errors module', function() {

        expect( Edgy.Errors ).to.be.a( 'module' );

    } );

    it( 'exposes the Resource constructor', function() {

        expect( Edgy.Resource ).to.be.a( 'function' );

    } );

    it( 'exposes the HttpUtils object', function() {

        expect( Edgy.HttpUtils ).to.be.a( 'object' );

    } );

    it( 'exposes the HttpRequest constructor', function() {

        expect( Edgy.HttpRequest ).to.be.a( 'function' );

    } );

} );

describe( '#Errors', function() {

    it( 'exposes InvalidAdapterConfigurationError', function() {

        expect( Edgy.Errors.InvalidAdapterConfigurationError ).to.be.a( 'function' );

    } );

    it( 'exposes InvalidHttpVerbError', function() {

        expect( Edgy.Errors.InvalidHttpVerbError ).to.be.a( 'function' );

    } );

    it( 'exposes InvalidResourceError', function() {

        expect( Edgy.Errors.InvalidResourceError ).to.be.a( 'function' );

    } );

    it( 'exposes InvalidUrlError', function() {

        expect( Edgy.Errors.InvalidUrlError ).to.be.a( 'function' );

    } );

    it( 'exposes NoConfigurationOptionsError', function() {

        expect( Edgy.Errors.NoConfigurationOptionsError ).to.be.a( 'function' );

    } );

} );

describe( '#Edgy', function() {

    it( 'it should create a new instance of the class properly', function() {

        var edgy = new Edgy.Edgy(
            { url: 'https://test.com', resource: 'user' }
        );

        expect( edgy ).to.be.a( 'object' );
        expect( edgy.__proto__.constructor.name ).to.equal( 'Edgy' );
        expect( edgy instanceof Edgy.Edgy ).to.equal( true );

    } );

    it( 'throws an error on no URL', function() {

        expect( function() {
            var edgy = new Edgy.Edgy( {
                resource: 'name'
            } )
        } ).to.throw( Edgy.Errors.InvalidUrlError );

    } );

    it( 'throws an error on invalid URL', function() {

        expect( function() {
            var edgy = new Edgy.Edgy( {
                url: 'ht:/sl.coa2',
                resource: 'name'
            } )
        } ).to.throw( Edgy.Errors.InvalidUrlError );

    } );

    it( 'getApiPath(): outputs the correct complied paths', function() {

        var edgy = new Edgy.Edgy( {
            url: 'https://test.com/api',
            versioning: {
                version: '1'
            }
        } );

        expect( edgy.getApiPath() ).to.equal( 'https://test.com/api/v1' );

        edgy = new Edgy.Edgy( {
            url: 'https://test.com/api',
            resource: 'user',
            versioning: {
                prefix: 'n',
                version: '1'
            }
        } );

        expect( edgy.getApiPath() ).to.equal( 'https://test.com/api/n1' );

    } );

} );

describe( '#HttpRequest', function() {

    var combineAtKey = function( obj, keyName ) {

        var retVal = {};
        retVal[ keyName ] = obj;

        return retVal;

    };

    var getReq = function( _method, _protect, _ct ) {

        var protect = _protect || false;
        var ct = _ct || 'application/json; charset=utf8';

        if ( ct.indexOf( 'multipart' ) > -1 ) {
            ct += '; charset=utf8; boundary=__EDGY_FORM__';
        }

        var dataObj = {
            http: {
                url: 'http://127.0.0.1:3345/api/v1/ping' + ( protect ? '/protected' : '' ),
                method: _method,
            },
            headers: {
                'content-type': ct
            }
        };

        if ( protect ) {
            dataObj.headers[ 'Authorization' ] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InByaW1hcnkiLCJpYXQiOjE1Mzc5MDk0MTV9.j7OJVdDjQcrBsT9MKUBTthxTzOC3WHsPhq2P7ub9iYI';
        }

        return new Edgy.HttpRequest( dataObj );
    };

    var verbs = [

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


    it( 'should be of correct type', function() {

        expect( Edgy.HttpRequest ).to.be.a( 'function' );
        var req = getReq( 'GET' )

        expect( req ).to.be.an( 'object' );
        expect( req.__proto__.constructor.name ).to.equal( 'HttpRequest' );
        expect( req instanceof Edgy.HttpRequest ).to.equal( true );

    } );

    verbs.forEach( function( verb ) {

        it( 'should make request <' + verb.verb + '>', function( done ) {

            var r = getReq( verb.verb );
            r.makeRequest( verb.data ).then( function( data ) {

                if ( verb.data ) {
                    expect( JSON.parse( data ) ).to.deep.equal( combineAtKey( verb.data, 'payload' ) );
                } else {
                    expect( data ).to.equal( 'Hello World!' );
                }

                done();

            } ).catch( function( ex ) {

                done( ex );

            } ) ;

        } );

        it( 'should make request <' + verb.verb + '/Protected>', function( done ) {

            var r = getReq( verb.verb, true );
            r.makeRequest( verb.data ).then( function( data ) {

                if ( verb.data ) {
                    expect( JSON.parse( data ) ).to.deep.equal( combineAtKey( verb.data, 'payload' ) );
                } else {
                    expect( data ).to.equal( 'Hello World!' );
                }

                done();

            } ).catch( function( ex ) {

                done( ex );

            } ) ;

        } );

        if ( verb.verb === 'POST' || verb.verb === 'PUT' ) {

            [ 'application/x-www-form-urlencoded', 'multipart/form-data' ].forEach( function( ct ) {

                it( 'should make request <' + verb.verb + '/' + ct + '>', function( done ) {

                    var r = getReq( verb.verb, false, ct );
                    r.makeRequest( verb.data ).then( function( data ) {

                        if ( verb.data ) {
                            expect( JSON.parse( data ) ).to.deep.equal( combineAtKey( verb.data, 'payload' ) );
                        } else {
                            expect( data ).to.equal( 'Hello World!' );
                        }

                        done();

                    } ).catch( function( ex ) {

                        done( ex );

                    } ) ;

                } );

                it( 'should make request <' + verb.verb + '/' + ct + '/Protected>', function( done ) {

                    var r = getReq( verb.verb, true, ct );
                    r.makeRequest( verb.data ).then( function( data ) {

                        if ( verb.data ) {
                            expect( JSON.parse( data ) ).to.deep.equal( combineAtKey( verb.data, 'payload' ) );
                        } else {
                            expect( data ).to.equal( 'Hello World!' );
                        }

                        done();

                    } ).catch( function( ex ) {

                        done( ex );

                    } ) ;

                } );

            } );

        }

    } );

} );
