var test = require('grape'),
    lex = require('../lexer'),
    parse = require('../parser'),
    fs = require('fs');

test('simple', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/simple.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed);

    t.deepEqual(JSON.parse(JSON.stringify(parsed)), [
        {
            "type": "block",
            "content": [
                {
                    "type": "statement",
                    "property": "border",
                    "valueTokens": [
                        {
                            "type": "word",
                            "source": "solid",
                            "length": 5,
                            "index": 20
                        },
                        {
                            "type": "word",
                            "source": "1px",
                            "length": 3,
                            "index": 26
                        },
                        {
                            "type": "word",
                            "source": "red",
                            "length": 3,
                            "index": 30
                        }
                    ]
                }
            ],
            "selectors": [
                ".thing"
            ]
        }
    ]);

});

test('multiple selectors', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/multiSelector.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed);

    t.deepEqual(JSON.parse(JSON.stringify(parsed)), [
        {
            "type": "block",
            "content": [
                {
                    "type": "statement",
                    "property": "color",
                    "valueTokens": [
                        {
                            "type": "word",
                            "source": "red",
                            "length": 3,
                            "index": 35
                        }
                    ]
                }
            ],
            "selectors": [
                "div",
                "span",
                "input.stuff"
            ]
        }
    ]);

});

test('multiple selectors', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/media.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed);

    t.deepEqual(JSON.parse(JSON.stringify(parsed)), [
        {
            "type": "block",
            "content": [
                {
                    "type": "block",
                    "content": [
                        {
                            "type": "statement",
                            "property": "background-image",
                            "valueTokens": [
                                {
                                    "type": "word",
                                    "source": "url",
                                    "length": 3,
                                    "index": 73
                                },
                                {
                                    "type": "parenthesisOpen",
                                    "source": "(",
                                    "length": 1,
                                    "index": 76
                                },
                                {
                                    "type": "string",
                                    "stringChar": "\"",
                                    "source": "\"../images/background.jpg\"",
                                    "length": 26,
                                    "index": 77
                                },
                                {
                                    "type": "parenthesisClose",
                                    "source": ")",
                                    "length": 1,
                                    "index": 103
                                }
                            ]
                        }
                    ],
                    "selectors": [
                        ".thing"
                    ]
                }
            ],
            "kind": "media"
        }
    ]);

});