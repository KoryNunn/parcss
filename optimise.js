function parseGroupContent(group, groupDefinitions) {
    if(typeof group === 'string'){
        var string = group.trim();
        while(string){
            var atStatement = string.match(/^@([^]*?)(;[\w\s\n-]+?:|$)/),
                contentItems = string.match(/^(.*?):([^]*?)(?:(;[\w\s\n-]+?:)|$)/);

            if(atStatement){
                groupDefinitions['_statements'] = (groupDefinitions['_statements'] || []);
                groupDefinitions['_statements'].push(atStatement[1]);
                string = string.slice(atStatement[1].length + 1).trim();
                continue;
            }

            if(!contentItems){
                console.log(string);
            }

            string = string.slice(contentItems[1].length + contentItems[2].length + 2).trim();

            var contents = contentItems[1].trim();
            delete groupDefinitions[contents];
            groupDefinitions[contents] = contentItems[2].trim();
        }
        return;
    }

    var selector = group.open[1].trim().replace(/\n/g, ' '),
        content = group.content;

    if(!groupDefinitions[selector]){
        groupDefinitions[selector] = {};
    } else {
        // We rely on order of keys to order the output
        // This is dodgey but it works...
        var currentDefinitions = groupDefinitions[selector];
        delete groupDefinitions[selector];
        groupDefinitions[selector] = currentDefinitions;
    }

    content.forEach(function(group){
       parseGroupContent(group, groupDefinitions[selector]);
    });
}

function parseGroup(string, openRegex, closeRegex){
    var groups = [],
        openMatch,
        closeMatch,
        group,
        body = '';

    while(string.length){
        if(!string.length && group){
            throw "Invalid grouping. No closing token was found";
        }

        openMatch = string.match(openRegex);
        if(openMatch){
            if(body){
                groups.push(body);
                body = '';
            }

            group = {};
            group.open = openMatch;
            string = string.slice(openMatch[0].length);

            var innerGroups = parseGroup(
                string,
                openRegex,
                closeRegex
            );

            group.content = innerGroups.groups;
            string = innerGroups.remaining;

            continue;
        }

        closeMatch = string.match(closeRegex);
        if(closeMatch){
            if(!group){
                return {
                    groups:groups,
                    remaining: body + string
                };
            }

            if(group.content.length === 0){
                group.content = [];
            }
            if(body){
                group.content.push(body);
                body = '';
            }
            group.close = closeMatch;
            groups.push(group);
            group = null;
            string = string.slice(closeMatch[0].length);
            continue;
        }

        body += string.slice(0,1);
        string = string.slice(1);
    }

    return {
        groups:groups,
        remaining: body
    };
}

function lexGroups(string, openRegex, closeRegex){
    var result = parseGroup(string, openRegex, closeRegex),
        groups = result.groups;

    if(result.remaining){
        groups.push(result.remaining);
    }

    return groups;
}

module.exports = function(css){
    css = css.toString();

    var groupDefinitions = {},
        startRegex = /^([^;}{]*?){/,
        endRegex = /^}/,
        groups = lexGroups(css, startRegex, endRegex);

    groups.forEach(function(group){
        parseGroupContent(group, groupDefinitions);
    });

    return groupDefinitions;
};