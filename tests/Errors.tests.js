import test from 'ava';
import { Errors } from '../src';

test( 'should contain all errors', t => {

    t.is( typeof Errors.InvalidResourceError, 'function' );
    t.truthy( Errors.InvalidResourceError );

    t.is( typeof Errors.InvalidAdapterConfigurationError, 'function' );
    t.truthy( Errors.InvalidAdapterConfigurationError );

    t.is( typeof Errors.InvalidUrlError, 'function' );
    t.truthy( Errors.InvalidUrlError );

    t.is( typeof Errors.NoConfigurationOptionsError, 'function' );
    t.truthy( Errors.NoConfigurationOptionsError );

} );
