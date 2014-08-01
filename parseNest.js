function parseNest(string, openRegex, closeRegex){
    var nests = [],
        openMatch,
        closeMatch,
        nest,
        body = '';

    while(string.length){
        if(!string.length && nest){
            throw "Invalid nesting. No closing token was found";
        }

        openMatch = string.match(openRegex);
        if(openMatch){
            if(body){
                nests.push(body);
                body = '';
            }

            nest = {};
            nest.open = openMatch;
            string = string.slice(openMatch[0].length);

            var innerNests = parseNest(
                string,
                openRegex,
                closeRegex
            );

            nest.content = innerNests.nests;
            string = innerNests.remaining;

            continue;
        }

        closeMatch = string.match(closeRegex);
        if(closeMatch){
            if(!nest){
                return {
                    nests:nests,
                    remaining: body + string
                };
            }

            if(nest.content.length === 0){
                nest.content = [];
            }
            if(body){
                nest.content.push(body);
                body = '';
            }
            nest.close = closeMatch;
            nests.push(nest);
            nest = null;
            string = string.slice(closeMatch[0].length);
            continue;
        }

        body += string.slice(0,1);
        string = string.slice(1);
    }

    return {
        nests:nests,
        remaining: body
    };
}

function lexNests(string, openRegex, closeRegex){
    var result = parseNest(string, openRegex, closeRegex),
        nests = result.nests;

    if(result.remaining){
        nests.push(result.remaining);
    }

    return nests;
}

/**

    ## usage:

        lexNests(
            '.abc{color:red; .things{bla}}',
            '.abc{color:red; .things{bla}} .abc{color:red; .things{bla}}',
            // '.abc{color:red;}',
            /^([^;}{]*?){/,
            /^}/
        );
*/

module.exports = lexNests;