/**
 * All classes sorted by mono/duo
 * @type {dict}
 */
var classes = {
    'base': {},
    'combo': {}
};


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
 * Parse classes datas to sort by mono/duo
 *
 * @param {dict} datas Classes datas
 */
var parse_classes = function ( datas ) {
    for ( let tq_class in datas ) {
        if ( datas [ tq_class ] [ 'mastery_2' ] !== null ) {
            // Class : duo
            classes [ 'combo' ] [ tq_class ] = datas [ tq_class ];
        } else {
            // Class : mono
            classes [ 'base' ] [ tq_class ] = datas [ tq_class ];
        }
    }
};


/**
 * Parse classes list to a clean ordered display
 *
 * @return {dict} Classes
 */
var parse_classes_base = function () {
    /**
     * Classes
     * @type {dict}
     */
    let ret = {};
    
    /**
     * Classes sorted by name
     * @type {string[]}
     */
    let tq_classes = Object.keys ( classes [ 'base' ] );
    array_str_sort_asc ( tq_classes );
    
    tq_classes.forEach ( function ( tq_class ) {
        /**
         * Mastery of current class
         * @type {str}
         */
        let mastery = classes [ 'base' ] [ tq_class ] [ 'mastery_1' ];
        
        /**
         * Current class name
         * @type {str}
         */
        let class_name = classes [ 'base' ] [ tq_class ] [ 'name' ];

        /**
         * Class image
         * @type {dom}
         */
        let el_img = $(
            '<img />'
        ).attr (
            'src',
            `./img/global/logo-${mastery}.png`
        ).attr (
            'alt',
            decode_html_entities ( mastery_name [ mastery ] )
        ).attr (
            'title',
            decode_html_entities ( mastery_name [ mastery ] )
        );

        /**
         * Class name : link with image & name
         * @type {dom}
         */
        let el_name = $(
            '<a />'
        ).attr (
            'href',
            'http://www.google.fr'
        ).html (
            class_name
        ).prepend (
            el_img
        );

        ret [ class_name ] = {
            'mastery': mastery,
            'el': el_name
        };
    } );
    
    return ret;
};


/**
 * Display all mono classes
 */
var display_classes_base = function () {
    /**
     * Element to display all classes
     * @type {dom}
     */
    let el_div = $( 'div#classes-base' );
    
    /**
     * Datas to display
     * @type {dict}
     */
    let datas = parse_classes_base ();
    
    /**
     * Classes
     * @type {str[]}
     */
    let tq_classes = Object.keys ( datas );
    array_str_sort_asc ( tq_classes );
    
    tq_classes.forEach ( function ( tq_class ) {
        el_div.append (
            $(
                '<div />'
            ).addClass (
                `mastery-${datas [ tq_class ] [ 'mastery' ]}`
            ).append (
                datas [ tq_class ] [ 'el' ]
            )
        );
    } );
};


/**
 * Parse classes list to a clean ordered display
 *
 * @return {dict} Classes
 */
var parse_classes_combo = function () {
    /**
     * Classes
     * @type {dict}
     */
    let ret = {};

    /**
     * Classes indexes by name str
     * @type {dict}
     */
    let datas = {};
    for ( let tq_class in classes [ 'combo' ] ) {
        datas [ decode_html_entities ( classes [ 'combo' ] [ tq_class ] [ 'name' ] ) ] = classes [ 'combo' ] [ tq_class ];
    }
    
    /**
     * All classes sorted by name
     * @type {string[]}
     */
    let tq_classes = Object.keys ( datas );
    array_str_sort_asc ( tq_classes );
    
    tq_classes.forEach ( function ( tq_class ) {
        /**
         * Masteries of current class
         * @type {str}
         */
        let masteries = [
            datas [ tq_class ] [ 'mastery_1' ],
            datas [ tq_class ] [ 'mastery_2' ]
        ];

        /**
         * Assoc with current masteries fr
         * @type {dict}
         */
        let masteries_fr = {};
        masteries.forEach ( function ( mastery ) {
            masteries_fr [ decode_html_entities ( mastery_name [ mastery ] ) ] = mastery;
        } );
        
        /**
         * French masteries of current class
         * @type {string[]}
         */
        let tmp = Object.keys ( masteries_fr );
        array_str_sort_desc ( tmp );
        
        /**
         * Class name : link with image & name
         * @type {dom}
         */
        let el_name = $(
            '<a />'
        ).attr (
            'href',
            'http://www.google.fr'
        ).html (
            tq_class
        );
        
        tmp.forEach ( function ( mastery_fr ) {
            /**
             * Class image
             * @type {dom}
             */
            let el_img = $(
                '<img />'
            ).attr (
                'src',
                `./img/global/logo-${masteries_fr [ mastery_fr ]}.png`
            ).attr (
                'alt',
                mastery_fr
            ).attr (
                'title',
                mastery_fr
            );
            
            el_name.prepend (
                el_img
            );
        } );
        
        ret [ tq_class ] = {
            'mastery_1': datas [ tq_class ] [ 'mastery_1' ],
            'mastery_2': datas [ tq_class ] [ 'mastery_2' ],
            'el': el_name
        };
    } );
    
    return ret;
};


/**
 * Display all mono classes
 */
var display_classes_combo = function () {
    /**
     * Element to display all classes
     * @type {dom}
     */
    let el_div = $( 'div#classes-combo' );

    /**
     * Classes to display
     * @type {dict}
     */
    let datas = parse_classes_combo ();
    
    /**
     * Classes
     * @type {str[]}
     */
    let tq_classes = Object.keys ( datas );
    array_str_sort_asc ( tq_classes );
    
    tq_classes.forEach ( function ( tq_class ) {
        el_div.append (
            $(
                '<div />'
            ).addClass (
                `mastery-${datas [ tq_class ] [ 'mastery_1' ]}`
            ).addClass (
                `mastery-${datas [ tq_class ] [ 'mastery_2' ]}`
            ).append (
                datas [ tq_class ] [ 'el' ]
            )
        );
    } );
};


/**
 * Display classes
 */
var display_classes = function () {
    // Classes : mono
    display_classes_base ();
    
    // Classes : duo
    display_classes_combo ();
};


/**
 * Fill filter with all masteries
 */
var create_filter = function () {
    /**
     * Select to add all options
     * @type {dom}
     */
    let el_select = $( 'div#filter-classes select' );

    /**
     * All masteries indexed by fr name
     * @type {dict}
     */
    let masteries = {};
    
    for ( let mastery in mastery_name ) {
        masteries [ decode_html_entities ( mastery_name [ mastery ] ) ] = {
            'name_fr': mastery_name [ mastery ],
            'name': mastery
        };
    };
    
    /**
     * All masteries
     * @type {string[]}
     */
    let tmp = Object.keys  ( masteries );
    array_str_sort_asc ( tmp );
    
    tmp.forEach ( function ( mastery ) {
        /**
         * Option element
         * @type {dom}
         */
        let el_opt = $(
            '<option />'
        ).attr (
            'value',
            masteries [ mastery ] [ 'name' ]
        ).html (
            masteries [ mastery ] [ 'name_fr' ]
        );
        
        el_select.append ( el_opt );
    } );
};


/**
 * Store all mastery assoc en>fr & fr>en
 *
 * @param {dict} All mastery name (en>fr)
 */
var parse_masteries = function ( datas ) {
    mastery_name = datas;
    for ( let mastery in mastery_name ) {
        mastery_name_fr [ mastery_name [ mastery ] ] = mastery;
    }
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
            
            // Display all classes
            display_classes ();
            
            // Create filter
            create_filter ();

            // Init handler
            init_handler ();
        }
    );
};


/**
 * Hide all classes
 */
var add_filter_classes = function () {
    $( 'div[class^="mastery-"]' ).addClass (
        'hide'
    );
};


/**
 * Show all classes
 */
var remove_filter_classes = function () {
    $( 'div[class^="mastery-"]' ).removeClass (
        'hide'
    );
};


/**
 * Filter classes : show only classes with mastery
 *
 * @param {string} mastery Mastery to filter classes
 *
 * @return {bool} True if correct mastery. False otherwise
 */
var filter_classes = function ( mastery ) {
    // Show all
    remove_filter_classes ();
    
    if ( ( mastery in mastery_name ) === false ) {
        return false;
    }
    
    // Hide all
    add_filter_classes ();
    
    // Show fitered
    $( `div.mastery-${mastery}` ).removeClass (
        'hide'
    );
    
    return true;
};


/**
 * Init all handler
 */
var init_handler = function () {
    /**
     * Handler to match filter change
     */
    $( 'div#filter-classes select' ).on ( 'change', function ( event ) {
        filter_classes (
            $( event.target ).val ()
        );
    } );
};


$( function () {
    load_global_datas ();
} );
