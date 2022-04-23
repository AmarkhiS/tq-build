/**
 * Asc sort array of str
 *
 * @param {string[]} arr Array of string to sort
 */
var array_str_sort_asc = function ( arr ) {
    arr.sort ( function ( a, b ) {
        return a.localeCompare ( b );
    } );
};


/**
 * Desc sort array of str
 *
 * @param {string[]} arr Array of string to sort
 */
var array_str_sort_desc = function ( arr ) {
    arr.sort ( function ( a, b ) {
        return b.localeCompare ( a );
    } );
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
