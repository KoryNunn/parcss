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

    nests.forEach(function(nest){
        parseNestContent(nest, groupDefinitions);
    });

    return groupDefinitions;
}

function renderGroup(selector, groupDefinition, newLine, tab, tabDepth) {
    var result = '',
        tabs = '';

    if(!tabDepth){
        tabDepth = 0;
    }

    for(var i = 0; i < tabDepth; i++){
        tabs += tab;
    }

    result += tabs + selector + '{';
    result += newLine;

    for(var key in groupDefinition){
        if(typeof groupDefinition[key] === 'object'){
            result += renderGroup(key, groupDefinition[key], newLine, tab, tabDepth + 1);
        } else {
            result += tabs + tab + key + ':' + groupDefinition[key] + ';' + newLine;
        }
    }

    result += tabs + '}';
    result += newLine;

    return result;
}

function render(groupDefinitions, newLine, tab, tabDepth){
    var result = '';

    newLine = newLine || '';
    tab = tab || '';
    tabDepth = tabDepth || 0;

    for(var key in groupDefinitions){
        result += renderGroup(key, groupDefinitions[key], newLine, tab, tabDepth);
    }

    return result;
}


module.exports = {
    parse: parse,
    render:render
};