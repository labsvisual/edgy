const fns = {

    getAllKeys( obj ) {
        if ( typeof obj !== 'object' ) {
            throw new Error( `Expected 'object', got ${ typeof obj }` );
        }

        return Object.keys( obj ).filter( k => obj.hasOwnProperty( k ) );
    }

};

export default fns;
