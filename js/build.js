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


var current_url = null;


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
    
    generate_build_url ();
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


/**
 * Dump mastery datas to get url param
 *
 * @param {string} mastery Mastery to dump
 *
 * @return {string} All mastery datas as get param
 */
var mastery_to_url = function ( mastery ) {
    /**
     * All mastery datas
     * @type {string}
     */
    let ret = [];
    
    ret.push ( `m:${mastery}` );
    ret.push ( `l:${masteries_mastery [ mastery ]}` );
    
    for ( let skill_id in player_stats [ 'skills' ] [ mastery ] ) {
        /**
         * Current skill level
         * @type {int}
         */
        let skill_level = player_stats [ 'skills' ] [ mastery ] [ skill_id ];
        skill_id = parseInt ( skill_id );
        ret.push ( `${skill_id}:${skill_level}` );
    }
    
    return ret.join ( '-' );
};


/**
 * Dump masteries datas to url
 *
 * @return {string} Masteries datas
 */
var masteries_to_url = function () {
    /**
     * Each masteries get datas
     * @type {string[]}
     */
    let ret = [];

    /**
     * Get params
     * @type {dict}
     */
    let tmp = {};
    
    tmp [ 'm1' ] = mastery_to_url ( mastery_1 );
    if ( mastery_2 !== null ) {
        tmp [ 'm2' ] = mastery_to_url ( mastery_2 );
    }
    
    for ( let get_param in tmp ) {
        ret.push ( `${get_param}=${tmp [ get_param ]}` );
    }
    
    return ret.join ( '&' );
};


/**
 * Update input build url
 *
 * @param {string} value Url to set. Default to empty url
 */
var update_export_build_value = function ( value = '' ) {
    $( '#export-build' ).val (
        value
    );
};


/**
 * Generate build url from all selected datas
 */
var generate_build_url = function () {
    if ( current_url === null ) {
        // Create base url
        current_url = window.location.href.split ( '?' ) [ 0 ];
    }
    
    /**
     * Get params to url
     * @type {string}
     */
    let datas = masteries_to_url ();
    
    update_export_build_value (
        `${current_url}?${datas}`
    );
};


/**
 * Init all handler
 */
var init_handler_build = function () {
    /**
     * Handler to match left click on input build
     */
    $( '#export-build' ).on ( 'click', function ( event ) {
        $( event.target ).select ();
        document.execCommand ( 'copy' );
        
        $( 'div#alert-msg' ).css ( 'display', 'block' );
        setTimeout ( function () {
            $( 'div#alert-msg' ).css ( 'display', 'none' );
        }, 1000 );
    } );
    
    /**
     * Handler to block all keypress on input build
     */
    $( '#export-build' ).on ( 'keypress', function ( event ) {
        return false;
    } );
};


$( function () {
    init_handler_build ();
    update_export_build_value ();
    builds_from_url ();
    load_datas ();
} );
