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
    ).attr (
        'id',
        'skill-display'
    );

    $( `.display-skill-${mastery}` ).html ( skill_img );
};


/**
 * Hide skill infos
 *
 * @param {string} mastery Current mastery
 */
var hide_skill_infos = function ( mastery ) {
    $( `.display-skill-${mastery}` ).html ( '&nbsp;' );
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


var update_skill_gauge = function ( mastery, skill, level, incr = true ) {
    /**
     * Max level of current skill
     * @type {int}
     */
    let max_skill_level = masteries_skills [ mastery ] [ skill ] [ 'max' ];

    level += ( incr ) ? 1 : -1;
    
    if ( level > max_skill_level ) {
        return false;
    }
    
    if ( level < 0 ) {
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
 * Handler : skill left click : add one level to skill
 *
 * @param {string} mastery Current skill mastery
 * @param {string} skill Current skill
 *
 * @return {bool} False if already at the max level. True otherwise
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
    
    update_skill_gauge (
        mastery,
        skill,
        current_skill_level
    );
    
    hide_skill_infos (
        mastery
    );
    
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
 * @return {bool} False if already at the level 0. True otherwise
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
    
    hide_skill_infos (
        mastery
    );
    
    display_skill_infos (
        mastery,
        skill
    );
    
    return true;
};


/**
 * Init all handler
 */
var init_handler = function () {
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
        hide_skill_infos (
            $( event.target ).data ( 'mastery' )
        );
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
    init_handler ();
} );
