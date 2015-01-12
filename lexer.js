function lexString(source){
    var startChar = source.charAt(0);

    if(startChar !== '"' && startChar !== "'"){
        return;
    }

    var index = 0,
        escapes = 0;

    while (source.charAt(++index) !== startChar)
    {
       if(index >= source.length){
               throw "Unclosed string";
       }
       if (source.charAt(index) === '\\' && source.charAt(index+1) === startChar) {
               source = source.slice(0, index) + source.slice(index + 1);
               escapes++;
       }
    }

    return {
        type: 'string',
        stringChar: startChar,
        source: source.slice(0, index+1),
        length: index + escapes + 1
    };
}

function lexWord(source){
    var match = source.match(/^[\w-%!\[\]=+^]+/);

    if(!match){
        return;
    }

    return {
        type: 'word',
        source: match[0],
        length: match[0].length
    };
}

function lexComment(source){
    var match = source.match(/^(\/\*[^]*?\/)/);

    if(!match){
        return;
    }

    return {
        type: 'comment',
        source: match[0],
        length: match[0].length
    };
}

function lexCharacters(source){
    var startChar = source.charAt(0),
        type;

    switch(startChar){
        case '@': type = 'at'; break;
        case ';': type = 'semicolon'; break;
        case ':': type = 'colon'; break;
        case '{': type = 'braceOpen'; break;
        case '}': type = 'braceClose'; break;
        case '(': type = 'parenthesisOpen'; break;
        case ')': type = 'parenthesisClose'; break;
        case '>': type = 'greaterThan'; break;
        case '<': type = 'lessThan'; break;
        case '*': type = 'asterix'; break;
        case '.': type = 'period'; break;
        case '#': type = 'hash'; break;
        case ',': type = 'comma'; break;
        case '/': type = 'forwardSlash'; break;
        case '~': type = 'tilde'; break;
        case '+': type = 'plus'; break;
    }

    if(!type){
        return;
    }

    return {
        type: type,
        source: startChar,
        length: 1
    };
}

function lexDelimiter(source){
    var match = source.match(/^[\s\n]+/);

    if(!match){
        return;
    }

    return {
        type: 'delimiter',
        source: match[0],
        length: match[0].length
    };
}

function lexColours(source){
    var hexMatch = source.match(/^#[0-9a-fA-F]+/);

    if(hexMatch){
        return{
            type: 'color',
            kind: 'hex',
            source: hexMatch[0],
            length: hexMatch[0].length
        };
    }

    var rgbMatch = source.match(/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)/);

    if(rgbMatch){
        return{
            type: 'color',
            kind: 'rgb',
            source: rgbMatch[0],
            length: rgbMatch[0].length
        };
    }

    var rgbaMatch = source.match(/^rgba\(\d{1,3},\d{1,3},\d{1,3},(\d+(\.\d+)?)\)/);

    if(rgbaMatch){
        return{
            type: 'color',
            kind: 'rgba',
            source: rgbaMatch[0],
            length: rgbaMatch[0].length
        };
    }

    var hslMatch = source.match(/^hsl\(\d{1,3},\d{1,3}%,\d{1,3}%\)/);

    if(hslMatch){
        return{
            type: 'color',
            kind: 'hsl',
            source: hslMatch[0],
            length: hslMatch[0].length
        };
    }

    var hslaMatch = source.match(/^hsl\(\d{1,3},\d{1,3}%,\d{1,3}%,(\d+(\.\d+)?)\)/);

    if(hslaMatch){
        return{
            type: 'color',
            kind: 'hsla',
            source: hslaMatch[0],
            length: hslaMatch[0].length
        };
    }
}

var lexers = [
    lexDelimiter,
    lexComment,
    lexCharacters,
    lexString,
    lexColours,
    lexWord
];

function scanForToken(tokenisers, expression){
    for (var i = 0; i < tokenisers.length; i++) {
        var token = tokenisers[i](expression);
        if (token) {
            return token;
        }
    }
}

function lex(source, memoisedTokens) {
    var sourceRef = {
        source: source,
        toJSON: function(){}
    };

    if(!source){
        return [];
    }

    if(memoisedTokens && memoisedTokens[source]){
        return memoisedTokens[source].slice();
    }

    var originalSource = source,
        tokens = [],
        totalCharsProcessed = 0,
        previousLength;

    do {
        previousLength = source.length;

        var token;

        token = scanForToken(lexers, source);

        if(token){
            token.sourceRef = sourceRef;
            token.index = totalCharsProcessed;
            source = source.slice(token.length);
            totalCharsProcessed += token.length;
            tokens.push(token);
            continue;
        }


        if(source.length === previousLength){
            throw "Syntax error: Unable to determine next token in source: " + source.slice(0, 100);
        }

    } while (source);

    memoisedTokens && (memoisedTokens[originalSource] = tokens.slice());

    return tokens;
}

module.exports = lex;