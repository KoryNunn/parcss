function isWordlike(type){
    return type === 'word' || type === 'color';
}

function renderValue(tokens){
    var result = '';

    for(var i = 0; i < tokens.length; i++){
        var token = tokens[i];

        result += token.source;

        if(i === tokens.length -1){
            continue;
        }

        if(isWordlike(token.type) && isWordlike(tokens[i+1].type)){
            result += ' ';
        }
    }

    return result;
}

function renderRule(rule, newLine, tab, tabDepth) {
    var result = '',
        tabs = '';

    if(rule.type === 'at'){
        return '@' + rule.kind + ' ' + renderValue(rule.valueTokens) + ';' + newLine;
    }

    if(!tabDepth){
        tabDepth = 0;
    }

    for(var i = 0; i < tabDepth; i++){
        tabs += tab;
    }

    if(rule.type === 'selectorBlock'){
        result += tabs + rule.selectors.join(',') + '{';
        result += newLine;
        for(var key in rule.properties){
            var property = rule.properties[key];

            result += tabs + tab + key + ':' + renderValue(property) + ';' + newLine;
        }
    }else if(rule.type === 'specialBlock'){
        result += tabs + '@' + rule.kind + ' ' + renderValue(rule.keyTokens) + '{';
        result += newLine;
        for(var i = 0; i < rule.content.length; i++){
            result += renderRule(rule.content[i], newLine, tab, tabDepth+1);
        }
    }

    result += tabs + '}';
    result += newLine;

    return result;
}

module.exports = function(ruleset, newLine, tab, tabDepth){
    var result = '';

    newLine = newLine || '';
    tab = tab || '';
    tabDepth = tabDepth || 0;

    for(var i = 0; i < ruleset.length; i++){
        result += renderRule(ruleset[i], newLine, tab, tabDepth);
    }

    return result;
};