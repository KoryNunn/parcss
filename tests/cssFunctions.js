var test = require('grape'),
    lex = require('../lexer'),
    parse = require('../parser'),
    optimise = require('../optimiser'),
    render = require('../renderer'),
    fs = require('fs'),
    css = fs.readFileSync(__dirname + '/cssFunction.css').toString();

test('lex function', function(t){
    t.plan(1);

    var lexed = lex(css);

    var types = [];
    for (var i = 0; i < lexed.length; i++) {
        types.push(lexed[i].type);
    };

    t.deepEqual(types,
        ["hash","word","braceOpen","delimiter","word","colon","word","parenthesisOpen","word","comma","word","comma","word","parenthesisClose","delimiter","braceClose"]
    );
});

test('parse function', function(t){
    t.plan(1);

    var lexed = lex(css),
        parsed = parse(lexed);

    t.deepEqual(JSON.parse(JSON.stringify(parsed)), [
        {  
            "type":"block",
            "content":[  
                {  
                    "type":"statement",
                    "property":"transform",
                    "valueTokens":[  
                        {  
                            "type":"function",
                            "arguments":[  
                                {  
                                    "type":"word",
                                    "source":"-10%",
                                    "length":4,
                                    "index":34
                                },
                                {  
                                    "type":"comma",
                                    "source":",",
                                    "length":1,
                                    "index":38
                                },
                                {  
                                    "type":"word",
                                    "source":"0",
                                    "length":1,
                                    "index":39
                                },
                                {  
                                    "type":"comma",
                                    "source":",",
                                    "length":1,
                                    "index":40
                                },
                                {  
                                    "type":"word",
                                    "source":"0",
                                    "length":1,
                                    "index":41
                                }
                            ],
                            "functionName":"translate3d"
                        }
                    ]
                }
            ],
            "selectors":[  
                "#thing"
            ]
        }
    ]);
});

test('optimise function', function(t){
    t.plan(1);

    var lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    t.deepEqual(JSON.parse(JSON.stringify(optimised)), [  
        {  
            "type":"selectorBlock",
            "selectors":[  
                "#thing"
            ],
            "properties":{  
                "transform":[  
                    [  
                        {  
                            "type":"function",
                            "arguments":[  
                                {  
                                    "type":"word",
                                    "source":"-10%",
                                    "length":4,
                                    "index":34
                                },
                                {  
                                    "type":"comma",
                                    "source":",",
                                    "length":1,
                                    "index":38
                                },
                                {  
                                    "type":"word",
                                    "source":"0",
                                    "length":1,
                                    "index":39
                                },
                                {  
                                    "type":"comma",
                                    "source":",",
                                    "length":1,
                                    "index":40
                                },
                                {  
                                    "type":"word",
                                    "source":"0",
                                    "length":1,
                                    "index":41
                                }
                            ],
                            "functionName":"translate3d"
                        }
                    ]
                ]
            }
        }
    ]);
});

test('render function', function(t){
    t.plan(1);

    var lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed),
        rendered = render(optimised, '\n', '    ');

    t.equal(rendered, '#thing{\n    transform:translate3d(-10%,0,0);\n}\n');
});