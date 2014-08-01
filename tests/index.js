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
        expectedDefinitions = require('./testDefinitions');

    t.deepEqual(definitions, expectedDefinitions, 'definitions created correctly');
});

test('parcss.render produces the correct result', function(t){
    t.plan(1);

    var testInput = require('./testDefinitions'),
        expectedCss = '@keyframes fadeNFallIn{from{opacity:0;transform:translate3d(0,-5px,0);}to{opacity:1;transform:translate3d(0,0,0);}}@keyframes fadeNFallout{from{opacity:1;transform:translate3d(0,0,0);}to{opacity:0;transform:translate3d(0,-5px,0);}}@media all and (max-width: 380px){.mainMenu .profile{color:#fff;}body{background-image:url(\"../images/background.jpg\");left:320px;}@keyframes fadeNFallout{from{opacity:1;transform:translate3d(0,0,0);}to{opacity:0;transform:translate3d(0,-5px,0);}}}@media all and (min-width: 380px){.mainMenu .profile{color:#000;}body{background-image:url(\"../images/smallbackground.jpg\");right:640px;}}.stuff{border:solid 1px pink;}.thing{border:solid 12px pink;border-color:pink;}';

    t.equal(parcss.render(testInput), expectedCss, 'resulting css created correctly');
});
