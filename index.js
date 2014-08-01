function parseNestContent(nest, groupDefinitions) {

    if(typeof nest === 'string'){
        var contentItems = nest.split(/:|;/);

        for (var i = 0; i < contentItems.length -1 ; i+=2) {
            groupDefinitions[contentItems[i].trim()] = contentItems[i+1].trim();
        }

        return;
    }

    var selector = nest.open[1],
        content = nest.content;

    if(!groupDefinitions[selector]){
        groupDefinitions[selector] = {};
    }

    content.forEach(function(nest){
       parseNestContent(nest, groupDefinitions[selector]);
    });
}

function parseNests(){
    return [
        {
            open: ['.things{','.things'],
            content: ['border: solid 1px red;'],
            end: ['}']
        },
        {
            open: ['@keyframes bla{', '@keyframes bla'],
            content: [
                {
                    open: ['from{', 'from'],
                    content: ['border: solid 1px red;'],
                    end: ['}']
                },
                {
                    open: ['to{', 'to'],
                    content: ['border: solid 1px red;'],
                    end: ['}']
                }
            ],
            end: ['}']
        },
        {
            open: ['@media (whatever){', '@media (whatever)'],
            content: [
                {
                    open: ['.things{', '.things'],
                    content: ['border: solid 1px red;'],
                    end: ['}']
                }
            ],
            end: ['}']
        },
        {
            open: ['.stuff{','.stuff'],
            content: ['border: solid 1px red;'],
            end: ['}']
        },
        {
            open: ['.things{','.things'],
            content: ['border-color: green;'],
            end: ['}']
        },
    ];
}

// var parseNests = require('./parseNest');

function parse(css){
    css = css.toString();

    var groupDefinitions = {},
        startRegex = /^([^;}{]*?){/,
        endRegex = /^}/,
        nests = parseNests(css, startRegex, endRegex);

// console.log(JSON.stringify(nests, null, 4))

    nests.forEach(function(nest){
        parseNestContent(nest, groupDefinitions);
    });

    return groupDefinitions;
}

function renderGroup(groupDefinition) {
    var result = '';

    for(var key in groupDefinition){
        if(typeof groupDefinition[key] === 'object'){
            result+= renderGroup(groupDefinition[key]);
        } else {
            result+= key + ':' + groupDefinition[key] + ';';
        }
    }
    return result;
}

function render(groupDefinitions){
    var result = '';

    for(var key in groupDefinitions){
        result += key + '{';
        result += renderGroup(groupDefinitions[key]);
        result += '}';
    }

    return result;
}


module.exports = {
    parse: parse,
    render:render
};