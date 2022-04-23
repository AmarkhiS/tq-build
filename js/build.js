/**
 * First class mastery
 * @type {?string}
 */
var mastery_1 = null;


/**
 * Second class mastery
 * @type {?string}
 */
var mastery_2 = null;



var parse_get_params = function ( name ) {
    let results = new RegExp ( '[\?&]' + name + '=([^&#]*)').exec ( window.location.href );
    let ret = {
        'mastery': null,
        'level': 0,
        'skills': {}
    };
    
    if ( results === null ) {
        return ret;
    }
    
    results [ 1 ].split ( '-' ).forEach ( function ( data ) {
        let tmp = data.split ( ':' );

        switch ( tmp [ 0 ] ) {
        case 'm':
            // Master
            ret [ 'mastery' ] = tmp [ 1 ];
            break;
        case 'l':
            ret [ 'level' ] = tmp [ 1 ];
            break;
        default:
            let skill_id = parseInt ( tmp [ 0 ] );
            let skill_level = parseInt ( tmp [ 1 ] );

            if ( ( isNaN ( skill_id ) ) || ( isNaN ( skill_level ) ) ) {
                break;
            }
            
            skill_id = ( skill_id < 10 ) ? `0${skill_id}` : `${skill_id}`;
            ret [ 'skills' ] [ skill_id ] = skill_level;
        }
    } );
    
    return ret;
}


var build_from_url = function () {
    let datas = parse_get_params ( 'm1' );
    if ( datas [ 'mastery' ] === null ) {
        window.location.replace ( 'index.html' );
    }
    
    mastery_1 = datas [ 'mastery' ];
};


$( function () {
    build_from_url ();
    
    mastery_2 = null;
    load_datas ();
} );
