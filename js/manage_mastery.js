/**
 * Update mastery gauge level. Increment or decrement level & highlight correct parts
 *
 * @param {string} mastery Current mastery
 * @param {int} level New mastery level
 *
 * @return {bool} False if new level is out of gauge. True otherwise
 */
var update_mastery_gauge = function ( mastery, level ) {
    if ( level > global_datas [ 'max_mastery_level' ] ) {
        // Mastery already at max level
        return false;
    }
    
    if ( level < 0 ) {
        // Mastery already at 0
        return false;
    }
    
    masteries_mastery [ mastery ] = level;
    
    // Remove all mastery gauge highlight
    $( `td[class^="gauge-mastery-cell-${mastery}-"` ).removeClass ( 'gauge-mastery-cell-acquired' );
    
    // Highlight all correct mastery gauge part
    global_datas [ 'mastery_level' ].forEach ( function ( mastery_level ) {
        if ( level >= mastery_level ) {
            $( `td.gauge-mastery-cell-${mastery}-${mastery_level}` ).addClass ( 'gauge-mastery-cell-acquired' );
        }
    } );
    
    return true;
};


/**
 * Handler : mastery left click : add one level to mastery
 *
 * @param {string} mastery Current mastery
 *
 * @return {bool} False if already at the max level. True otherwise
 */
var left_click_mastery  = function ( mastery ) {
    /**
     * Current mastery level
     * @type {int}
     */
    let current_mastery_level = masteries_mastery [ mastery ];
    
    if ( current_mastery_level >= 40 ) {
        // Mastery already at max level
        return false;
    }
    
    update_mastery_gauge (
        mastery,
        ++current_mastery_level
    );
    
    return true;
};


/**
 * Handler : mastery right click : remove one level to mastery
 *
 * @param {string} mastery Current mastery
 *
 * @return {bool} False if already at 0. True otherwise
 */
var right_click_mastery  = function ( mastery ) {
    /**
     * Current mastery level
     * @type {int}
     */
    let current_mastery_level = masteries_mastery [ mastery ];
    
    if ( current_mastery_level <= 0 ) {
        // Mastery already at level 0
        return false;
    }
    
    update_mastery_gauge (
        mastery,
        --current_mastery_level
    );

    return true;
};


/**
 * Init all handler
 */
var init_handler_mastery = function () {
    /**
     * Handler to match left click on a mastery
     */
    el_div_masteries.on ( 'click', 'img[id^=button-add-mastery-]', function ( event ) {
        left_click_mastery (
            $( event.target ).data ( 'mastery' )
        );
    } );
    
    
    /**
     * Handler to match right click on a mastery
     */
    el_div_masteries.on ( 'contextmenu', 'img[id^=button-add-mastery-]', function ( event ) {
        right_click_mastery (
            $( event.target ).data ( 'mastery' )
        );
        return false;
    } );
};


$( function () {
    init_handler_mastery ();
} );
