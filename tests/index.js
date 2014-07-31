var test = require('grape'),
    parcss = require('../'),
    fs = require('fs');

test('parcss and functions exists', function(t){
    t.plan(6);

    t.ok(parcss, 'parcss exists');
    t.equal(typeof parcss, 'object', 'parcss.parse is an object');

    t.ok(parcss.parse, 'parcss.parse exists');
    t.equal(typeof parcss.parse, 'function', 'parcss.parse is a function');

    t.ok(parcss.render, 'parcss.render exists');
    t.equal(typeof parcss.render, 'function', 'parcss.render is a function');
});

test('parcss.parse produces the correct definitions', function(t){
    t.plan(1);

    var definitions = parcss.parse(fs.readFileSync(__dirname + '/test.css')),
        expectedDefinitions = {
            '@keyframes': [
                '@keyframes fadeNFallIn {\n    from {\n        opacity: 0;\n        transform: translate3d(0,-5px,0);\n    }\n    to {\n        opacity: 1;\n        transform: translate3d(0,0,0);\n    }\n}',
                '@keyframes fadeNFallout {\n    from {\n        opacity: 1;\n        transform: translate3d(0,0,0);\n    }\n    to {\n        opacity: 0;\n        transform: translate3d(0,-5px,0);\n    }\n}'
            ],
            '@media': [
                '@media all and (max-width: 380px){\n    body {\n        background-image: url("../images/background.jpg");\n    }\n\n    .mainMenu .profile {\n        color: #fff;\n    }\n\n    body {\n        left: 320px;\n    }\n}',
                '@media all and (min-width: 380px){\n     body {\n        background-image: url("../images/smallbackground.jpg");\n    }\n\n    .mainMenu .profile {\n        color: #000;\n    }\n\n    body {\n        right: 640px;\n    }\n}'
            ],
            '.thing': {
                border: 'solid 12px red',
                'border-color': 'green'
            },
            '.stuff': {
                border: 'solid 1px red'
            }
        };

    t.deepEqual(definitions, expectedDefinitions, 'definitions created correctly');
});

test('parcss.render produces the correct result', function(t){
    t.plan(1);

    var testInput = {
            '@keyframes': [
                '@keyframes fadeNFallIn {\n    from {\n        opacity: 0;\n        transform: translate3d(0,-5px,0);\n    }\n    to {\n        opacity: 1;\n        transform: translate3d(0,0,0);\n    }\n}',
                '@keyframes fadeNFallout {\n    from {\n        opacity: 1;\n        transform: translate3d(0,0,0);\n    }\n    to {\n        opacity: 0;\n        transform: translate3d(0,-5px,0);\n    }\n}'
            ],
            '@media': [
                '@media all and (max-width: 380px){\n    body {\n        background-image: url("../images/background.jpg");\n    }\n\n    .mainMenu .profile {\n        color: #fff;\n    }\n\n    body {\n        left: 320px;\n    }\n}',
                '@media all and (min-width: 380px){\n     body {\n        background-image: url("../images/smallbackground.jpg");\n    }\n\n    .mainMenu .profile {\n        color: #000;\n    }\n\n    body {\n        right: 640px;\n    }\n}'
            ],
            '.thing': {
                border: 'solid 12px red',
                'border-color': 'green'
            },
            '.stuff': {
                border: 'solid 1px red'
            }
        },
        expectedCss = '@keyframesfadeNFallIn{from{opacity:0;transform:translate3d(0,-5px,0);}to{opacity:1;transform:translate3d(0,0,0);}}@keyframesfadeNFallout{from{opacity:1;transform:translate3d(0,0,0);}to{opacity:0;transform:translate3d(0,-5px,0);}}@media all and (max-width: 380px)body {background-image:url("../images/background.jpg");left:320px;}.mainMenu .profile {color:#fff;}@media all and (min-width: 380px)body {background-image:url("../images/smallbackground.jpg");right:640px;}.mainMenu .profile {color:#000;}.thing{border:solid 12px red;border-color:green;}.stuff{border:solid 1px red;}';


    t.equal(parcss.render(testInput), expectedCss, 'resulting css created correctly');
});
