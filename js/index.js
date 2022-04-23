/**
 * All classes sorted by mono/duo
 * @type {dict}
 */
var classes = {
    'base': {},
    'combo': {}
};


/**
 * Translated mastery name
 * @type {dict}
 */
var mastery_name = {};


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
 * Decode html entities
 *
 * @param {string} value Value to decode
 *
 * @return {string} Value decoded
 */
var decode_html_entities = function ( value ) {
    return $( '<div/>' ).html ( value ).text ();
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
    tq_classes.sort ( function ( a, b ) {
        return a.localeCompare ( b );
    } );
    
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

        ret [ class_name ] = el_name;
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
    tq_classes.sort ( function ( a, b ) {
        return a.localeCompare ( b );
    } );
    
    tq_classes.forEach ( function ( tq_class ) {
        el_div.append (
            $( '<div />' ).append ( datas [ tq_class ] )
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
        
        ret [ tq_class ] = el_name;
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
            $( '<div />' ).append ( datas [ tq_class ] )
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
 * Load global datas
 */
var load_global_datas = function () {
    $.getJSON (
        `./datas/global.json`,
        { _: new Date ().getTime () },
        function ( datas ) {
            parse_classes (
                datas [ 'classes' ]
            );
            
            mastery_name = datas [ 'mastery_name' ];
            
            display_classes ();
        }
    );
};


$( function () {
    load_global_datas ();
} );
