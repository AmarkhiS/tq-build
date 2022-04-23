/**
 * All classes
 * @type {dict}
 */
var classes = {};


/**
 * Mastery name (EN)
 * @type {dict}
 */
var mastery_name = {};


/**
 * Mastery name (FR)
 * @type {dict}
 */
var mastery_name_fr = {};


/**
 * Sort class per masteries
 * @type {doc}
 */
var masteries_class = {};


/**
 * Highlighting mastery flag
 * @type {bool|string}
 */
var hightligh = false;


/**
 * Store all mastery assoc en>fr & fr>en
 *
 * @param {dict} All mastery name (en>fr)
 */
var parse_masteries = function ( datas ) {
    mastery_name = datas;
    for ( let mastery in datas ) {
        mastery_name_fr [ mastery_name [ mastery ] ] = mastery;
    }
};


/**
 * Parse all classes to create matrix
 *
 * @param {dict} All classes
 */
var parse_classes = function ( datas ) {
    classes = datas;
    
    for ( tq_class in datas ) {
        /**
         * First class' mastery
         * @type {string}
         */
        let mastery_1 = datas [ tq_class ] [ 'mastery_1' ];
        
        /**
         * Second class' mastery. Could be null
         * @type {?string}
         */
        let mastery_2 = datas [ tq_class ] [ 'mastery_2' ];
        
        /**
         * Class name FR
         * @type {string}
         */
        let name = datas [ tq_class ] [ 'name' ];
        
        if ( ( mastery_1 in masteries_class ) === false ) {
            masteries_class [ mastery_1 ] = {};
        }
        
        if ( mastery_2 !== null ) {
            if ( ( mastery_2 in masteries_class ) === false ) {
                masteries_class [ mastery_2 ] = {};
            }
        }
        
        if ( mastery_2 !== null ) {
            masteries_class [ mastery_1 ] [ mastery_2 ] = name;
            masteries_class [ mastery_2 ] [ mastery_1 ] = name;
        } else {
            masteries_class [ mastery_1 ] [ 'base' ] = name;
        }
    }
};


/**
 * Create class link from masteries
 *
 * @param {string} mastery_1 First class' mastery
 * @param {string} mastery_2 Second class' mastery
 *
 * @return {string|dom} Empty string if class not found. Link with class name otherwise
 */
var create_class_link = function ( mastery_1, mastery_2 ) {
    /**
     * Class name FR
     * @type {string}
     */
    let class_name = masteries_class [ mastery_1 ] [ mastery_2 ];
    
    if ( typeof ( class_name ) === 'undefined' ) {
        return '';
    }
    
    return $(
        '<a />'
    ).attr (
        'href',
        'http://www.google.fr'
    ).html (
        string_remove_nbsp (
            class_name,
            '<br />'
        )
    );  
};


/**
 * Create mastery cell, add img & name on <th>
 *
 * @param {string} mastery Mastery name EN
 * @param {string} mastery_fr Mastery name FR
 *
 * @return {dom} Table cell with mastery content
 */
var create_mastery_cell = function ( mastery, mastery_fr ) {
    /**
     * Mastery logo
     * @type {dom}
     */
    let el_img = $(
        '<img />'
    ).attr (
        'src',
        `./img/global/logo-${mastery}.png`
    ).attr (
        'alt',
        mastery_fr
    ).data (
        'mastery',
        mastery
    );
    
    return $(
        '<th />'
    ).addClass (
        `mastery-${mastery}`
    ).append (
        el_img
    ).append (
        mastery_fr
    ).data (
        'mastery',
        mastery
    );
};


/**
 * Add row on classes table
 *
 * @param {string} mastery_row Mastery of current row
 * @param {string[]} masteries_col All masteries of columns
 */
var add_row = function ( mastery_row, masteries_col ) {
    /**
     * Classes table
     * @type {dom}
     */
    let el_table = $( 'div#classes table' );
    
    /**
     * Table row
     * @type {dom}
     */
    let el_tr = $( '<tr />' );

    /**
     * Mastery row name FR
     * @type {string}
     */
    let mastery_row_name = mastery_name_fr [ mastery_row ];
    
    // Create mastery cell
    
    el_tr.append (
        create_mastery_cell (
            mastery_row_name,
            mastery_row
        )
    );
    
    // Create base mastery class

    /**
     * Base mastery class
     * @type {dom}
     */
    let el_td = $(
        '<td />'
    ).addClass (
        `mastery-${mastery_row_name}`
    ).html (
        create_class_link (
            mastery_row_name,
            'base'
        )
    );
    el_tr.append ( el_td );
    
    // Create all masteries class
    
    masteries_col.forEach ( function ( mastery_col ) {
        /**
         * Mastery col name FR
         * @type {string}
         */
        let mastery_col_name = mastery_name_fr [ mastery_col ];
        
        /**
         * Both mastery class
         * @type {dom}
         */
        let el_td = $(
            '<td />'
        ).addClass (
            `mastery-${mastery_row_name}`
        ).addClass (
            `mastery-${mastery_col_name}`
        ).html (
            create_class_link (
                mastery_row_name,
                mastery_col_name
            )
        );

        el_tr.append ( el_td );
    } );
    
    el_table.append ( el_tr );
};


/**
 * Add table header : 2 empty cell + all masteries (without the one of the first row)
 *
 * @param {string[]} masteries_col All masteries to create cells
 */
var add_header = function ( masteries_col ) {
    /**
     * Classes table
     * @type {dom}
     */
    let el_table = $( 'div#classes table' );

    /**
     * First table row
     * @type {dom}
     */
    let el_tr = $( '<tr />' );
    
    for ( let i = 0 ; i < 2 ; i++ ) {
        /**
         * Empty cell
         * @type {dom}
         */
        let el_td = $(
            '<td />'
        ).addClass (
            'empty-cell'
        ).html (
            '&nbsp;'
        );
        el_tr.append ( el_td );
    }

    // Add all masteries cols
    
    masteries_col.forEach ( function ( mastery_col ) {
        el_tr.append (
            create_mastery_cell (
                mastery_name_fr [ mastery_col ],
                mastery_col
            )
        );
    } );
    
    el_table.append ( el_tr );
};


/**
 * Clean table : remove empty class & half-part
 */
var clean_table = function () {
    /**
     * Classes table
     * @type {dom}
     */
    let el_table = $( 'div#classes table' );
    
    /**
     * Number of column to hide on next row
     * @type {int}
     */
    let nb_cols_to_hide = 0;
    
    el_table.find ( 'tr' ).each ( function ( el_num, el ) {
        if ( el_num < 1 ) {
            // Do not remove cell on header
            return;
        }
        
        $( el ).find (
            `td:nth-last-child(-n+${nb_cols_to_hide++})`
        ).remove ();
    } );
};


/**
 * Create classes table
 */
var display_classes = function () {
    /**
     * All sorted mastery names FR
     * @type {string[]}
     */
    let masteries = Object.keys ( mastery_name_fr );
    array_str_sort_asc ( masteries );
    
    /**
     * All rows
     * @type {string[]}
     */
    let masteries_row = $.extend ( true, [], masteries );
    
    /**
     * All cols
     * @type {string[]}
     */
    let masteries_col = $.extend ( true, [], masteries );
    masteries_col.shift ();
    array_str_sort_desc ( masteries_col );

    // Add table header
    
    add_header (
        masteries_col
    );
    
    // Add all rows
    
    masteries_row.forEach ( function ( mastery ) {
        add_row (
            mastery,
            masteries_col
        );
    } );
    
    clean_table ();
};


/**
 * Load global datas
 */
var load_global_datas = function () {
    $.getJSON (
        `./datas/global.json`,
        { _: new Date ().getTime () },
        function ( datas ) {
            // Parse classes datas
            parse_classes (
                datas [ 'classes' ]
            );
            
            // Parse masteries datas
            parse_masteries (
                datas [ 'mastery_name' ]
            );
            
            // Create classes table
            display_classes ();
            
            // Init handler
            init_handler ();
        }
    );
};


/**
 * Remove all highligth
 */
var remove_highlight = function () {
    $( '.highligth' ).removeClass (
        'highligth'
    );
};


/**
 * Add highligth on all classes of a mastery
 *
 * @param {string} mastery Mastery to find all classes to highlight
 */
var add_highlight = function ( mastery ) {
    $( `.mastery-${mastery}` ).addClass (
        'highligth'
    );
};


/**
 * Hightlight all classes of a mastery
 *
 * @param {string} mastery Mastery to find all classes to highligth
 *
 * @return {bool} False if remove old highligth. True otherwise
 */
var highligh_mastery = function ( mastery ) {
    // Flush all highlight
    remove_highlight ();
    
    if ( hightligh === mastery ) {
        hightligh = false;
        return false;
    }
    
    // Highlight on a mastery
    add_highlight (
        mastery
    );
    hightligh = mastery;
    return true;
};


/**
 * Init all handler
 */
var init_handler = function () {
    /**
     * Handler to match mastery click
     */
    $( 'div#classes table' ).on ( 'click', 'th', function ( event ) {
        highligh_mastery (
            $( event.target ).data ( 'mastery' )
        );
    } );
};


$( function () {
    load_global_datas ();
} );
