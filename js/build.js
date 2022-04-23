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


/**
 * Build datas
 * @type {dict}
 */
var build_datas = {};


/**
 * Parse get params to load mastery from name
 *
 * @param {string} name Get param name to read. Should be in m1/m2
 *
 * @redirect to index.html if wrong get param name
 *
 * @return {dict} Mastery datas
 */
var parse_get_params = function ( name ) {
    if ( [ 'm1', 'm2' ].indexOf ( name ) === -1 ) {
        window.location.replace ( 'index.html' );
    }
    
    /**
     * Get param value
     */
    let get_value = new RegExp ( '[\?&]' + name + '=([^&#]*)').exec ( window.location.href );

    /**
     * Mastery datas, name/level/skills
     * @type {dict}
     */
    let ret = {
        'mastery': null,
        'level': 0,
        'skills': {}
    };
    
    if ( get_value === null ) {
        // Param get not found
        return ret;
    }
    
    get_value [ 1 ].split ( '-' ).forEach ( function ( data ) {
        /**
         * Value from get param, m/l or skill_id
         * @type {string[]}
         */
        let tmp = data.split ( ':' );
        
        switch ( tmp [ 0 ] ) {
        case 'm':
            // Mastery name
            ret [ 'mastery' ] = tmp [ 1 ];
            break;
        case 'l':
            // Mastery level
            ret [ 'level' ] = tmp [ 1 ];
            break;
        default:
            /**
             * Skill id
             * @type {int|string}
             */
            let skill_id = parseInt ( tmp [ 0 ] );
            
            /**
             * Skill level
             * @type {int}
             */
            let skill_level = parseInt ( tmp [ 1 ] );
            
            if ( ( isNaN ( skill_id ) ) || ( isNaN ( skill_level ) ) ) {
                // Wrong skill id or level
                break;
            }
            
            skill_id = ( skill_id < 10 ) ? `0${skill_id}` : `${skill_id}`;
            ret [ 'skills' ] [ skill_id ] = skill_level;
        }
    } );
    
    return ret;
}


/**
 * Load builds from get params
 */
var load_builds = function () {
    /**
     * Masteries name
     * @type {string[]}
     */
    let masteries = Object.keys ( build_datas );
    
    masteries.forEach ( function ( mastery ) {
        // Update mastery level
        for ( let i = 0 ; i < build_datas [ mastery ] [ 'level' ] ; i++ ) {
            left_click_mastery (
                mastery
            );
        }

        // Update mastey skills
        /**
         * Current mastery skills
         * @type {dict}
         */
        let skills = build_datas [ mastery ] [ 'skills' ];

        /**
         * Sorted current mastery skills ids
         * @type {string[]}
         */
        let skill_ids = Object.keys ( skills );
        array_str_sort_asc ( skill_ids );
        
        skill_ids.forEach ( function ( skill_id ) {
            for ( let i = 0 ; i < build_datas [ mastery ] [ 'skills' ] [ skill_id ] ; i++ ) {
                left_click_skill (
                    mastery,
                    skill_id
                );
            }
        } );
    } );

    hide_skill_infos ();
};


/**
 * Create builds from url
 *
 * @redirect to index.html if first mastery is not defined
 */
var builds_from_url = function () {
    /**
     * Datas from a mastery
     * @type {dict}
     */
    let datas = parse_get_params ( 'm1' );
    if ( datas [ 'mastery' ] === null ) {
        window.location.replace ( 'index.html' );
    }
    
    mastery_1 = datas [ 'mastery' ];
    build_datas [ mastery_1 ] = datas;
};


$( function () {
    builds_from_url ();
    load_datas ();
} );
