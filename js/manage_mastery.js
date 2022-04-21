var update_mastery_gauge = function ( mastery, level ) {
    if ( level > 40 ) {
        return false;
    }
    
    if ( level < 0 ) {
        return false;
    }

    masteries_mastery [ mastery ] = level;

    $( `td[class^="gauge-mastery-cell-${mastery}-"` ).removeClass ( 'gauge-mastery-cell-acquired' );

    [ 1, 4, 10, 16, 24, 32, 40 ].forEach ( function ( mastery_level ) {
        if ( level >= mastery_level ) {
            $( `td.gauge-mastery-cell-${mastery}-${mastery_level}` ).addClass ( 'gauge-mastery-cell-acquired' );
        }
    } );
    
    console.log ( masteries_mastery );
    
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
