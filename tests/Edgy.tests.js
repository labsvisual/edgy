import test from 'ava';
import { Edgy, Errors } from '../src';

const getType = o => Object.prototype.toString.call( o );

test( 'it should expose the default Edgy class', t => {

    t.is( typeof Edgy, 'function' );

} );

test( 'it should create a new object properly', t => {

    const edgy = new Edgy(
        { url: 'https://test.com', resource: 'user' }
    );

    t.is( typeof edgy, 'object' );
    t.is( edgy.__proto__.constructor.name, 'Edgy' );
    t.truthy( edgy instanceof Edgy );

} );

test( 'throws an error on no URL', t => {

    t.throws( () => {
        const edgy = new Edgy( {
            resource: 'name'
        } )
    }, Errors.InvalidUrlError );

} );

test( 'throws an error on invalid URL', t => {

    t.throws( () => {
        const edgy = new Edgy( {
            url: 'ht:/go.co',
            resource: 'name'
        } )
    }, Errors.InvalidUrlError );

} );

test( 'getApiPath(): outputs the correct complied paths', t => {

    let edgy = new Edgy( {
        url: 'https://test.com/api',
        versioning: {
            version: '1'
        }
    } );

    t.is( edgy.getApiPath(), 'https://test.com/api/v1' );

    edgy = new Edgy( {
        url: 'https://test.com/api',
        resource: 'user',
        versioning: {
            prefix: 'n',
            version: '1'
        }
    } );

    t.is( edgy.getApiPath(), 'https://test.com/api/n1' );

} );
