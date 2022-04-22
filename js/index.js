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
 * Display all mono classes
 */
var display_classes_base = function () {
    /**
     * Element to display all classes
     * @type {dom}
     */
    let el_div = $( 'div#classes-base' );

    /**
     * Classes
     * @type {str[]}
     */
    let tq_classes = Object.keys ( classes [ 'base' ] );
    tq_classes.sort ();
    
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
            decode_html_entities ( class_name )
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

        el_div.append (
            $( '<div />' ).append (
                el_name
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
