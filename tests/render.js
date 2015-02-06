var test = require('tape'),
    lex = require('../lexer'),
    parse = require('../parser'),
    optimise = require('../optimiser'),
    render = require('../renderer'),
    fs = require('fs');

test('simple', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/simple.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, '.thing{\n    border:solid 1px red;\n}\n');
});

test('import', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/import.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, '@import stuff and things;\n');
});

test('media', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/media.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, '@media all and (max-width:380px){\n    .thing{\n        background-image:url(\"../images/background.jpg\");\n    }\n}\n');
});

test('keyframes', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/keyframes.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, '@keyframes fadeNFallIn{\n    from{\n        opacity:0;\n        transform:translate3d(0,-5px,0);\n    }\n    to{\n        opacity:1;\n        transform:translate3d(0,0,0);\n    }\n}\n');
});

test('override', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/override.css').toString(),
        expectedCss = fs.readFileSync(__dirname + '/overrideOptimised.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, expectedCss);
});

test('override2', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/override2.css').toString(),
        expectedCss = fs.readFileSync(__dirname + '/override2Optimised.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, expectedCss);
});

test('calc', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/calc.css').toString(),
        expectedCss = fs.readFileSync(__dirname + '/calcOptimised.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, expectedCss);
});

test('colours', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/colours.css').toString(),
        expectedCss = fs.readFileSync(__dirname + '/coloursOptimised.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, expectedCss);
});

test('duplicate', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/duplicate.css').toString(),
        expectedCss = fs.readFileSync(__dirname + '/duplicateOptimised.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, expectedCss);
});

test('font-face', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/font-face.css').toString(),
        expectedCss = fs.readFileSync(__dirname + '/font-faceOptimised.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, expectedCss);
});

test('fontSpacing', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/fontSpacing.css').toString(),
        expectedCss = '.thing{\n    font:200 13px \'Open Sans\';\n}\n',
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, expectedCss);
});