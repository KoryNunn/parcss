function renderGroup(selector, groupDefinition, newLine, tab, tabDepth) {
    var result = '',
        tabs = '';

    if(!tabDepth){
        tabDepth = 0;
    }

    for(var i = 0; i < tabDepth; i++){
        tabs += tab;
    }

    if(selector === '_statements'){
        result += tabs + groupDefinition.join(tabs + tab + newLine) + newLine;
        return result;
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

module.exports = function(groupDefinitions, newLine, tab, tabDepth){
    var result = '';

    newLine = newLine || '';
    tab = tab || '';
    tabDepth = tabDepth || 0;

    for(var key in groupDefinitions){
        result += renderGroup(key, groupDefinitions[key], newLine, tab, tabDepth);
    }

    return result;
};