import test from 'ava';
import HttpUtils from '../../lib/Edgy/HttpUtils';

const data = [ 1, 2, 3, 4 ].reduce( ( acc, current ) => {

    acc[ `key${ current }` ] = `val${ current }`;
    return acc;

}, {} );

const headerMapping = [
    {
        name: 'application/json',
        value: JSON.stringify( {
            key1: 'val1',
            key2: 'val2',
            key3: 'val3',
            key4: 'val4'
        } )
    },
    {
        name: 'application/x-www-form-urlencoded',
        value: 'key1=val1&key2=val2&key3=val3&key4=val4'
    },
    {
        name: 'multipart/form-data',
        value: '--__EDGY_FORM__\r\nContent-Disposition: form-data; name=\"key1\"\r\n\r\nval1\r\n--__EDGY_FORM__\r\nContent-Disposition: form-data; name=\"key2\"\r\n\r\nval2\r\n--__EDGY_FORM__\r\nContent-Disposition: form-data; name=\"key3\"\r\n\r\nval3\r\n--__EDGY_FORM__\r\nContent-Disposition: form-data; name=\"key4\"\r\n\r\nval4\r\n--__EDGY_FORM__--\r\n'
    },
]

test( 'should be of correct type', t => {

    t.is( typeof HttpUtils, 'object' );
    t.is( typeof HttpUtils.formatData, 'function' );

} );

headerMapping.forEach( header => {

    test( `parses data properly "${ header.name }"`, t => {

        const formatted = HttpUtils.formatData( data, {
            'content-type': header.name
        } );

        t.is( formatted, header.value );

    } );

    test( `parses data properly "${ header.name }, charset=utf8"`, t => {

        const formatted = HttpUtils.formatData( data, {
            'content-type': `${ header.name }; charset=utf8`
        } );

        t.is( formatted, header.value );

    } );

    if ( header.name.indexOf( 'multipart' ) > -1 ) {

        test( `parses data properly "${ header.name }, charset=utf8, boundary=__TEST_BOUNDARY__"`, t => {

            const formatted = HttpUtils.formatData( data, {
                'content-type': `${ header.name }; charset=utf8; boundary=__TEST_BOUNDARY__`
            } );

            t.is( formatted, header.value.replace( /__EDGY_FORM__/g, '__TEST_BOUNDARY__' ) );

        } );

    }

} );

test( 'parses querystring correctly', t => {

    const formatted = HttpUtils.formatQueryString( data );
    t.is( formatted, '?key1=val1&key2=val2&key3=val3&key4=val4' );

} );
