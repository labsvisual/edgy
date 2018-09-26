describe( '#window.Edgy', function() {
    it( 'exposes the Edgy object', function() {

        expect( Edgy ).to.be.a( 'object' );
        expect( window.Edgy ).to.be.a( 'object' );

    } );

    it( 'exposes the Edgy constructor function', function() {

        expect( Edgy.Edgy ).to.be.a( 'function' );
        expect( window.Edgy.Edgy ).to.be.a( 'function' );

    } );

    it( 'exposes the Edgy errors module', function() {

        expect( Edgy.Errors ).to.be.a( 'module' );
        expect( window.Edgy.Errors ).to.be.a( 'module' );

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
