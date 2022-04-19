/**
 * All masteries
 * @type {dom}
 */
var el_div_masteries = $( 'div#masteries' );


/**
 * Part to each mastery
 * @type {dict}
 */
var els_mastery = {};


/**
 * Table to each mastery
 * @type {dict}
 */
var els_table_mastery = {};


/**
 * Datas to each mastery
 * @type {dict}
 */
var masteries_skills = {};


/**
 * Create empty cell
 *
 * @param {dom} el_tr Row to add cell
 * @param {dom} el_td Cell to add
 */
var create_cell_empty = function ( el_tr, el_td ) {
    el_td.append ( '&nbsp;' );
    el_tr.append ( el_td );
};


/**
 * Create connection cell
 *
 * @param {dom} el_tr Row to add cell
 * @param {dom} el_td Cell to add
 */
var create_cell_connection = function ( connection, el_tr, el_td ) {
    el_td.append (
        $( '<img />' ).attr (
            'src',
            `./img/global/${connection}.png`
        ).attr (
            'alt',
            connection
        )
    );
    el_tr.append ( el_td );
};


/**
 * Create skill cell with img / counter
 *
 * @param {string} mastery Mastery of the skill to add
 * @param {string} skill Skill to add
 * @param {dom} el_tr Row to add cell
 * @param {dom} el_td Cell to add
 */
var create_cell_skill = function ( mastery, skill, el_tr, el_td ) {
    el_td.addClass (
        'skill'
    ).attr (
        'id',
        `cell-${mastery}-${skill}`
    );
    
    el_td.append (
        $( '<img />' ).attr (
            'src',
            `./img/${mastery}/${skill}.png`
        ).attr (
            'id',
            `logo-${mastery}-${skill}`
        ).attr (
            'alt',
            skill
        ).data (
            'mastery',
            mastery
        ).data (
            'skill',
            skill
        )
    );
    
    /**
     * Skill counter
     * @type {dom}
     */
    let el_span_counter = $( '<span />' ).attr (
        'id',
        `counter-${mastery}-${skill}`
    ).html (
        0
    );
    
    /**
     * Max level of current skill
     * @type {int}
     */
    let max_skill = masteries_skills [ mastery ] [ skill ] [ 'max' ];
    
    /**
     * Skill counter display
     * @type {dom}
     */
    let el_span = $( '<span />' ).attr (
        'id',
        `gauge-${mastery}-${skill}`
    ).append (
        el_span_counter
    ).append (
        `&nbsp;/&nbsp;${max_skill}`
    );
    
    el_td.append ( el_span );
    el_tr.append ( el_td );
}


/**
 * Add new row to mastery table
 * 
 * @param {string} mastery Current mastery
 * @param {dom} el_table Table of mastery
 * @param {dict} row_datas Datas to add to row
 * @param {dict} table_conf Additional conf for table
 */
var add_row = function ( mastery, el_table, row_datas, table_conf ) {
    /**
     * New row
     * @type {dom}
     */
    let el_tr = $( '<tr/>' ).addClass (
        `row-mastery-${mastery}`,
    ).css (
        "border-color",
        `rgba(${table_conf.tr.border_color.r},${table_conf.tr.border_color.g},${table_conf.tr.border_color.b},${table_conf.tr.border_color.a})`
    );
    
    for ( var col_num = 1 ; col_num < 13 ; col_num++ ) {
        /**
         * New cell
         * @type {dom}
         */
        let el_td = $( '<td />' );
        
        if ( ( col_num in row_datas ) === false ) {
            // Empty cell, nothing to add
            create_cell_empty ( el_tr, el_td );
            continue;
        }
        
        /**
         * Cell value
         * @type {string}
         */
        let value = row_datas [ col_num ];
        
        if ( [ 'top-bracket', 'middle-bracket', 'bottom-bracket', 'pipe' ].indexOf ( value ) !== -1 ) {
            // Connection cell. Add img
            create_cell_connection ( value, el_tr, el_td );
            continue;
        }
        
        // Skill cell. Add img & counter
        create_cell_skill ( mastery, value, el_tr, el_td );
        continue;
    }

    el_table.append ( el_tr );
};


/**
 * Create mastery table
 *
 * @param {string} mastery Current mastery table
 * @param {dict} Table datas
 */
var create_table = function ( mastery, datas ) {
    /**
     * Each row num
     * @type {int[]}
     */
    let row_nums = Object.keys ( datas [ 'rows' ] ).map ( function ( row_num ) {
        return parseInt ( row_num );
    } );
    row_nums.sort ();
    
    // Create all table rows
    
    row_nums.forEach ( function ( row_num ) {
        add_row (
            mastery,
            els_table_mastery [ mastery ],
            datas [ 'rows' ] [ row_num ],
            datas [ 'conf' ]
        );
    } );
    
    $( `#div-mastery-${mastery}-1` ).append ( els_table_mastery [ mastery ] );
};


var create_display_place = function ( mastery ) {
    $( `#div-mastery-${mastery}-2` ).addClass (
        `display-skill-${mastery}`
    );
};


var create_mastery = function ( mastery, datas ) {
    // Create mastery table
    create_table ( mastery, datas );
    
    create_display_place ( mastery, datas );
};


var create_mastery_els = function ( mastery ) {
    els_mastery [ mastery ] = $( '<table />' ).attr (
        'id',
        `div-mastery-${mastery}`
    );
    let el_tr = $( '<tr />' );
    for ( let i = 0 ; i < 3 ; i++ ) {
        let el_td = $( '<td />' ).attr (
            'id',
            `div-mastery-${mastery}-${i}`
        );
        el_tr.append ( el_td );
    }
    
    els_mastery [ mastery ].append ( el_tr );
    els_table_mastery [ mastery ] = $( '<table />' ).addClass ( `mastery-${mastery}` );
    el_div_masteries.append ( els_mastery [ mastery ] );
};


/**
 * Load mastery datas
 *
 * @param {string} mastery Mastery to load
 */
var load_datas = function ( mastery ) {
    create_mastery_els ( mastery );
    
    $.getJSON ( `./datas/${mastery}.json`, function ( datas ) {
        // Store mastery datas
        masteries_skills [ mastery ] = datas [ 'spells' ];

        create_mastery ( mastery, datas [ 'table' ] );
        
    } );
};


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
 */
var hide_skill_infos = function () {
    $( '#skill-display' ).remove ();
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
    init_handler ();
} );
