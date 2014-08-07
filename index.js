var lex = require('./lexer'),
    parse = require('./parser'),
    optimise = require('./optimiser'),
    render = require('./renderer');

module.exports = {
    lex: lex,
    parse: parse,
    optimise: optimise,
    render: render,
    compress: function(css){
        return render(optimise(parse(lex(css))));
    }
};