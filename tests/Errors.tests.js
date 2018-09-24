import { Errors } from './src';
import test from 'ava';

test( 'should contain all errors', t => {

    t.is( typeof Errors.InvalidResourceError, 'function' );
    t.truthy( Errors.InvalidResourceError instanceof Error );

} );
