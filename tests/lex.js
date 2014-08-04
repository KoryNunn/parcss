var test = require('grape'),
    lex = require('../lexer'),
    fs = require('fs');

test('lex', function(t){
    t.plan(6);

    var css = fs.readFileSync(__dirname + '/test.css').toString(),
        lexed = lex(css);

    console.log(lexed);
});
