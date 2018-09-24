( ( root, factory ) => {

    if ( typeof module === 'object' && module.exports ) {
        module.exports = factory();
    } else {
        root.Edgy = factory();
    }

} )( window, () => {


    return {};
} );
