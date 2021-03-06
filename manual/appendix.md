# Appendix

---

- [Compiler](#compiler)
  - [Load](#load)
  - [Parse](#parse)
  - [Transform](#transform)
  - [Generate](#generate)
  - [Write](#write)
- [Developer](#developer)
  - [Scripts](#scripts)
    - [Build](#build)
    - [Test](#test)
    - [Cover](#cover)
    - [Lint](#lint)
    - [Clean](#clean)
    - [Docs](#docs)
    - [Readme](#readme)

---

## Compiler

The compiler executes the following plugins:

* [load][] Load all source HTML files given with the `files` option and resolve the HTML imports.
* [parse][] Parse the imported files resolving styles, javascript and template elements.
* [transform][] Transform the component tree.
* [generate][] Convert the transformed components to css and javascript strings.
* [write][] Write the generated styles and javascript to files.

### Load

Given a components file [components.html](https://github.com/tmpfs/trucks/blob/master/documents/compiler/components.html) such as:

```html
<link rel="import" href="x-button.html">
```

The load phase will build the result object:

```javascript
ComponentFile {
  imports: 
   [ ComponentFile {
       imports: [Object],
       file: '/home/muji/git/trucks/documents/compiler/x-button.html',
       contents: '<link rel="import" href="x-icon.html">\n\n<dom-module id="x-button">\n  <template></template>\n\n  <style>\n    x-button {\n      /* component styles */\n    }\n  </style>\n\n  <script>\n    skate.define(\'{{id}}\', {});\n  </script>\n</dom-module>\n',
       parent: [Circular],
       resolver: [Object],
       modules: [],
       duplicates: [],
       _document: [Object],
       href: 'x-button.html' } ],
  file: '/home/muji/git/trucks/documents/compiler/components.html',
  contents: '<link rel="import" href="x-button.html">\n',
  parent: null,
  resolver: 
   FileResolver {
     state: 
      CompilerState {
        options: [Object],
        compiler: [Object],
        tree: [Object],
        log: [Object],
        result: [Object],
        manifest: undefined,
        _output: {},
        _registry: [Object] },
     href: 'documents/compiler/components.html',
     parent: null,
     uri: 
      Url {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: null,
        search: null,
        query: null,
        pathname: 'documents/compiler/components.html',
        path: 'documents/compiler/components.html',
        href: 'documents/compiler/components.html' },
     _file: '/home/muji/git/trucks/documents/compiler/components.html' },
  modules: [],
  duplicates: [],
  _document: 
   { [Function]
     fn: { constructor: [Circular], _originalRoot: [Object] },
     load: [Function],
     html: [Function],
     xml: [Function],
     text: [Function],
     parseHTML: [Function],
     root: [Function],
     contains: [Function],
     _root: 
      { type: 'root',
        name: 'root',
        attribs: {},
        children: [Object],
        next: null,
        prev: null,
        parent: null },
     _options: 
      { lowerCaseAttributeNames: false,
        withDomLvl1: true,
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: true } },
  href: 'documents/compiler/components.html' }
```

Imported component file paths are resolved relative to the declaring file.

### Parse

The parse phase takes the output from the load phase and extracts the css, javascript and template elements:

```javascript
ComponentModule {
  id: 'x-button',
  parent: 
   ComponentFile {
     imports: [ [Object] ],
     file: '/home/muji/git/trucks/documents/compiler/x-button.html',
     contents: '<link rel="import" href="x-icon.html">\n\n<dom-module id="x-button">\n  <template></template>\n\n  <style>\n    x-button {\n      /* component styles */\n    }\n  </style>\n\n  <script>\n    skate.define(\'{{id}}\', {});\n  </script>\n</dom-module>\n',
     parent: 
      ComponentFile {
        imports: [Object],
        file: '/home/muji/git/trucks/documents/compiler/components.html',
        contents: '<link rel="import" href="x-button.html">\n',
        parent: null,
        resolver: [Object],
        modules: [],
        duplicates: [],
        _document: [Object],
        href: 'documents/compiler/components.html' },
     resolver: 
      FileResolver {
        state: [Object],
        href: 'x-button.html',
        parent: [Object],
        uri: [Object],
        _file: '/home/muji/git/trucks/documents/compiler/x-button.html' },
     modules: [ [Circular] ],
     duplicates: [],
     _document: 
      { [Function]
        fn: [Object],
        load: [Function],
        html: [Function],
        xml: [Function],
        text: [Function],
        parseHTML: [Function],
        root: [Function],
        contains: [Function],
        _root: [Object],
        _options: [Object] },
     href: 'x-button.html' },
  component: 
   Component {
     template: 
      ComponentTemplate {
        element: [Object],
        _contents: '<template id="x-button"></template>',
        parent: [Circular],
        href: undefined,
        _file: '/home/muji/git/trucks/documents/compiler/x-button.html',
        _id: 'x-button' },
     parent: [Circular],
     partials: [],
     styles: [],
     _scripts: [] },
  templates: 
   [ ComponentTemplate {
       element: [Object],
       _contents: '<template id="x-button"></template>',
       parent: [Circular],
       href: undefined,
       _file: '/home/muji/git/trucks/documents/compiler/x-button.html',
       _id: 'x-button' } ],
  stylesheets: 
   [ ComponentStyle {
       element: [Object],
       _contents: '\n    x-button {\n      /* component styles */\n    }\n  ',
       parent: [Circular],
       href: undefined,
       _file: undefined,
       _id: null,
       _scope: '::document' } ],
  javascript: 
   [ ComponentScript {
       element: [Object],
       _contents: '\n    skate.define(\'{{id}}\', {});\n  ',
       parent: [Circular],
       href: undefined,
       _file: undefined,
       _id: null,
       _scope: '::document' } ],
  styles: 
   [ ComponentStyle {
       element: [Object],
       _contents: '\n    x-button {\n      /* component styles */\n    }\n  ',
       parent: [Circular],
       href: undefined,
       _file: undefined,
       _id: null,
       _scope: '::document' } ],
  scripts: 
   [ ComponentScript {
       element: [Object],
       _contents: '\n    skate.define(\'{{id}}\', {});\n  ',
       parent: [Circular],
       href: undefined,
       _file: undefined,
       _id: null,
       _scope: '::document' } ] }
```

### Transform

The transform phase takes the parsed result and compiles the `<template>` elements to javascript functions that can be called from the component `render()` function.

```javascript
{ '/home/muji/git/trucks/target/components.js': 
   OutputFile {
     eol: '\n\n',
     file: '/home/muji/git/trucks/target/components.js',
     name: 'target/components.js',
     base: undefined,
     _contents: 
      [ 'const templates = {\n  "x-icon": function render(elem) {},\n  "x-button": function render(elem) {}\n};',
        'function template(elem) {\n  return templates[elem.tagName.toLowerCase()].call(elem, elem);\n}',
        'skate.define(\'x-icon\', {});',
        'skate.define(\'x-button\', {});' ] } }
```

### Generate

After transformation the generate phase will concatenate all the css and transformed javascript code.

```javascript
{ '/home/muji/git/trucks/target/components.js': 
   OutputFile {
     eol: '\n\n',
     file: '/home/muji/git/trucks/target/components.js',
     name: 'target/components.js',
     base: undefined,
     _contents: 
      [ 'const templates = {\n  "x-icon": function render(elem) {},\n  "x-button": function render(elem) {}\n};',
        'function template(elem) {\n  return templates[elem.tagName.toLowerCase()].call(elem, elem);\n}',
        'skate.define(\'x-icon\', {});',
        'skate.define(\'x-button\', {});' ] },
  '/home/muji/git/trucks/target/components.html': 
   OutputFile {
     eol: '\n\n',
     file: '/home/muji/git/trucks/target/components.html',
     name: 'target/components.html',
     base: undefined,
     _contents: 
      [ '<template id="x-icon">\n  </template>',
        '<template id="x-button"></template>' ] },
  '/home/muji/git/trucks/target/components.css': 
   OutputFile {
     eol: '\n\n',
     file: '/home/muji/git/trucks/target/components.css',
     name: 'target/components.css',
     base: undefined,
     _contents: 
      [ 'x-icon {\n  /* component styles */\n}',
        'x-button {\n  /* component styles */\n}' ] } }
```

### Write

The final phase writes the generated files to disc.

## Developer

Sources are ES6 code transpiled for `node@4.x` compatibility.

Install [mkdoc][] `npm i -g mkdoc` and then install dependencies for all packages with `npm i && mk install`.

You should now be able to use the scripts and tasks, list tasks with `mk --tasks`.

It is a good idea to run the `build` task before tests; it is recommended that before pushing code the command `mk build test` is run.

At the top-level you run the following commands for all packages:

* `mk install` Install dependencies.
* `mk test` Run tests.
* `mk cover` Run code coverage.
* `mk build` Compile sources.
* `mk lint` Lint sources.
* `mk docs` Build top-level documentation

Build a coverage report for all packages with:

```
mk cover && npm run report
```

Note that tests are not included in the npm packages you should clone the repository to run the test suites.

### Scripts

In the scope of a package the following scripts are available.

#### Build

Convert the ES6 sources for a package:

```
npm run build
```

#### Test

To run the test suite:

```
npm test
```

#### Cover

To generate code coverage:

```
npm run cover
```

#### Lint

Run the source tree through [jshint][] and [jscs][]:

```
npm run lint
```

#### Clean

Remove generated files:

```
npm run clean
```

#### Docs

To build all documentation files:

```
mk docs
```

#### Readme

To build the readme file:

```
mk readme
```

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on August 8, 2016

[skatejs]: https://github.com/skatejs/skatejs
[webcomponents]: https://github.com/w3c/webcomponents
[shadow-dom]: https://w3c.github.io/webcomponents/spec/shadow/
[custom-elements]: https://www.w3.org/TR/custom-elements/
[html-imports]: https://w3c.github.io/webcomponents/spec/imports/
[html-templates]: https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
[polymer]: https://www.polymer-project.org/1.0/
[react]: https://facebook.github.io/react/
[react-webcomponents]: https://github.com/facebook/react/issues/5052
[react-integration]: https://github.com/skatejs/react-integration
[mozilla-webcomponents]: https://hacks.mozilla.org/2014/12/mozilla-and-web-components/
[csp]: http://content-security-policy.com/
[npm]: https://www.npmjs.com/
[postcss]: https://github.com/postcss/postcss
[mkdoc]: https://github.com/mkdoc/mkdoc
[mkapi]: https://github.com/mkdoc/mkapi
[mkparse]: https://github.com/mkdoc/mkparse
[jshint]: http://jshint.com
[jscs]: http://jscs.info
[manual]: https://github.com/tmpfs/trucks/blob/master/manual
[examples]: https://github.com/tmpfs/trucks/blob/master/examples
[trucks]: https://github.com/tmpfs/trucks
[trucks-cli]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli
[trucks-compiler]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-compiler
[sources]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-sources
[load]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-load
[parse]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-parse
[transform]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-transform
[generate]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-generate
[write]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-write
[transform-csp]: https://github.com/tmpfs/trucks/blob/master/packages/transform-csp
[bundle]: https://github.com/tmpfs/trucks/blob/master/packages/transform-bundle
[copy]: https://github.com/tmpfs/trucks/blob/master/packages/transform-copy
[skate]: https://github.com/tmpfs/trucks/blob/master/packages/transform-skate
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[tree]: https://github.com/tmpfs/trucks/blob/master/packages/transform-tree
[usage]: https://github.com/tmpfs/trucks/blob/master/packages/transform-usage
[style-extract]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-extract
[style-inject]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-inject
[resolver-core]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-core
[resolver-file]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-file
[resolver-http]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-http
[resolver-npm]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-npm
[generator-page]: https://github.com/tmpfs/trucks/blob/master/packages/generator-page
[manual-standalone]: https://github.com/tmpfs/trucks/blob/master/manual/standalone.md
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy
[skatejs]: https://github.com/skatejs/skatejs
[webcomponents]: https://github.com/w3c/webcomponents
[shadow-dom]: https://w3c.github.io/webcomponents/spec/shadow/
[custom-elements]: https://www.w3.org/TR/custom-elements/
[html-imports]: https://w3c.github.io/webcomponents/spec/imports/
[html-templates]: https://html.spec.whatwg.org/multipage/scripting.html#the-template-element
[polymer]: https://www.polymer-project.org/1.0/
[react]: https://facebook.github.io/react/
[react-webcomponents]: https://github.com/facebook/react/issues/5052
[react-integration]: https://github.com/skatejs/react-integration
[mozilla-webcomponents]: https://hacks.mozilla.org/2014/12/mozilla-and-web-components/
[csp]: http://content-security-policy.com/
[npm]: https://www.npmjs.com/
[postcss]: https://github.com/postcss/postcss
[mkdoc]: https://github.com/mkdoc/mkdoc
[mkapi]: https://github.com/mkdoc/mkapi
[mkparse]: https://github.com/mkdoc/mkparse
[jshint]: http://jshint.com
[jscs]: http://jscs.info
[manual]: https://github.com/tmpfs/trucks/blob/master/manual
[examples]: https://github.com/tmpfs/trucks/blob/master/examples
[trucks]: https://github.com/tmpfs/trucks
[trucks-cli]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-cli
[trucks-compiler]: https://github.com/tmpfs/trucks/blob/master/packages/trucks-compiler
[sources]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-sources
[load]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-load
[parse]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-parse
[transform]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-transform
[generate]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-generate
[write]: https://github.com/tmpfs/trucks/blob/master/packages/plugin-write
[transform-csp]: https://github.com/tmpfs/trucks/blob/master/packages/transform-csp
[bundle]: https://github.com/tmpfs/trucks/blob/master/packages/transform-bundle
[copy]: https://github.com/tmpfs/trucks/blob/master/packages/transform-copy
[skate]: https://github.com/tmpfs/trucks/blob/master/packages/transform-skate
[stylus]: https://github.com/tmpfs/trucks/blob/master/packages/transform-stylus
[less]: https://github.com/tmpfs/trucks/blob/master/packages/transform-less
[sass]: https://github.com/tmpfs/trucks/blob/master/packages/transform-sass
[trim]: https://github.com/tmpfs/trucks/blob/master/packages/transform-trim
[tree]: https://github.com/tmpfs/trucks/blob/master/packages/transform-tree
[usage]: https://github.com/tmpfs/trucks/blob/master/packages/transform-usage
[style-extract]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-extract
[style-inject]: https://github.com/tmpfs/trucks/blob/master/packages/transform-style-inject
[resolver-core]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-core
[resolver-file]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-file
[resolver-http]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-http
[resolver-npm]: https://github.com/tmpfs/trucks/blob/master/packages/resolver-npm
[generator-page]: https://github.com/tmpfs/trucks/blob/master/packages/generator-page
[manual-standalone]: https://github.com/tmpfs/trucks/blob/master/manual/standalone.md
[less-css]: http://lesscss.org/
[sass-css]: http://sass-lang.com/
[stylus-css]: http://stylus-lang.com/
[node-sass]: https://github.com/sass/node-sass
[archy]: https://github.com/substack/node-archy

