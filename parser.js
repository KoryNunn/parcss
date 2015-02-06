var ansi = require('ansi-styles');

function parseError(message, token){
    var start = token.index > 50 ? token.index - 50 : 0,
        errorIndex = token.index > 50 ? 50 : token.index,
        surroundingSource = token.sourceRef.source.slice(start, token.index + 50),
        errorMessage = 'Parse error, ' + message + '\n' +
        'At ' + token.index + '\n"' +
        (start === 0 ? '' : '...\n') +
        surroundingSource.slice(0, errorIndex) +
        ansi.red.open +
        surroundingSource.slice(errorIndex, errorIndex+1) +
        ansi.red.close +
        surroundingSource.slice(errorIndex + 1) + '' +
        (surroundingSource.length < 100 ? '' : '...') + '"';

    throw errorMessage;
}

function matchStructure(tokens, structure) {
    for(var i = 0; i < structure.length; i++){
        if(tokens[i].type !== structure[i]){
            parseError('unexpected token.', tokens[i]);
        }
    }
    return true;
}

function findFirstIndex(tokens, type){
    for (var i = 0; i < tokens.length; i++) {
        if(tokens[i].type === type){
            return i;
        }
    }
    return -1;
}
function findLastIndex(tokens, type){
    for (var i = tokens.length-1; i >= 0; i--) {
        if(tokens[i].type === type){
            return i;
        }
    }
    return -1;
}

function cleanDelimiters(tokens){
    tokens = tokens.slice();
    for (var i = 0; i < tokens.length; i++) {
        if(tokens[i].type === 'delimiter'){
            tokens.splice(i,1);
            i--;
        }
    };

    return tokens;
}

function parseAts(tokens, ast){
    if(tokens[0].type !== 'at'){
        return;
    }

    // eg: @import url("../fonts/Arimo-400-700.woff");
    var position = 1;
    if(tokens[position].type === 'word'){
        while(position < tokens.length && tokens[position-1].type !== 'semicolon' && tokens[position].type !== 'braceOpen'){
            position++;
        }

        if(position>tokens.length){
            parseError('unexpected end of input.', tokens[tokens.length-1]);
        }

        var atsTokens = tokens.splice(0, position);

        matchStructure(
            atsTokens,
            [
                'at',
                'word',
                'delimiter'
            ]
        );

        if(atsTokens[2].type !== 'delimiter'){
            parseError('expected expression', atsTokens[2]);
        }

        ast.push({
            type: 'at',
            kind: atsTokens[1].source,
            valueTokens: cleanDelimiters(atsTokens).slice(2, -1)
        });
    }
    return true;
}

function parseValue(tokens) {
    while(parseParenthesis(tokens)){};

    return tokens;
}

function parseStatement(tokens, ast){
    if(tokens.length === 1 && tokens[0].type === 'delimiter'){
        tokens.splice(position, 1);
        return;
    }
    // eg: any thing at all that isnt a nest or an @;
    var position = 1;
    while(position < tokens.length && tokens[position-1].type !== 'semicolon' && tokens[position].type !== 'braceClose'){
        position++;
    }


    if(position>tokens.length || position === 1){
        parseError('unexpected end of input.', tokens[tokens.length-1]);
    }

    var statementTokens = cleanDelimiters(tokens.splice(0, position));

    if(statementTokens.length && statementTokens[statementTokens.length-1].type === 'semicolon'){
        statementTokens.pop();
    }

    if(statementTokens.length<2){
        parseError('unexpected end of input.', statementTokens[statementTokens.length-1]);
    }

    var statement = {
        type: 'statement',
        property: statementTokens[0].source,
        valueTokens: parseValue(statementTokens.slice(2))
    };

    ast.push(statement);
    return true;
}

function parseSelector(tokens) {
    if(tokens[0].type === 'at'){
        return tokens;
    }

    var selectors = [];

    var selector = '';
    while(tokens.length){
        if(tokens[0].type === 'comma'){
            selectors.push(selector.trim());
            selector = '';
        }else{
            if(tokens[0].type !== 'delimiter'){
                selector += tokens[0].source;
            }else{
                selector += ' ';
            }
        }
        tokens.shift();
    }
    selectors.push(selector.trim());
    return selectors;
}

function parseParenthesis(tokens) {
    var firstParenthesisIndex = findFirstIndex(tokens, 'parenthesisOpen');

    if(firstParenthesisIndex<0) {
        return;
    }

    var position = firstParenthesisIndex,
        opens = 1;

    while(++position, position <= tokens.length && opens){
        if(!tokens[position]){
            parseError('invalid nesting. No closing token was found', tokens[position-1]);
        }
        if(tokens[position].type === 'parenthesisOpen') {
            opens++;
        }
        if(tokens[position].type === 'parenthesisClose') {
            opens--;
        }
    }

    var functionToken = {
        type: 'function',
        arguments: tokens.splice(firstParenthesisIndex+1, position-firstParenthesisIndex-2)
    };

    var functionIdentifier = tokens.splice(firstParenthesisIndex-1, 1).pop();

    functionToken.functionName = functionIdentifier.source;

    tokens.splice(firstParenthesisIndex-1, position-firstParenthesisIndex-1, functionToken);

    return true;
}

function parseBlock(tokens, ast){
    var firstBraceIndex = findFirstIndex(tokens, 'braceOpen');

    if(firstBraceIndex<0){
        return;
    }

    var position = firstBraceIndex,
        opens = 1;

    while(++position, position <= tokens.length && opens){
        if(!tokens[position]){
            parseError('invalid nesting. No closing token was found', tokens[position-1]);
        }
        if(tokens[position].type === 'braceOpen'){
            opens++;
        }
        if(tokens[position].type === 'braceClose'){
            opens--;
        }
    }

    var block = {
        type: 'block',
        content: parse(tokens.splice(firstBraceIndex+1, position-firstBraceIndex-2))
    };

    var prefixTokens = tokens.splice(0, firstBraceIndex),
        atIndex = findLastIndex(prefixTokens, 'at');

    if(atIndex >= 0){
        block.kind = prefixTokens[atIndex + 1].source;
        block.keyTokens = cleanDelimiters(prefixTokens).slice(2);
    }else{
        block.selectors = parseSelector(prefixTokens);
    }

    tokens.splice(0,2);

    ast.push(block);
    return true;
}

function parseDelimiters(tokens){
    if(tokens[0].type === 'delimiter'){
        tokens.splice(0,1);
        return true;
    }
}

function parseComments(tokens, ast){
    if(tokens[0].type !== 'comment'){
        return;
    }

    var comment = {
        type: 'comment',
        value: tokens[0].source.slice(2,-2)
    };

    tokens.splice(0,1);

    ast.push(comment);

    return true;
}

var parsers = [
    parseDelimiters,
    parseComments,
    parseBlock,
    parseAts,
    parseStatement
];

function parse(tokens){
    var ast = [];

    tokens = tokens.slice();

    var lastLength = tokens.length;

    while(tokens.length){
        for(var i = 0; i < parsers.length && tokens.length; i++){

            if(parsers[i](tokens, ast)){
                i = 0;
            }
        }
        if(lastLength === tokens.length){
            parseError('unknown token', tokens[0]);
            return;
        }
        lastLength = tokens.length;
    }

    return ast;
}

module.exports = parse;