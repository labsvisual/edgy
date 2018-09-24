import Edgy from './Edgy';
import Errors from './errors';

( ( root, factory ) => {

    if ( typeof module === 'object' && module.exports ) {
        module.exports = factory();
    } else {
        root.Edgy = factory();
    }

} )( this || {}, () => {
    return {
        Edgy,
        Errors
    };
} );
