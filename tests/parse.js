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

test('media', function(t){
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
                                    "type": "function",
                                    "arguments": [
                                        {
                                            "type": "string",
                                            "stringChar": "\"",
                                            "source": "\"../images/background.jpg\"",
                                            "length": 26,
                                            "index": 77
                                        }
                                    ],
                                    "functionName": "url"
                                }
                            ]
                        }
                    ],
                    "selectors": [
                        ".thing"
                    ]
                }
            ],
            "kind": "media",
            "keyTokens": [
                {
                    "type": "word",
                    "source": "all",
                    "length": 3,
                    "index": 7
                },
                {
                    "type": "word",
                    "source": "and",
                    "length": 3,
                    "index": 11
                },
                {
                    "type": "parenthesisOpen",
                    "source": "(",
                    "length": 1,
                    "index": 15
                },
                {
                    "type": "word",
                    "source": "max-width",
                    "length": 9,
                    "index": 16
                },
                {
                    "type": "colon",
                    "source": ":",
                    "length": 1,
                    "index": 25
                },
                {
                    "type": "word",
                    "source": "380px",
                    "length": 5,
                    "index": 27
                },
                {
                    "type": "parenthesisClose",
                    "source": ")",
                    "length": 1,
                    "index": 32
                }
            ]
        }
    ]);

});

test('import', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/import.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed);

    t.deepEqual(JSON.parse(JSON.stringify(parsed)), [
        {
            "type": "at",
            "kind": "import",
            "valueTokens": [
                {
                    "type": "word",
                    "source": "stuff",
                    "length": 5,
                    "index": 8
                },
                {
                    "type": "word",
                    "source": "and",
                    "length": 3,
                    "index": 14
                },
                {
                    "type": "word",
                    "source": "things",
                    "length": 6,
                    "index": 18
                }
            ]
        }
    ]);

});