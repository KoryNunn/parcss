# parcss

A CSS parser that ACTUALLY works...

Removes unused selectors, properties. Combines selectors with duplicate definitions. (sometimes, nieve implementation for now)

## Usage

### CLI

    Usage: parcss [options]

    Options:

      -h, --help                     output usage information
      -v, --version                  output the version number
      -i, --input [file]             Input File
      -i, --output [file]            Output File
      -p, --pretty                   Pretty Print

### Module

Compress some CSS:

    var compressed = parcss.compress(css);

Or you can do each step yourself if you wish:

    var parcss = require('parcss'),
        tokens = parcss.lex(fs.readFileSync('myCoolFile.css')),
        ast = parcss.parse(tokens),
        optimisedDefinitions = parcss.optimise(ast),
        compressed = parcss.render(optimisedDefinitions);