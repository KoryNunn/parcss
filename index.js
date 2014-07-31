function parseStatement(statement, groupDef){
    statement = statement.trim();
    if(!statement){
        return;
    }
    var statementParts = statement.match(/^(.*?):(.*?)$/),
        property = statementParts[1].trim(),
        value = statementParts[2].trim();

    if(!groupDef[property]){
        groupDef[property] = {};
    }

    groupDef[property] = value;
}

function parseGroup(group, groupDefs){
    var groupParts = group.match(/\s*(.*?)\{((?:.|\s)*?)\}/),
        selector = groupParts[1],
        body = groupParts[2];

    if(!groupDefs[selector]){
        groupDefs[selector] = {};
    }

    var statements = body.trim().split(';');

    statements.forEach(function(statement){
        try{
            parseStatement(statement, groupDefs[selector]);
        }catch(error){
            console.log(error);
            console.log('At: ' + JSON.stringify(statement));
        }
    });
}

function parseKeyframes(css, groupDefs){
    var keyframesRegex = /(@.*?keyframes.*?\w+.*?{(?:.|\n)*?}(?:\s|\n)})/g;

    var keyframes = css.match(keyframesRegex);

    css = css.replace(keyframesRegex, '');

    if(keyframes){
        groupDefs['@keyframes'] = keyframes;
    }

    return css;
}

function parseMediaQueries(css, groupDefs){
    var mediaQueryRegex = /(@.*?media.*?\w+.*?{(?:.|\n)*?}(?:\s|\n)})/g;

    var mediaQueries = css.match(mediaQueryRegex);

    css = css.replace(mediaQueryRegex, '');

    if(mediaQueries){
        groupDefs['@media'] = mediaQueries;
    }

    return css;
}

function renderGroup(groupDef) {
    var result = '';
    for(var key in groupDef){
        result+= key + ':' + groupDef[key] + ';';
    }
    return result;
}

function renderKeyframes(keyframes){
    return keyframes.join('').replace(/\s|\n/g, '');
}

function renderMediaQueries(mediaQueries){
    var result = '';

    for (var i = 0; i < mediaQueries.length; i++) {
        var mediaQuery = mediaQueries[i],
            firstBrace = mediaQuery.indexOf('{'),
            query = mediaQuery.substring(0, firstBrace);

        result += query;
        result += render(parse(mediaQuery.substring(firstBrace + 1, mediaQuery.length -1)));
    }

    return result;
}

function render(groupDefs){
    var result = '';

    for(var key in groupDefs){
        if(key === '@keyframes'){
            result += renderKeyframes(groupDefs[key]);
            continue;
        }

        if(key === '@media'){
            result += renderMediaQueries(groupDefs[key]);
            continue;
        }

        result += key + '{';
        result += renderGroup(groupDefs[key]);
        result += '}';
    }

    return result;
}

function parse(css){
    css = css.toString();

    var groupDefs = {};

    css = parseKeyframes(css, groupDefs);
    css = parseMediaQueries(css, groupDefs);

    var parseRegex = /\s*(.*?)\{((?:.|\s)*?)\}/g;

    var groups = css.match(parseRegex);

    if(groups){
        groups.forEach(function(group){
            parseGroup(group, groupDefs);
        });
    }

    return groupDefs;
}

module.exports = {
    parse: parse,
    render:render
};