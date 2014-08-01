#!/usr/bin/env node

var options = require('minimist')(process.argv.slice(2)),
    fs = require('fs'),
    parcss = require('./'),
    packageInfo = require('./package'),
    input = options.i || options.input ||  options._[0],
    output = options.o || options.output || options._[1],
    help = options.h || options.help,
    version = options.v || options.version,
    pretty = options.p || options.pretty,
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
    console.log();
    process.exit(1);
}

result = parcss.render(parcss.parse(fs.readFileSync(input)), pretty);

if(output){
    fs.writeFileSync(output, result);
} else {
    console.log(result);
}

process.exit(0);
