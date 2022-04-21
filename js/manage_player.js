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
    'mastery_point': 0
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
    masteries.sort ();

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
        let name = global_datas [ 'masteriy_name' ] [ mastery ];
        
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
 * Refresh player skills
 */
var display_player_skills = function () {
    // Flush old list
    $( 'ul#player-skills li' ).remove ();

    /**
     * Skills list
     * @type {dom}
     */
    let el_ul = $( 'ul#player-skills' );

    /**
     * Sorted acquired skills
     * @type {string[]}
     */
    let skills = Object.keys ( player_stats [ 'skills' ] );
    skills.sort ();
    
    skills.forEach ( function ( skill ) {
        let el_li = $( '<li />' ).html (
            `${skill}&nbsp;:&nbsp;${player_stats [ 'skills' ] [ skill ]}`
        );
        
        el_ul.append ( el_li );
    } );
};


/**
 * Update player skills
 *
 * @param {string} skill Skill name
 * @param {int} level Skill level
 */
var update_player_skills = function ( skill, level ) {
    if ( level !== 0 ) {
        // Add/update skill level
        player_stats [ 'skills' ] [ skill ] = level;
    } else {
        if ( skill in player_stats [ 'skills' ] ) {
            // Delete skill from list
            delete ( player_stats [ 'skills' ] [ skill ] );
        }
    }
    
    display_player_skills ();    
};


$( function () {
} );
