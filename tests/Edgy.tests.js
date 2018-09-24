import test from 'ava';
import { Edgy, Errors } from '../src';

const getType = o => Object.prototype.toString.call( o );

test( 'it should expose the default Edgy class', t => {

    t.is( typeof Edgy, 'function' );

} );

test( 'it should create a new object properly', t => {

    const edgy = new Edgy();

    t.is( typeof edgy, 'object' );
    t.is( edgy.__proto__.constructor.name, 'Edgy' );
    t.truthy( edgy instanceof Edgy );

} );

test( 'throws error on no resource', t => {
    
    t.throws( () => {
        const edgy = new Edgy( {
            url: 'https://test.com/api'
        } )
    }, Errors.InvalidResourceError );

} );

test( 'getResourceUrl(): outputs the correct complied paths', t => {

    let edgy = new Edgy( {
        url: 'https://test.com/api',
        resource: 'user',
        versioning: {
            prefix: 'v',
            version: '1'
        }
    } );

    t.is( edgy.getResourceUrl(), 'https://test.com/api/v1/user' );

    edgy = new Edgy( {
        url: 'https://test.com/api',
        resource: 'user',
        versioning: {
            version: '1'
        }
    } );

    t.is( edgy.getResourceUrl(), 'https://test.com/api/1/user' );

} );
