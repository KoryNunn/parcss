var test = require('grape'),
    lex = require('../lexer'),
    fs = require('fs');

test('lex', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/simple.css').toString(),
        lexed = lex(css);

    var types = [];
    for (var i = 0; i < lexed.length; i++) {
        types.push(lexed[i].type);
    };

    t.deepEqual(types,
        ['period', 'word', 'braceOpen', 'delimiter', 'word', 'colon',
        'delimiter', 'word', 'delimiter', 'word', 'delimiter', 'word',
        'semicolon', 'delimiter', 'braceClose']
    );
});
