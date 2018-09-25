const controller = {

    async handle( request, h ) {
        try {
            let dataObj = {};

            if ( request.payload ) {
                dataObj.payload = { ...request.payload };
            }

            if ( request.query && Object.keys( request.query ).length > 0 ) {
                dataObj.query = { ...request.query };
            }

            return ( dataObj.query || dataObj.payload ) ? JSON.stringify( dataObj ) : 'Hello World!';
        } catch ( ex ) {
            throw ex;
        }
    }

};

export default controller;
