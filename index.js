var fs = require('fs');

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

    groupDefs['@keyframes'] = keyframes;

    return css;
}

function parseMedia(css, groupDefs){
    var keyframesRegex = /(@.*?media.*?\w+.*?{(?:.|\n)*?}(?:\s|\n)})/g;

    var keyframes = css.match(keyframesRegex);

    css = css.replace(keyframesRegex, '');

    groupDefs['@media'] = keyframes;

    return css;
}

function renderGroup(groupDef) {
    var result = '';
    for(var key in groupDef){
        result+= key + ':' + groupDef[key] + ';';
    }
    return result;
}

function render(groupDefs){
    var result = '';
    for(var key in groupDefs){
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
    css = parseMedia(css, groupDefs);

    var parseRegex = /\s*(.*?)\{((?:.|\s)*?)\}/g;

    var groups = css.match(parseRegex);

    groups.forEach(function(group){
        parseGroup(group, groupDefs);
    });

    console.log(render(groupDefs));
}

// parse(fs.readFileSync('../yuan-pay/www/build/index.css'));
parse(fs.readFileSync('./test.css'));