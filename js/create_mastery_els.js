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
 * @param {int} mastery_level Mastery level of current row
 */
var add_row = function ( mastery, el_table, row_datas, table_conf, mastery_level ) {
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

    /**
     * Mastery gauge cell
     * @type {dom}
     */
    let el_td = $(
        '<td >'
    ).addClass (
        'gauge-mastery-cell'
    ).html (
        mastery_level
    );
    el_tr.prepend ( el_td );
    
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
    row_nums.reverse ();
    
    // Create all table rows
    
    row_nums.forEach ( function ( row_num ) {
        add_row (
            mastery,
            els_table_mastery [ mastery ],
            datas [ 'rows' ] [ row_num ],
            datas [ 'conf' ],
            row_num
        );
    } );

    /**
     * Additional row to add button to increment mastery
     * @type {dom}
     */
    let el_tr = $( '<tr />' );

    /**
     * Cell with button to increment mastery
     * @type {dom}
     */
    let el_td = $( '<td />' ).attr (
        'id',
        `button-add-mastery-${mastery}`
    ).html (
        $( '<img />' ).attr (
            'src',
            './img/global/add_mastery.jpg'
        ).attr (
            'alt',
            '+'
        )
    );
    els_table_mastery [ mastery ].append ( el_td );
    
    $( `#div-mastery-${mastery}-1` ).append ( els_table_mastery [ mastery ] );
};


/**
 * Create display place for mastery
 *
 * @param {string} mastery Mastery
 */
var create_display_place = function ( mastery ) {
    $( `#div-mastery-${mastery}-2` ).addClass (
        `display-skill-${mastery}`
    );
};


/**
 * Create mastery table & display place
 *
 * @param {string} mastery Mastery
 * @param {datas} Mastery datas
 */
var create_mastery = function ( mastery, datas ) {
    // Create mastery table
    create_table ( mastery, datas );
    
    // Mastery skill's display place
    create_display_place ( mastery, datas );
};


/**
 * Create mastery blocs
 *
 * @param {string} mastery Mastery
 */
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
    // Create mastery blocs
    create_mastery_els ( mastery );
    
    $.getJSON ( `./datas/${mastery}.json`, function ( datas ) {
        // Store mastery datas
        masteries_skills [ mastery ] = datas [ 'spells' ];
        // Create mastery table
        create_mastery ( mastery, datas [ 'table' ] );
    } );
};


$( function () {
} );
