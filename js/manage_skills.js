/**
 * Display skill place
 * @type {dom}
 */
var el_display_skill = $( 'div#display-skill' );


/**
 * Display skill infos
 *
 * @param {string} mastery Current skill mastery
 * @param {string} skill Current skill
 */
var display_skill_infos = function ( mastery, skill ) {
    /**
     * Current skill level
     * @type {string}
     */
    let current_skill_level = $( `span#counter-${mastery}-${skill}` ).html ();
    if ( parseInt ( current_skill_level ) < 10 ) {
        current_skill_level = `0${current_skill_level}`;
    }
    
    /**
     * Current skill image to display
     * @type {dom}
     */
    let skill_img = $( '<img />' ).attr (
        'src',
        `./img/${mastery}/${skill}/${current_skill_level}.jpg`
    ).attr (
        'alt',
        `${mastery} - ${skill} - ${current_skill_level}`
    );

    el_display_skill.html ( skill_img );
};


/**
 * Hide skill infos
 */
var hide_skill_infos = function () {
    el_display_skill.html ( '&nbsp;' );
};


/**
 * Handler : skill mouseover : display skill infos
 *
 * @param {string} mastery Current skill mastery
 * @param {string} skill Current skill
 */
var mouseover_skill = function ( mastery, skill ) {
    display_skill_infos (
        mastery,
        skill
    );
};


/**
 * Update skill gauge value & highlight gauge if full
 *
 * @param {string} mastery Current mastery
 * @param {skill} Current skill
 * @param {int} level Old skill level
 * @param {bool} incr True to increment skill level, false to decrement
 *
 * @return {bool} False if next level out of gauge. True otherwithe
 */
var update_skill_gauge = function ( mastery, skill, level, incr = true ) {
    /**
     * Max level of current skill
     * @type {int}
     */
    let max_skill_level = masteries_skills [ mastery ] [ skill ] [ 'max' ];
    
    // New skill level
    level += ( incr ) ? 1 : -1;
    update_player_mastery_points (
        incr
    );
    
    update_player_skills (
        mastery,
        skill,
        level
    );
    
    if ( level > max_skill_level ) {
        // Skill already at max level
        return false;
    }
    
    if ( level < 0 ) {
        // Skill already at 0
        return false;
    }
    
    $( `span#counter-${mastery}-${skill}` ).html (
        level
    );
    
    if ( level !== max_skill_level ) {
        $( `#gauge-${mastery}-${skill}` ).removeClass ( 'gauge-full' );
    } else {
        $( `#gauge-${mastery}-${skill}` ).addClass ( 'gauge-full' );
    }
    
    return true;
};


/**
 * Valid if skill mastery dep is acquired
 *
 * @param {string} mastery Current mastery
 * @param {string} skill Current mastery skill to valid
 *
 * @return True if skill mastery dep is acquired. False otherwise
 */
var is_skill_mastery_dep = function ( mastery, skill ) {
    if ( masteries_mastery [ mastery ] < masteries_skills [ mastery ] [ skill ] [ 'mastery_level' ] ) {
        // Not enought mastery level
        return false;
    }
    
    // Mastery dep acquired
    return true;
};


/**
 * Valid if skill down dep is acquired
 *
 * @param {string} mastery Current mastery
 * @param {string} skill Current mastery skill to valid
 *
 * @return True if skill down dep is acquired. False otherwise
 */
var is_skill_down_dep = function ( mastery, skill ) {
    if ( ( 'dep_down' in masteries_skills [ mastery ] [ skill ] ) === false ) {
        // No down dep
        return true;
    }
    
    if ( ( mastery in player_stats [ 'skills' ] ) == false ) {
        // Dep down required but no skill acquired
        return false;
    }
    
    /**
     * Skill has down dep
     * @type {bool}
     */
    let ret = false;
    
    masteries_skills [ mastery ] [ skill ] [ 'dep_down' ].forEach ( function ( skill_down ) {
        if ( skill_down in player_stats [ 'skills' ] [ mastery ] ) {
            // Dep acquired
            ret = true;
        }
    } );
    
    return ret;
};


/**
 * Handler : skill left click : add one level to skill
 *
 * @param {string} mastery Current skill mastery
 * @param {string} skill Current skill
 *
 * @return {bool} False if already at the max level or do not have deps acquired. True otherwise
 */
var left_click_skill  = function ( mastery, skill ) {
    /**
     * Current skill level
     * @type {int}
     */
    let current_skill_level = parseInt ( $( `span#counter-${mastery}-${skill}` ).html () );
    
    /**
     * Max level of current skill
     * @type {int}
     */
    let max_skill_level = masteries_skills [ mastery ] [ skill ] [ 'max' ];
    
    if ( current_skill_level >= max_skill_level ) {
        return false;
    }
    
    if ( is_skill_mastery_dep ( mastery, skill ) === false ) {
        return false;
    }
    
    if ( is_skill_down_dep ( mastery, skill ) === false ) {
        return false;
    }
    
    update_skill_gauge (
        mastery,
        skill,
        current_skill_level
    );
    
    // Refresh skill infos
    
    hide_skill_infos ();
    
    display_skill_infos (
        mastery,
        skill
    );
    
    return true;
};


/**
 * Valid if skill up dep is acquired
 *
 * @param {string} mastery Current mastery
 * @param {string} skill Current mastery skill to valid
 *
 * @return True if skill up dep is acquired. False otherwise
 */
var is_skill_up_dep = function ( mastery, skill ) {
    if ( ( 'dep_up' in masteries_skills [ mastery ] [ skill ] ) === false ) {
        // No up dep
        return false;
    }
    
    /**
     * Skill has up dep
     * @type {bool}
     */
    let ret = false;
    
    masteries_skills [ mastery ] [ skill ] [ 'dep_up' ].forEach ( function ( skill_up ) {
        if ( skill_up in player_stats [ 'skills' ] [ mastery ] ) {
            // Dep acquired
            ret = true;
        }
    } );
    
    return ret;
};


/**
 * Handler : skill right click : remove one level to skill
 *
 * @param {string} mastery Current skill mastery
 * @param {string} skill Current skill
 *
 * @return {bool} False if already at level 0. True otherwise
 */
var right_click_skill  = function ( mastery, skill ) {
    /**
     * Current skill level
     * @type {int}
     */
    let current_skill_level = parseInt ( $( `span#counter-${mastery}-${skill}` ).html () );
    
    if ( current_skill_level <= 0 ) {
        return false;
    }
    
    if ( current_skill_level == 1 ) {
        // Do not reduce skill to 0 if a dep up
        if ( is_skill_up_dep ( mastery, skill ) === true ) {
            return false;
        }
    }
    
    update_skill_gauge (
        mastery,
        skill,
        current_skill_level,
        false
    );
    
    // Refresh skill info
    
    hide_skill_infos ();
    
    display_skill_infos (
        mastery,
        skill
    );
    
    return true;
};


/**
 * Init all handler
 */
var init_handler_skills = function () {
    /**
     * Handler to match mouseover on a skill
     */
    el_div_masteries.on ( 'mouseover', 'tr > td.skill > img', function ( event ) {
        mouseover_skill (
            $( event.target ).data ( 'mastery' ),
            $( event.target ).data ( 'skill' )
        );
    } );

    
    /**
     * Handler to match mouseout from a skill
     */
    el_div_masteries.on ( 'mouseout', 'tr > td.skill > img', function ( event ) {
        hide_skill_infos ();
    } );
    
    
    /**
     * Handler to match left click on a skill
     */
    el_div_masteries.on ( 'click', 'tr > td.skill > img', function ( event ) {
        /**
         * Current mastery
         * @type {string}
         */
        let mastery = $( event.target ).data ( 'mastery' );
        
        /**
         * Current skill
         * @type {string}
         */
        let skill = $( event.target ).data ( 'skill' );
        
        /**
         * Number of update to perform
         * @type {int}
         */
        let nb_update = ( event.ctrlKey === false ) ? 1 : 10;
        
        for ( let i = 0 ; i < nb_update ; i++ ) {
            left_click_skill (
                mastery,
                skill
            );
        }
        
        generate_build_url ();
    } );
    
    
    /**
     * Handler to match right click on a skill
     */
    el_div_masteries.on ( 'contextmenu', 'tr > td.skill > img', function ( event ) {
        /**
         * Current mastery
         * @type {string}
         */
        let mastery = $( event.target ).data ( 'mastery' );
        
        /**
         * Current skill
         * @type {string}
         */
        let skill = $( event.target ).data ( 'skill' );
        
        /**
         * Number of update to perform
         * @type {int}
         */
        let nb_update = ( event.ctrlKey === false ) ? 1 : 10;
        
        for ( let i = 0 ; i < nb_update ; i++ ) {
            right_click_skill (
                mastery,
                skill
            );
        }
        
        generate_build_url ();
        return false;
    } );
};


$( function () {
    init_handler_skills ();
} );
