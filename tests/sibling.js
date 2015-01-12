var test = require('grape'),
    lex = require('../lexer'),
    parse = require('../parser'),
    optimise = require('../optimiser'),
    render = require('../renderer'),
    fs = require('fs');

test('lex sibling', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/sibling.css').toString(),
        lexed = lex(css);

    var types = [];
    for (var i = 0; i < lexed.length; i++) {
        types.push(lexed[i].type);
    }

    t.deepEqual(types,
        ["word","delimiter","tilde","delimiter","word","braceOpen","braceClose"]
    );
});

test('parse sibling', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/sibling.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed);

    t.deepEqual(JSON.parse(JSON.stringify(parsed)), [
            {
                "type":"block",
                "content":[],
                "selectors":["a ~ a"]
            }
        ]
    );
});

test('optimise sibling', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/sibling.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    t.deepEqual(JSON.parse(JSON.stringify(optimised)), []);
});

test('render sibling', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/sibling.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, '');
});