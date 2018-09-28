import Edgy from './Edgy';
import * as Errors from './Errors';
import Resource from './Edgy/Resource';
import HttpUtils from './Edgy/HttpUtils';
import HttpRequest from './Edgy/HttpRequest';
import ResourceCollection from './Edgy/ResourceCollection';

( ( root, factory ) => {

    if ( typeof module === 'object' && module.exports ) {
        module.exports = factory();
    } else {
        root.Edgy = factory();
    }

} )( typeof window === 'undefined' ? {} : window, () => {
    return {
        Edgy,
        Errors,
        HttpUtils,
        HttpRequest,
        Resource,
        ResourceCollection
    };
} );
