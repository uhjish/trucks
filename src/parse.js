const path = require('path')
    , fs = require('fs')
    , selectors = require('./selectors')
    , Module = require('./component').Module
    , Template = require('./component').Template
    , Style = require('./component').Style
    , Script = require('./component').Script
    , STYLE = 'style'
    , TEMPLATE = 'template'
    , ID = 'id'
    , RESERVED = [
        'annotation-xml',
        'color-profile',
        'font-face',
        'font-face-src',
        'font-face-uri',
        'font-face-format',
        'font-face-name',
        'missing-glyph'
      ];

/**
 *  Utility to validate a custom element name.
 *
 *  @private {function} validate
 *
 *  @see https://w3c.github.io/webcomponents/spec/custom/ \ 
 *    #custom-elements-core-concepts
 */
function validate(id) {
  if(~RESERVED.indexOf(id)) {
    throw new Error(`${id} is a reserved custom element name`); 
  }

  const re = new RegExp('(-|\\.|[0-9]|_|[a-z]|\\uB7'
      + '|[\\uC0-\\uD6]'
      + '|[\\uD8-\\uF6]'
      + '|[\\uF8-\\u37D]'
      + '|[\\u37F-\\u1FFF]'
      + '|[\\u200C-\\u200D]'
      + '|[\\u203F-\\u2040]'
      + '|[\\u2070-\\u218F]'
      + '|[\\u2C00-\\u2FEF]'
      + '|[\\u3001-\\uD7FF]'
      + '|[\\uF900-\\uFDCF]'
      + '|[\\uFDF0-\\uFFFFD]'
      + '|[\\u10000-\\uEFFFF]'
      + ')*')
    , ptn = new RegExp(
      '^[a-z]'
      + re.source
      + '-'
      + re.source
    );

  if(!ptn.test(id)) {
    throw new Error(`invalid custom element name ${id}`); 
  }
}

/**
 *  Utility to trim a result object contents removing leading and trailing 
 *  newlines.
 *
 *  @private {fuction} trim
 *  @param {Object} item the parsed item.
 *  @param {Object} options the trim options.
 */
function trim(item, options) {
  // only configured to trim inline content
  if(!options || (options.inline && !item.inline)) {
    return; 
  }

  // trim leading and trailing newlines
  if(options.newlines) {
    item.contents = item.contents.replace(/^\n+/, '');
    item.contents = item.contents.replace(/[\n ]+$/, '');
  }

  // trim every line
  if(options.lines && (options.pattern instanceof RegExp)) {
    let lines = item.contents.split('\n');
    lines = lines.map((line) => {
      return line.replace(options.pattern, ''); 
    })
    item.contents = lines.join('\n');
  }
}

/**
 *  Compile all inline `<template>` elements an array of HTML strings.
 *
 *  @private
 */
function templates(mod, state, el, cb) {
  const file = mod.parent.file
      , base = path.dirname(file)
      , $ = mod.querySelectorAll;

  let trait;

  function done(item) {

    item.querySelectorAll = state.parser.parse(item.contents);

    const templates = item.querySelectorAll(TEMPLATE)
      , prefix = /-$/.test(mod.id) ? mod.id : mod.id + '-';

    templates.each((index, elem) => {
      const el = $(elem)
        , id = el.attr(ID);

      // inherit template from module
      if(!id) {
        el.attr(ID, mod.id);
      // prefix module id to template with existing
      // identifier and treat as a partial template
      }else{
        el.attr(ID, `${prefix + id}`); 
      }
    })

    // update trait contents and query
    // as we have written the dom with id attributes
    item.contents = $.html(templates);
    item.querySelectorAll = state.parser.parse(item.contents);

    trim(item, state.options.trim); 
    mod.templates.push(item);
    state.result.templates.push(item);
    cb(null, item);
  }

  // inline template element
  if(el.name === TEMPLATE) {
    trait = new Template(el, $.html(el), mod);
    done(trait);
  // external template reference
  }else{
    const href = $(el).attr('href')
      , pth = path.normalize(path.join(base, href));
    fs.readFile(pth, (err, contents) => {
      if(err) {
        return cb(err); 
      } 

      trait = new Template(el, contents.toString(), mod, href, file);
      done(trait);
    })
  }
}

/**
 *  Compile all inline and external stylesheets to an array of CSS strings.
 *
 *  @private
 */
function styles(mod, state, el, cb) {
  const file = mod.parent.file
    , base = path.dirname(file)
    , $ = mod.querySelectorAll;

  let trait;

  function done(item) {
    item.querySelectorAll = state.parser.parse(item.contents);
    trim(item, state.options.trim); 
    mod.styles.push(item);
    state.result.styles.push(item);
    cb(null, item);
  }

  // inline style element
  if(el.name === STYLE) {
    trait = new Style(el, $(el).text(), mod);
    done(trait);
  // external stylesheet reference
  }else{
    const href = $(el).attr('href')
      , pth = path.normalize(path.join(base, href));

    fs.readFile(pth, (err, contents) => {
      if(err) {
        return cb(err); 
      } 

      trait = new Style(
        el, contents.toString(), mod, href, file);
      done(trait);
    })
  }
}

/**
 *  Compile all inline and external scripts to an array of Javascript strings.
 *
 *  @private
 */
function scripts(mod, state, el, cb) {
  const file = mod.parent.file
      , base = path.dirname(file)
      , $ = mod.querySelectorAll
      , src = $(el).attr('src');

  let trait;

  function done(item) {
    item.querySelectorAll = state.parser.parse(item.contents);
    trim(item, state.options.trim); 
    mod.scripts.push(item);
    state.result.scripts.push(item);
    cb(null, item);
  }

  // inline script element
  if(!src) {
    trait = new Script(el, $(el).text(), mod);
    done(trait);
  // external script reference
  }else{
    const href = $(el).attr('src')
      , pth = path.normalize(path.join(base, href));
    fs.readFile(pth, (err, contents) => {
      if(err) {
        return cb(err); 
      } 
      trait = new Script(
        el, contents.toString(), mod, href, file);
      done(trait);
    })
  }
}

/**
 *  Iterate the elements returned by a DOM query.
 *
 *  @private
 */
function iterator(mod, state, elements, it, cb) {
  const options = state.options;

  function next(err, item) {
    if(err) {
      return cb(err); 
    }

    if(item
      && item.contents === String(item.contents)
      && options.id
      && options.id.replace
      && (options.id.pattern instanceof RegExp)) {

      item.contents = item.contents.replace(
        options.id.pattern, mod.id); 
    }

    const el = elements.shift();
    if(!el) {
      return cb(); 
    }

    it(mod, state, el, next);
  }
  next();
}

/**
 *  Iterate the templates, scripts and styles in a component module.
 *
 *  @private
 */
function component(mod, state, cb) {
  const $ = mod.querySelectorAll
    , context = mod.context;

  // process styles first and maintain declaration order
  let elements = $(selectors.styles, context).toArray();
  iterator(mod, state, elements, styles, (err) => {
    if(err) {
      return cb(err); 
    }

    // process inline and external scripts
    elements = $(selectors.scripts, context).toArray();
    iterator(mod, state, elements, scripts, (err) => {
      if(err) {
        return cb(err); 
      }

      // process inline and external template elements
      elements = $(selectors.templates, context).toArray();

      // only single template element allowed 
      if(elements.length > 1) {
        return cb(
          new Error(
            `only a single template element is allowed per dom-module`)); 
      }

      iterator(mod, state, elements, templates, (err) => {
        cb(err);
      });
    });
  })
}

/**
 *  Iterate `<dom-module>` elements.
 *
 *  @private {function} modules
 */
function modules(state, list, opts, cb) {

  function next(err) {
    if(err) {
      return cb(err); 
    }
    const group = list.shift(); 
    if(!group) {
      return cb(null, state);
    }

    // parse all the <dom-groupule> elements
    const $ = group.querySelectorAll
      , elements = $(selectors.modules).toArray();

    // import-only component
    //if(mod.imports.length && !elements.length) {
      //return next();  
    //}

    //if(!elements.length) {
      //return next(new Error(`no component modules in ${mod.file}`)); 
    //}

    function it(err) {
      if(err) {
        return next(err); 
      }
      const context = elements.shift(); 
      if(!context) {
        return next(); 
      }

      const id = $(context).attr(ID);

      if(!id) {
        return next(
          new Error(
            `identifier missing for component module in ${group.file}`)); 
      }

      // validate custom element name as per the spec
      try {
        validate(id);
      }catch(e) {
        return next(e); 
      }

      const mod = new Module(id, group);

      mod.context = context;

      // proxy document query function
      mod.querySelectorAll = $;

      group.modules.push(mod);

      // add to global list of all modules
      state.result.modules.push(mod);

      component(mod, state, it);
    }

    it();
  }

  next();
}

/**
 *  @private
 */
function parse(state, cb) {
  modules(state, state.result.files, state.options || {}, cb);
}

module.exports = parse;
