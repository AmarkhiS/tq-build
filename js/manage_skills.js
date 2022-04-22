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
 * Valid if all skill deps are acquired
 *
 * @param {string} mastery Current mastery
 * @param {string} skill Current mastery skill to valid
 *
 * @return True if all skill deps are acquired. False otherwise
 */
var is_all_skill_deps = function ( mastery, skill ) {
    if ( masteries_mastery [ mastery ] < masteries_skills [ mastery ] [ skill ] [ 'mastery_level' ] ) {
        // Not enought mastery level
        return false;
    }
    
    if ( ( 'dependency' in masteries_skills [ mastery ] [ skill ] ) === false ) {
        // No more deps to valid
        return true;
    }
    
    // All deps acquired
    return true;
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
    
    if ( is_all_skill_deps ( mastery, skill ) === false ) {
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
        left_click_skill (
            $( event.target ).data ( 'mastery' ),
            $( event.target ).data ( 'skill' )
        );
    } );
    
    
    /**
     * Handler to match right click on a skill
     */
    el_div_masteries.on ( 'contextmenu', 'tr > td.skill > img', function ( event ) {
        right_click_skill (
            $( event.target ).data ( 'mastery' ),
            $( event.target ).data ( 'skill' )
        );
        return false;
    } );
};


$( function () {
    init_handler_skills ();
} );
