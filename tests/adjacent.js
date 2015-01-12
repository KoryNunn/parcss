var test = require('grape'),
    lex = require('../lexer'),
    parse = require('../parser'),
    optimise = require('../optimiser'),
    render = require('../renderer'),
    fs = require('fs');

test('lex adjacent', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/adjacent.css').toString(),
        lexed = lex(css);

    var types = [];
    for (var i = 0; i < lexed.length; i++) {
        types.push(lexed[i].type);
    }

    t.deepEqual(types,
        ["word","delimiter","plus","delimiter","word","braceOpen","braceClose"]
    );
});

test('parse adjacent', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/adjacent.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed);

    t.deepEqual(JSON.parse(JSON.stringify(parsed)), [
            {
                "type":"block",
                "content":[],
                "selectors":["a + a"]
            }
        ]
    );
});

test('optimise adjacent', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/adjacent.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    t.deepEqual(JSON.parse(JSON.stringify(optimised)), []);
});

test('render adjacent', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/adjacent.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, '');
});