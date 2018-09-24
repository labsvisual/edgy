import Edgy from './Edgy';
import * as Errors from './Errors';

( ( root, factory ) => {

    if ( typeof module === 'object' && module.exports ) {
        module.exports = factory();
    } else {
        root.Edgy = factory();
    }

} )( typeof window === 'undefined' ? {} : window, () => {
    return {
        Edgy,
        Errors
    };
} );
