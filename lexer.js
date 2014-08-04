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

function lexIdentifier(source){
    var match = source.match(/^\w+/);

    if(!match){
        return;
    }

    return {
        type: 'identifier',
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
        case '-': type = 'hyphen'; break;
        case ',': type = 'comma'; break;
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
            type: 'hex',
            source: hexMatch[0],
            length: hexMatch[0].length
        };
    }

    var rgbMatch = source.match(/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)/);

    if(rgbMatch){
        return{
            type: 'rgb',
            source: rgbMatch[0],
            length: rgbMatch[0].length
        };
    }

    var rgbaMatch = source.match(/^rgba\(\d{1,3},\d{1,3},\d{1,3},(\d+(\.\d+)?)\)/);

    if(rgbaMatch){
        return{
            type: 'rgba',
            source: rgbaMatch[0],
            length: rgbaMatch[0].length
        };
    }

    var hslMatch = source.match(/^hsl\(\d{1,3},\d{1,3}%,\d{1,3}%\)/);

    if(hslMatch){
        return{
            type: 'hsl',
            source: hslMatch[0],
            length: hslMatch[0].length
        };
    }

    var hslaMatch = source.match(/^hsl\(\d{1,3},\d{1,3}%,\d{1,3}%,(\d+(\.\d+)?)\)/);

    if(hslaMatch){
        return{
            type: 'hsla',
            source: hslaMatch[0],
            length: hslaMatch[0].length
        };
    }
}

var lexers = [
    lexDelimiter,
    lexCharacters,
    lexString,
    lexIdentifier,
    lexColours
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
    if(!source){
        return [];
    }

    if(memoisedTokens && memoisedTokens[source]){
        return memoisedTokens[source].slice();
    }

    var originalSource = source,
        tokens = [],
        totalCharsProcessed = 0,
        previousLength,
        reservedKeywordToken;

    do {
        previousLength = source.length;

        var token;

        token = scanForToken(lexers, source);

        if(token){
            source = source.slice(token.length);
            totalCharsProcessed += token.length;
            tokens.push(token);
            continue;
        }


        if(source.length === previousLength){
            throw "Unable to determine next token in source: " + source;
        }

    } while (source);

    memoisedTokens && (memoisedTokens[originalSource] = tokens.slice());

    return tokens;
}

module.exports = lex;