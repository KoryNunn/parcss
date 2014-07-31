# parcss

A CSS parser that ACTUALLY works...

## Usage

### CLI

    Usage: parcss [options]

    Options:

      -h, --help                     output usage information
      -v, --version                  output the version number
      -i, --input [file]             Input File
      -i, --output [file]            Output File

### Module

    var parcss = require('parcss'),
        definitions = parcss.parse('myCoolFile.css'),
        result = parcss.render(definitions);

    console.log(result);
