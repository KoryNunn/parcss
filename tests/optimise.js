var test = require('grape'),
    lex = require('../lexer'),
    parse = require('../parser'),
    optimise = require('../optimiser'),
    fs = require('fs');

test('simple', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/import.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    console.log(JSON.stringify(optimised, null, 4));

});

test('override', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/override.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    console.log(JSON.stringify(optimised, null, 4));

});

test.only('override2', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/override2.css').toString(),
        expectedCss = fs.readFileSync(__dirname + '/override2Optimised.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    console.log(JSON.stringify(optimised, null, 4));
    // t.equal(rendered, expectedCss);
});