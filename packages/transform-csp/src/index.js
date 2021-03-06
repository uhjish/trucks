const crypto = require('crypto')
    , SHA1 = 'sha1'
    , SHA256 = 'sha256'
    , SHA384 = 'sha384'
    , SHA512 = 'sha512'
    , HTML = 'csp.html'
    , TXT = 'csp.txt'
    , HEX = 'hex'
    , BASE64 = 'base64'
    , NONCE = 'nonce'
    , STATIC = 'data-static-' + NONCE
    , STYLE_SRC = 'style-src'
    , SCRIPT_SRC = 'script-src'
    , SELF = "'self'"
    , SHA = [SHA256, SHA384, SHA512];

function getNonce(node, digest) {
  const hash = crypto.createHash(SHA1);
  hash.update(Math.random().toString());
  return hash.digest(digest || HEX);
}

function getHash(node, algorithm) {
  return function() {
    const hash = crypto.createHash(algorithm);
    hash.update(node.contents);
    return hash.digest(BASE64);
  }
}

/**
 *  Generates content security policy files for styles and scripts within the 
 *  shadow DOM.
 *
 *  Each type is mapped to either a `style_src` or `script_src` policy using a 
 *  prefix of `'self'` unless disabled using the `self` option.
 *
 *  Unless the `sha` option is given the operation is in `nonce` mode which 
 *  adds a `nonce` attribute to the matched elements, if the intention is to 
 *  further process via the skate compiler you should enable the `statics` 
 *  option so that the attribute is set as `data-static-nonce`.
 *
 *  When the `sha` option is specified attributes are not added but the output 
 *  will be base64 encoded computed hashes of each element's content.
 *
 *  Generates the files `csp.html` containing a `<meta>` element describing 
 *  the content security policy and a `csp.txt` file containing a value 
 *  suitable for appending to a `Content-Security-Policy` HTTP header.
 *
 *  Use the `dir`, `text` and `html` options to change the output locations.
 *
 *  When `dir` is not given the default output directory is used.
 *
 *  @public {function} csp
 *  @param {Object} state compiler state.
 *  @param {Object} conf transform plugin configuration.
 *  @option {Boolean=true} [self] include `'self'` in the output.
 *  @option {Boolean=true} [styles] generate csp for styles.
 *  @option {Boolean=true} [scripts] generate csp for scripts.
 *  @option {String} [sha] use sha algorithm (sha256, sha384 or sha512).
 *  @option {String=csp.txt} [text] name of the text output file.
 *  @option {String=csp.html} [html] name of the html output file.
 *  @option {String} [dir] override default output directory.
 *  @option {Boolean=false} [statics] prefix attributes with `data-static-`.
 *
 *  @returns map of visitor functions.
 *
 *  See https://www.w3.org/TR/CSP2/.
 */
module.exports = function csp(state, conf) {

  conf.self = conf.self !== undefined ? conf.self : true;
  conf.styles = conf.styles !== undefined ? conf.styles : true;
  conf.scripts = conf.scripts !== undefined ? conf.scripts : true;

  const manifest = {
          styles: [],
          scripts: []
        }
      , components = state.components
      , Style = components.Style;

  let txt = TXT
    , html = HTML;

  if(conf.text === String(conf.text)) {
    txt = conf.text; 
  }

  if(conf.html === String(conf.html)) {
    html = conf.html; 
  }

  if(conf.sha && !~SHA.indexOf(conf.sha)) {
    throw new Error(
      `invalid sha value ${conf.sha}, expcting one of ${SHA.join(', ')}`); 
  }

  function policy(node, cb) {

    // only modify shadow dom scope 
    if(!node.isShadowScope()) {
      return cb();
    }

    let fn = getNonce
      , isStyle = (node instanceof Style)
      , nonce = (conf.sha === undefined)
      //, name = conf.statics ? STATIC : NONCE
      , val;

    if(conf.sha) {
      fn = getHash(node, conf.sha); 
    }

    val = fn(node);
    if(nonce) {
      if(conf.statics) {
        node.attr(STATIC, val);
      }
      node.attr(NONCE, val);
    }

    let item = {id: nonce ? NONCE : conf.sha, value: val};

    if(isStyle) {
      manifest.styles.push(item);
    }else{
      manifest.scripts.push(item);
    }

    cb();
  }

  function values(list) {
    let values = list.map((item) => {
      return "'" + item.id + '-' + item.value + "'";
    })

    if(conf.self) {
      values.unshift(SELF); 
    }

    return values.join(' ');
  }

  function rule(prefix, values) {
    let items = [prefix].concat(values);
    return items.join(' ');
  }

  let visitors = {
    end: (node, cb) => {
      // build up the meta file data
      let rules = [];

      if(manifest.styles.length) {
        rules.push(
          {src: STYLE_SRC, values: values(manifest.styles)}); 
      }

      if(manifest.scripts.length) {
        rules.push(
          {src: SCRIPT_SRC, values: values(manifest.scripts)}); 
      }

      rules = rules.map((item) => {
        return rule(item.src, item.values); 
      })

      // write out header file
      const headerFile = state.getFile(
        txt, conf.dir || state.options.out);

      headerFile.contents = [rules.join('; ')];

      // write out meta file
      const metaFile = state.getFile(
        html, conf.dir || state.options.out);

      metaFile.contents = [
        '<meta http-equiv="Content-Security-Policy"'
        + ' content="' + rules.join('; ') + '"'
        + '>'
      ];

     cb();
    }
  };

  if(conf.styles) {
    visitors.Style = policy;
  }

  if(conf.scripts) {
    visitors.Script = policy
  }

  return visitors;
}
