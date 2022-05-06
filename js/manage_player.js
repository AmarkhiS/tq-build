/**
 * Player stats
 * @type {dict}
 */
var player_stats = {
    'health': 0,
    'energy': 0,
    'str': 0,
    'int': 0,
    'dex': 0,
    'skills': {},
    'mastery_point': 0,
    'mastery_level_required': {}
};


/**
 * Base player stats
 * @type {dict}
 */
var base_player_stats = {
    'health': 300,
    'energy': 300,
    'str': 50,
    'int': 50,
    'dex': 50
};


/**
 * Refresh all player attributs
 */
var display_player_attributs = function () {
    [ 'health', 'energy', 'str', 'int', 'dex' ].forEach ( function ( attr ) {
        $( `span#player-${attr}` ).html (
            player_stats [ attr ]
        );
    } );
};


/**
 * Update all player attributs
 */
var update_player_attributs = function () {
    [ 'health', 'energy', 'str', 'int', 'dex' ].forEach ( function ( attr ) {
        player_stats [ attr ] = base_player_stats [ attr ];
        
        for ( var mastery in masteries_mastery ) {
            /**
             * Current mastery level
             * @type {int}
             */
            let level = masteries_mastery [ mastery ];
            
            if ( level === 0 ) {
                // No stat to add
                continue;
            }
            
            if ( ( attr in masteries_stats [ mastery ] [ level ] ) === false ) {
                // Stat not on current mastery
                continue;
            }
            
            player_stats [ attr ] += masteries_stats [ mastery ] [ level ] [ attr ];
        }
    } );
    
    display_player_attributs ();
};


/**
 * Update player level from total mastery point
 */
var update_player_level = function () {
    $( 'span#player-level' ).html (
        Math.ceil ( player_stats [ 'mastery_point' ] / 3 )
    );
};


/**
 * Update player mastery point count
 *
 * @param {bool} incr True to increment value. False to decrement 
 */
var update_player_mastery_points = function ( incr = true ) {
    player_stats [ 'mastery_point' ] += ( incr ) ? 1 : -1;
    $( 'span#player-mastery-points' ).html ( player_stats [ 'mastery_point' ] );
    update_player_level ();
};


/**
 * Refresh player masteries (name & level)
 */
var display_player_masteries = function () {
    $( 'ul#player-masteries li' ).remove ();
    
    /**
     * Masteries list
     * @type {dom}
     */
    let el_ul = $( 'ul#player-masteries' );
    
    /**
     * Sorted masteries
     * @type {string[]}
     */
    let masteries = Object.keys ( masteries_mastery );
    array_str_sort_asc ( masteries );

    masteries.forEach ( function ( mastery ) {
        /**
         * Current mastery level
         * @type {int}
         */
        let level = masteries_mastery [ mastery ];
        
        /**
         * Current mastery name
         * @type {string}
         */
        let name = global_datas [ 'mastery_name' ] [ mastery ];
        
        /**
         * Current mastery list value
         * @type {dom}
         */
        let el_li = $( '<li />' ).html (
            `${name} : ${level}`
        );
        
        el_ul.append ( el_li );
    } );
    
    update_player_attributs ();
};


/**
 * Convert playser_stats.skills to clean html display
 *
 * @return {dict} Player skills per mastery
 */
var player_skills_to_display = function () {
    /**
     * Player skills per mastery
     * @type {dict}
     */
    let ret = {};
    
    /**
     * All masteries
     * @type {string[]}
     */
    let masteries = Object.keys ( player_stats [ 'skills' ] );
    
    masteries.forEach ( function ( mastery ) {
        /**
         * Current mastery name
         * @type {string}
         */
        let mastery_name = `${global_datas [ 'mastery_name' ] [ mastery ]}&nbsp;:`;
        ret [ mastery_name ] = [];
        
        /**
         * Mastery skills
         * @type {string[]}
         */
        let skills = Object.keys ( player_stats [ 'skills' ] [ mastery ] );
        
        skills.forEach ( function ( skill ) {
            ret [ mastery_name ].push (
                `${masteries_skills [ mastery ] [ skill ] [ 'name' ]}&nbsp;:&nbsp;${player_stats [ 'skills' ] [ mastery ] [ skill ]}`
            );
        } );
    } );
    
    return ret;
};


/**
 * Create dict of skills with decoded value as key, encoded as value
 *
 * @param {string[]} skills List of skills to create dict
 *
 * @return {dict} Dict of skills
 */
var parse_skills_html = function ( skills ) {
    /**
     * Dict of skills
     * @type {dict}
     */
    let ret = {};
    
    skills.forEach ( function ( skill ) {
        ret [ decode_html_entities ( skill ) ] = skill;
    } );
    
    return ret;
};


/**
 * Refresh player skills
 */
var display_player_skills = function () {
    // Flush old list
    $( 'ul#player-skills li' ).remove ();
    
    /**
     * Skills list
     * @type {dom}
     */
    let el_ul_main = $( 'ul#player-skills' );

    /**
     * All skill acquired sorted per mastery
     * @type {dict}
     */
    let datas = player_skills_to_display ();
    
    /**
     * Sorted acquired masteries
     * @type {string[]}
     */
    let masteries = Object.keys ( datas );
    array_str_sort_asc ( masteries );
    
    masteries.forEach ( function ( mastery ) {
        /**
         * Mastery list
         * @type {dom}
         */
        let el_ul = $( '<ul />' );
        
        /**
         * All skills with decoded>encoded
         * @type {dict}
         */
        let skills_fr = parse_skills_html (
            datas [ mastery ]
        );
        
        /**
         * Sorted acquired skills (decoded)
         * @type {string[]}
         */
        let skills = Object.keys ( skills_fr );
        array_str_sort_asc ( skills );
        
        skills.forEach ( function ( skill ) {
            /**
             * Skill element
             * @type {dom}
             */
            let el_li = $( '<li />' ).html (
                skills_fr [ skill ]
            );
            
            el_ul.append ( el_li );
        } );
        
        /**
         * Mastery element
         * @type {dom}
         */
        let el_li = $( '<li />' ).html ( mastery ).append ( el_ul );
        el_ul_main.append ( el_li );
    } );
};


/**
 * Update required level to each mastery
 *
 * @param {string} mastery Mastery to calcul required level
 *
 * @return {bool} False if no skill to check. True otherwise
 */
var update_player_mastery_level_required = function ( mastery ) {
    if ( ( mastery in player_stats [ 'mastery_level_required' ] ) === false ) {
        player_stats [ 'mastery_level_required' ] [ mastery ] = 0;
    }
    
    if ( typeof ( player_stats [ 'skills' ] [ mastery ] ) === undefined ) {
        // No skill to check
        player_stats [ 'mastery_level_required' ] [ mastery ] = 0;
        return false;
    }

    /**
     * All skill levels to mastery
     * @param {int[]}
     */
    let skill_levels = [];
    
    for ( let skill_id in player_stats [ 'skills' ] [ mastery ] ) {
        skill_levels.push ( masteries_skills [ mastery ] [ skill_id ] [ 'mastery_level' ] );
    }
    
    player_stats [ 'mastery_level_required' ] [ mastery ] = Math.max.apply (
        Math,
        skill_levels
    );
    
    return true;
};


/**
 * Update player skills
 *
 * @param {string} skill Skill name
 * @param {int} level Skill level
 */
var update_player_skills = function ( mastery, skill, level ) {
    if ( ( mastery in player_stats [ 'skills' ] ) == false ) {
        player_stats [ 'skills' ] [ mastery ] = {};
    }
    
    if ( level !== 0 ) {
        // Add/update skill level
        player_stats [ 'skills' ] [ mastery ] [ skill ] = level;
    } else {
        if ( skill in player_stats [ 'skills' ] [ mastery ] ) {
            // Delete skill from list
            delete ( player_stats [ 'skills' ] [ mastery ] [ skill ] );
        }
    }

    if ( Object.keys ( player_stats [ 'skills' ] [ mastery ] ).length === 0 ) {
        // No skill for current mastery, remove it
        delete ( player_stats [ 'skills' ] [ mastery ] );
    }
    
    display_player_skills ();
    
    update_player_mastery_level_required (
        mastery
    );
};


$( function () {
} );
