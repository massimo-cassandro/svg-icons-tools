/**
 * svg-icons-tools configuration file
 * ----------------------------
 * all paths relative to the work directory
 *
 * More info at https://github.com/massimo-cassandro/svg-icons-tools
 *
 * run with (from the svg-icons-tools work dir): `npx iconsTools`
 * or specifing a path for the config file: `npx iconsTools --config path/to/config.mjs`
 *
 * All paths in this config object are relative to the folder containing the config file
 *
 */

const config = {

  /**
   * SVG to JSX components
   */
  jsx: {
    /**
     * Source folders
     *
     * Every file with svg extension in these folders will be processed
     * Sub dirs are ignored.
     * the `fill` array must contains the icons that use the `fill` attribute
     * similarly, the `stroke` one must contains the icons that use the `stroke` attribute
     * It is possible to manage both types of icons at the same time, otherwise leave
     * them empty or remove the ones you don't need.
     * If you don't need this feature, just remove the whole `jsx` object
     */
    source_folders: {
      fill: [],
      stroke: []
    },

    /**
     * Optional prefix/suffix to be added to the icon names
     */
    add_prefix: '',
    add_suffix: '',

    /**
     * Function to create each JSX icon file
     *
     * Change it as you like. The `parsed_svg` argument is the object returned by the parse function
     * and contains:
     *  - svg: the whole optimized svg markup (including the svg tag),
     *  - viewbox: the viewbox attribute content,
     *  - svg_content: the optimized svg markup without the svg tag)
     *  - classes: the aspect ratio class as per the `non_square_icons_classes` parameter and or
     *             the 'fill` or `stroke` class as per the `icon_type_class` parameter
     *  - filename: the name of the svg file without extension and with the `remove_prefix` strings removed
     *  - filename_camel_case: the filename in camel case (nb: dashes follewed ny numbers are converted to underscores)
     *
     * The function must return an object with the following properties:
     *  - component_name: the name of the component
     *  - jsx_content: the jsx content of the component
     *
     * Each jsx will be saved in a file named as `<component_name>.jsx` in the `dest_folder` folder
     *
     * NB: Since it is assumed that most attributes in the svg content have been removed
     * during optimization, no further cleanup is performed and therefore it is not guaranteed
     * that `parsed_svg.content` is valid JSX markup.
     * If you decide to keep some attributes in the SVGO options, you should check the svg content
     * and possibly modify the function accordingly.
     *
     * NB: this release doesn't include any prettify feature.
     */
    icon_builder: function (parsed_svg) {
      const component_name = `${this.add_prefix?? ''}${parsed_svg.filename_camel_case}${this.add_suffix?? ''}`;

      return {
        component_name: component_name,
        jsx_content: `export function ${component_name}() {
          return <svg viewBox="${parsed_svg.viewbox}"
            role="img"
            ${parsed_svg.classes.length? `className="${parsed_svg.classes.join(' ')}"` : ''}
            xmlns="http://www.w3.org/2000/svg"
          >
            ${parsed_svg.svg_content}
          </svg>;
        }`
      };
    },

    /* path to the folder where the jsx components will be saved */
    dest_folder: '',

    /*
     * path to jsx icons index file
     *
     * Optional file that contains all generated icons as named exports.
     * Leave empty o remove if yoiu don't need it
     */
    index_file: '',
  },

  /**
   * svg file to be optimized
   */
  optimize: {
    /**
     * Source folders
     *
     * See comment at `jsx` for more details
     * Leave empty  or remove the whole `optimize` obj if you don't need this feature
     */
    source_folders: {
      fill: [],
      stroke: []
    },

    /* path to the folder where the optimized files will be saved */
    dest_folder: '',
  },

  /**
   * SVG as symbols
   *
   * Parameters to combine many svg files into a single svg file with symbols
   * If you don't need this feature, just remove the `symbols` object or leave paths empty
   */
  symbols: {
    /**
     * Source folders
     *
     * Every file with svg extension in these folders will be processed
     * Sub dirs are ignored.
     * Leave empty  or remove the whole `symbols` obj if you don't need this feature
     *
     * NB: stroke and fill icons are handled by adding some classes to the `symbol` tag.
     * The same goes for non-square icons.
     * Adding classes to the `symbol` tag is useful for styling icons with css,
     * but it is not a well documented feature and may not work as expected in all browsers.
     * Be aware of this if you plan to use this feature.
     */
    source_folders: {
      fill: [],
      stroke: []
    },

    /* path of the processed svg file */
    dest_file: '',

    /* if true, the xml declaration (`<?xml version...`) is added to the resulting file */
    add_xml_declaration: true,

    /* if true, the svg doctype (`<!DOCTYPE svg PUBLIC...`) is added to the resulting file */
    add_svg_doctype: true,

    /* if true, the `hidden` attribute is added to the svg tag of the resulting file */
    add_hidden_attribute: true,

    /**
     * optional path to the js file that will contain the list of icons converted as symbols.
     *
     * Leave empty if you don't need it
     *
     * @example
     * icons_list_file: './path/to/icons-list.js',
     */
    icons_list_file: '',

    /**
     * optional template for building the icons demo file
     *
     * A basic tpl file is provided when the script is launched with `init` option:
     * you can customize it as you like.
     * If you don't need this feature, remove the tpl file and leave empty or remove
     * the `demo_tpl_path` parameter
     *
     * @example
     * demo_tpl_path: './path/to/symbols-demo-tpl.html',
     */
    demo_tpl_path: '',

    /**
     * optional path for generated demo file
     *
     * It includes the list of icons converted as symbols and the symbols file itself,
     * so it can be viewed in a browser using the `file:///` protocol.
     * Requires the `demo_tpl_path` parameter to be set.
     * Leave this parameter empty if you don't need it
     *
     * @example
     * demo_file_path: './symbols-demo.html',
     */
    demo_file_path: '',
  },


  /**
   * GLOBAL PARAMETERS
   *
   * These parameters are used in all the features
   */

  /*
   * prefixes of the svg files names to be removed in `symbols` ids and in jsx and
   * optimized files names
   */
  remove_prefix: [],

  /**
   * SVGO configuration
   *
   * see https://svgo.dev/docs/plugins/
   */
  svgo_config: {
    multipass: true,
    plugins: [
      { name: 'cleanupIds', params: { remove: true, minify: true } }
      , 'removeDoctype'
      , 'removeComments'
      , 'removeTitle'
      , 'removeDimensions'
      , 'collapseGroups'
      , { name: 'cleanupNumericValues', params: { floatPrecision: 4  } }
      , { name: 'convertColors', params: { names2hex: true, rgb2hex: true } }
      , 'removeStyleElement'
      , 'removeEmptyContainers'
      // , { name: 'removeAttrs', params: { attrs: ['(fill|stroke|class|style|data.*)', 'svg:(width|height)'] } }
      // , { name: 'removeAttrs', params: { attrs: ['(filter|fill|stroke|class|style|data.*)', 'svg:(width|height)'] } }
      , { name: 'removeAttrs', params: { attrs: ['(filter|fill|stroke|fill-rule|clip-rule|stroke-linecap|stroke-linejoin|stroke-width|transform|style|class|data.*)', 'svg:(width|height)'] } }
      , 'removeUselessDefs'
      //, { name: 'addAttributesToSVGElement0, params: {attribute: "#{$attr}"}}
      // , { name: 'addClassesToSVGElement', params: { className: 'line-icon'  } }
    ]
  },

  /**
   * “pallet” markups to be removed from the svg files
   *
   * As clearly explained on the [remixicon site](https://remixicon.com/),
   * the "pallet" is a transparent rectangle that ensures that the SVGs maintain
   * their dimensions in your design software. They are not necessary in the final SVGs,
   * and can even produce unwanted effects, so they are removed.
   * Each item is a regular expression.
   */
  pallets: [
    /<rect width="256" height="256" fill="none" ?\/?>(<\/rect>)?/gmi, // phosphoricons raw
    /<path fill="none" d="(M0 0h24v24H0z|M0 0h256v256H0z)" ?\/?>(<\/path>)?/gmi, // remixicons with 'pallets' option (and others)
  ],

  /**
   * Opacity classes for duotone icons
   *
   * Convert opacity values to predefined classes
   * the key is the decimal part of the opacity value (e.g.: 2 == 0.2), the value
   * is the class to be added in place of the opacity value.
   * The purpose of this feature is to convert the opacity values of duotone icons
   * to predefined classes, merging similar values to an unique class:
   * the script will assign the class whose key is the closest to the opacity value.
   * For example, both 0.2 and 0.26 opacity values are converted
   * to the class `duotone-light` (whose key is 2). You then only need to set the classes in your css.
   * NB: only opacity attributes applied to elements inside the svg tag will be considered.
   * If you don't want to use this feature, remove the `opacity_classes` object or leave it empty
   *
   * @example
   * opacity_classes: {
   *   2: 'duotone-light',
   *   4: 'duotone-medium',
   *   6: 'duotone-dark',
   * },
   */
  opacity_classes: {},

  /**
     * Icon type classes
     *
     * Optional classes to be added to fill and or stroke icons
     * leave empty or remove if you don't need them
     *
     * @example
     * icon_type_class: {
     *   fill: 'fill-icons',
     *   stroke: 'stroke-icons',
     * },
     */
  icon_type_class: {
    fill: '',
    stroke: ''
  },

  /**
   * Non-square icons classes
   *
   * Assign specific classes to non-square icons.
   * Assuming that all icons have the viewBox attribute, and that all viewboxes
   * origin is at 0 0, the script analizes all icons widths and heights
   * and detect those with non-square aspect ratio.
   * Then, the values are compared (after being rounded to two decimal places)
   * to find the closest aspect ratio among
   * those listed in the `non_square_icons_classes` array. The class corresponding
   * to the found value is then assigned to the icon.
   * The first value of each subarray of `non_square_icons_classes` is the aspect ratio
   * (width / height), the second is the class to be assigned.
   * If you don't want to use this feature, remove the `non_square_icons_classes`
   * array or leave it empty
   *
   * NB: Although aspect-ratio classes are added to `symbol` tags, this functionality
   * is not supported in SVGs with that element type.
   *
   * @example
   * non_square_icons_classes: [
   *   [ 3/4, 'icon-3-4'],
   *   [ 3/5, 'icon-3-5'],
   *   [ 2/3, 'icon-2-3'],
   * ],
   */
  non_square_icons_classes: [],


  /**
   * Console colors
   *
   * Colors for console output as defined in <https://nodejs.org/api/util.html#customizing-utilinspect-colors>
   * The default colors work well on dark background terminals, if you have a light background terminal, you may
   * need to change the colors.
   */
  console_colors: {
    error    : 'bgRed',
    warning  : 'red',
    success  : 'bgGreen',
    info     : 'yellow',
    infoDim  : ['yellow', 'dim'],
  },


  /**
   * LEGACY
   * Features mantained for compatibility reasons
   */

  /**
   * Svg to scss variables
   * Generate scss variables from specified svg icons
   */
  svg_to_scss: {
    /* icons to be converted to scss variables.
     * Paths of the svg files to be processed (relative to config file).
     * Icons will be parsed and optimized then converted to scss variables.
     * The variable names will be the same as the file names, without extensions
     * and parts removed as per the `remove_prefix` parameter.
     */
    files: [],

    /* if true, the svg files are converted to data urls */
    convert_to_css_url: true,

    /* path of the generated scss file */
    scss_icons_file: '_icons-svg.scss',
  }

};


export default config;
