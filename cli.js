#!/usr/bin/env node

var options = require('minimist')(process.argv.slice(2)),
    fs = require('fs'),
    path = require('path'),
    parcss = require('./'),
    packageInfo = require('./package'),
    input = options.i || options.input ||  options._[0],
    output = options.o || options.output || options._[1],
    help = options.h || options.help,
    version = options.v || options.version,
    pretty = options.p || options.pretty,
    newline = '',
    tab = '',
    result;


if(version){
    console.log('v' + packageInfo.version);
    process.exit(0);
}

if(help || !input){
    console.log();
    console.log('Usage: parcss [options]');
    console.log();
    console.log('Options:');
    console.log();
    console.log('  -h, --help                     output usage information');
    console.log('  -v, --version                  output the version number');
    console.log('  -i, --input [file]             Input File');
    console.log('  -o, --output [file]            Output File');
    console.log('  -p, --pretty                   Pretty Print');
    console.log();
    process.exit(1);
}

if(pretty){
    newline = '\n';
    tab = '    ';
}

var css = fs.readFileSync(path.resolve(process.cwd(), input)),
    lexed = parcss.lex(css.toString()),
    parsed = parcss.parse(lexed),
    optimised = parcss.optimise(parsed),
    rendered = parcss.render(optimised, newline, tab);

if(output){
    fs.writeFileSync(output, rendered);
} else {
    console.log(rendered);
}

process.exit(0);
