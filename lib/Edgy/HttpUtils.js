const utils = {

    formatData( data, headers ) {

        const contentType = headers[ 'content-type' ];

        if ( typeof data === 'string' ) {
            return data;
        }

        if ( !contentType ) {
            return JSON.stringify( data );
        }

        const contentTypeSplit = contentType.split( ';' );
        const keys = Object.keys( data ).filter( k => data.hasOwnProperty( k ) );

        switch ( contentTypeSplit[ 0 ] ) {

            case 'application/x-www-form-urlencoded':

                const firstKey = keys.splice( 0, 1 );
                let str = `${ firstKey }=${ data[ firstKey ] }`;

                return keys.reduce( ( acc, current ) => {

                    acc += `&${ current }=${ data[ current ] }`;
                    return acc;

                }, str );

                break;

            case 'multipart/form-data':

                let boundary = '__EDGY_FORM__';

                if ( contentTypeSplit[ 2 ] && contentTypeSplit[ 2 ].indexOf( 'boundary' ) > -1 ) {
                    boundary = contentTypeSplit[ 2 ].split( '=' )[ 1 ];
                }

                const formattedString = keys.reduce( ( acc, current ) => {

                    acc += `--${ boundary }\r\n`
                    acc += `Content-Disposition: form-data; name="${ current }"`;
                    acc += `\r\n\r\n${ data[ current ] }\r\n`;
                    return acc;

                }, '' );

                return formattedString + `--${ boundary }--\r\n`;


            case 'application/json':
            default:
                return JSON.stringify( data );

        }

    },

    formatQueryString( data ) {

        const keys = Object.keys( data ).filter( k => data.hasOwnProperty( k ) );
        const firstKey = keys.splice( 0, 1 );
        let str = `?${ firstKey }=${ data[ firstKey ] }`;

        return keys.reduce( ( acc, current ) => {

            acc += `&${ current }=${ data[ current ] }`;
            return acc;

        }, str );

    }

};

export default utils;
