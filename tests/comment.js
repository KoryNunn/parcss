var test = require('grape'),
    lex = require('../lexer'),
    parse = require('../parser'),
    optimise = require('../optimiser'),
    render = require('../renderer'),
    fs = require('fs');

test('lex comment', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/comment.css').toString(),
        lexed = lex(css);

    var types = [];
    for (var i = 0; i < lexed.length; i++) {
        types.push(lexed[i].type);
    };

    t.deepEqual(types,
        ["hash","word","braceOpen","delimiter","comment","delimiter","braceClose"]
    );
});

test('parse comment', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/comment.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed);

    t.deepEqual(JSON.parse(JSON.stringify(parsed)), [
        {
            "type": "block",
            "content": [
                {
                    "type": "comment",
                    "value": "\n        with a comment.\n    "
                }
            ],
            "selectors": [
                "#thing"
            ]
        }
    ]);
});

test('optimise comment', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/comment.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    t.deepEqual(JSON.parse(JSON.stringify(optimised)), []);
});

test('simple', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/comment.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, '');
});