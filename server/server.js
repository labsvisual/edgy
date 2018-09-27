import path from 'path';
import Hapi from 'hapi';
import crypto from 'crypto';
import routes from './routes';

const validContexts = [ 'primary' ];

const server = Hapi.Server( {
    port: 3345,
    routes: {
        cors: true
    },
    debug: {
        request: ['*']
    }
} );

const initServer = async () => {

    try {

        await server.register( require( 'hapi-auth-jwt2' ) );

        server.auth.strategy( 'jwt', 'jwt', {
            key: '23966c94e39118a95dedbb85d75983fe97a7639a764b5df81a2492d31275d7b3',
            validate: async ( decoded, request ) => {
                return {
                    isValid: validContexts.indexOf( decoded.id ) > -1
                }
            }
        } )

        routes( server );
        await server.start();

        console.log( `Server started: ${ server.info.uri }` );

    } catch ( ex ) {
        console.error( ex.toString() );
    }

};

initServer();
