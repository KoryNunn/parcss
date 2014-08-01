function parseNestContent(nest, groupDefinitions) {

    if(typeof nest === 'string'){
        var contentItems = nest.split(/:|;/);

        for (var i = 0; i < contentItems.length -1 ; i+=2) {
            groupDefinitions[contentItems[i].trim()] = contentItems[i+1].trim();
        }

        return;
    }

    var selector = nest.open[1].trim(),
        content = nest.content;

    if(!groupDefinitions[selector]){
        groupDefinitions[selector] = {};
    } else {
        // We rely on order of keys to order the output
        // This is dodgey but it works...
        var currentDefinitions = groupDefinitions[selector];
        delete groupDefinitions[selector];
        groupDefinitions[selector] = currentDefinitions;
    }

    content.forEach(function(nest){
       parseNestContent(nest, groupDefinitions[selector]);
    });
}

var parseNests = require('./parseNest');

function parse(css){
    css = css.toString();

    var groupDefinitions = {},
        startRegex = /^([^;}{]*?){/,
        endRegex = /^}/,
        nests = parseNests(css, startRegex, endRegex);

console.log(JSON.stringify(nests, null, 4))

    nests.forEach(function(nest){
        parseNestContent(nest, groupDefinitions);
    });

    return groupDefinitions;
}

function renderGroup(groupDefinition, newLine, tab, tabDepth) {
    var result = '',
        tabs = '';

    if(!tabDepth){
        tabDepth = 1;
    }

    for(var i = 0; i < tabDepth; i++){
        tabs += tab;
    }

    for(var key in groupDefinition){
        if(typeof groupDefinition[key] === 'object'){
            result += renderGroup(groupDefinition[key], newLine, tab, tabDepth);
        } else {
            result += tabs + key + ':' + groupDefinition[key] + ';' + newLine;
        }
    }
    return result;
}

function render(groupDefinitions, pretty){
    var result = '',
        newLine = pretty ? '\n' : '',
        tab = pretty ? '    ' : '';

    for(var key in groupDefinitions){
        result += key + '{';
        result += newLine;
        result += renderGroup(groupDefinitions[key], newLine, tab);
        result += '}';
        result += newLine;
    }

    return result;
}


module.exports = {
    parse: parse,
    render:render
};