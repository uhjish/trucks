const options = {
  // array list of component source files
  files: null,
  // options to pass to babel
  babel: {},
  // output directory
  out: undefined,
  // name of output files (does not include a file extension)
  name: 'components',
  // set or override the file path for the HTML output
  html: undefined,
  // set or override the file path for the CSS output
  css: undefined,
  // set or override the file path for the Javascript output
  js: undefined,
  // force overwrite files if they already exist
  force: false,
  // override the default operating system EOL for file concatenation
  eol: undefined,
  // behaviour for trimming whitespace
  trim: {
    // only trim inline content
    inline: true,
    // trim leading and trailing newlines
    newlines: true,
    // pattern used to trim lines, default is two spaces or a tab
    // at the beginning of each line
    pattern: /^(  |\t){1,1}/,
    // trim lines using pattern
    lines: true
  },
  // options to pass to the compiler
  compiler: {},

  /**
   *  @private
   *
   *  Selectors used internally for processing HTML files.
   *
   *  It is strongly recommended you do not modify these values they are 
   *  declared here to prevent needing an additional module which would 
   *  invoke require().
   *
   *  These options are not documented in the API docs as they are not 
   *  intended to be modified.
   */
  selectors: {
    import: 'link[rel="import"][href]',
    styles: 'style, link[rel="stylesheet"][href]',
    scripts: 'script',
    templates: 'template, link[rel="template"][href]'
  }
}

module.exports = options;
