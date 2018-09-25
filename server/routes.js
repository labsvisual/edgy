import Controller from './controller';
import jwt from 'jsonwebtoken';

export default ( server ) => {

    server.route( {

        method: 'GET',
        path: '/api/v1/ping',
        handler: Controller.handle

    } );

    server.route( {

        method: 'POST',
        path: '/api/v1/ping',
        handler: Controller.handle

    } );

    server.route( {

        method: 'PUT',
        path: '/api/v1/ping',
        handler: Controller.handle

    } );

    server.route( {

        method: 'DELETE',
        path: '/api/v1/ping',
        handler: Controller.handle

    } );

    server.route( {

        method: 'GET',
        path: '/api/v1/ping/protected',
        handler: Controller.handle,
        config: {
            auth: 'jwt'
        }

    } );

    server.route( {

        method: 'POST',
        path: '/api/v1/ping/protected',
        handler: Controller.handle,
        config: {
            auth: 'jwt'
        }

    } );

    server.route( {

        method: 'PUT',
        path: '/api/v1/ping/protected',
        handler: Controller.handle,
        config: {
            auth: 'jwt'
        }

    } );

    server.route( {

        method: 'DELETE',
        path: '/api/v1/ping/protected',
        handler: Controller.handle,
        config: {
            auth: 'jwt'
        }

    } );

};
