var test = require('grape'),
    lex = require('../lexer'),
    parse = require('../parser'),
    optimise = require('../optimiser'),
    fs = require('fs');

test('simple', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/import.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    t.deepEqual(JSON.parse(JSON.stringify(parsed)), [
        {
            "kind": "import",
            "type": "at",
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

test('override', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/override.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    t.deepEqual(JSON.parse(JSON.stringify(optimised)), [
        {
            "type": "selectorBlock",
            "selectors": [
                ".stuff"
            ],
            "properties": {
                "border": [
                    [
                        {
                            "type": "word",
                            "source": "solid",
                            "length": 5,
                            "index": 58
                        },
                        {
                            "type": "word",
                            "source": "1px",
                            "length": 3,
                            "index": 64
                        },
                        {
                            "type": "word",
                            "source": "red",
                            "length": 3,
                            "index": 68
                        }
                    ]
                ]
            }
        },
        {
            "type": "selectorBlock",
            "selectors": [
                ".thing"
            ],
            "properties": {
                "border": [
                    [
                        {
                            "type": "word",
                            "source": "solid",
                            "length": 5,
                            "index": 96
                        },
                        {
                            "type": "word",
                            "source": "5px",
                            "length": 3,
                            "index": 102
                        },
                        {
                            "type": "word",
                            "source": "red",
                            "length": 3,
                            "index": 106
                        }
                    ]
                ]
            }
        },
        {
            "type": "selectorBlock",
            "selectors": [
                ".stuff",
                ".thing"
            ],
            "properties": {
                "border-color": [
                    [
                        {
                            "type": "word",
                            "source": "green",
                            "length": 5,
                            "index": 172
                        }
                    ]
                ]
            }
        },
        {
            "type": "specialBlock",
            "kind": "media",
            "keyTokens": [
                {
                    "type": "word",
                    "source": "all",
                    "length": 3,
                    "index": 189
                }
            ],
            "content": [
                {
                    "type": "selectorBlock",
                    "selectors": [
                        ".thing"
                    ],
                    "properties": {
                        "border-color": [
                            [
                                {
                                    "type": "word",
                                    "source": "blue",
                                    "length": 4,
                                    "index": 273
                                }
                            ]
                        ]
                    }
                }
            ]
        }
    ]);
});

test('override2', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/override2.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    t.deepEqual(JSON.parse(JSON.stringify(optimised)), [
        {
            "type": "selectorBlock",
            "selectors": [
                ".stuff"
            ],
            "properties": {
                "border-color": [
                    [
                        {
                            "type": "word",
                            "source": "green",
                            "length": 5,
                            "index": 34
                        }
                    ]
                ]
            }
        },
        {
            "type": "selectorBlock",
            "selectors": [
                ".thing"
            ],
            "properties": {
                "border-color": [
                    [
                        {
                            "type": "word",
                            "source": "red",
                            "length": 3,
                            "index": 70
                        }
                    ]
                ]
            }
        }
    ]);
});

test('duplicate', function(t){
    t.plan(1);

    var css = fs.readFileSync(__dirname + '/duplicate.css').toString(),
        lexed = lex(css),
        parsed = parse(lexed),
        optimised = optimise(parsed);

    t.deepEqual(JSON.parse(JSON.stringify(optimised)), [
        {
            "type": "selectorBlock",
            "selectors": [
                ".thing"
            ],
            "properties": {
                "display": [
                    [
                        {
                            "type": "word",
                            "source": "flex",
                            "length": 4,
                            "index": 75
                        }
                    ],
                    [
                        {
                            "type": "word",
                            "source": "flexbox",
                            "length": 7,
                            "index": 94
                        }
                    ]
                ],
                "border": [
                    [
                        {
                            "type": "word",
                            "source": "solid",
                            "length": 5,
                            "index": 115
                        },
                        {
                            "type": "word",
                            "source": "1px",
                            "length": 3,
                            "index": 121
                        },
                        {
                            "type": "word",
                            "source": "red",
                            "length": 3,
                            "index": 125
                        }
                    ],
                    [
                        {
                            "type": "word",
                            "source": "solid",
                            "length": 5,
                            "index": 142
                        },
                        {
                            "type": "word",
                            "source": "1px",
                            "length": 3,
                            "index": 148
                        },
                        {
                            "type": "word",
                            "source": "blue",
                            "length": 4,
                            "index": 152
                        }
                    ]
                ]
            }
        }
    ]);
});