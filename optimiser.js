var deepEqual = require('deep-equal');

function cleanPreviousRules(selector, block, definedRules){
    var previousRules = definedRules[selector] = definedRules[selector] || [];

    for(var i = 0; i < previousRules.length; i++){
        for(var key in block.properties){
            delete previousRules[i].properties[key];
        }
        if(!Object.keys(previousRules[i].properties).length){
            previousRules[i].remove();
        }
    }

    previousRules.push(block);
}

function cloneProperties(properties){
    var newProperties = {};

    for(var key in properties){
        newProperties[key] = properties[key];
    }

    return newProperties;
}

function optimiseSelector(selector, block, definedRules){
    cleanPreviousRules(selector, block, definedRules);
}

function Block(type, selectors, parent, definedRules, properties){
    this.type = type;
    this.selectors = selectors;
    this.properties = cloneProperties(properties);
    this.remove = function(){
        parent.splice(parent.indexOf(this),1);
        for(var i = 0; i < this.selectors.length; i++){
            var previousRules = definedRules[selectors[i]];
            if(!previousRules){
                continue;
            }
            previousRules.splice(previousRules.indexOf(this),1);
        }
    }
}

function optimiseStatements(block){
    var properties = {},
        lastPropertyToken;

    for(var i = 0; i < block.content.length; i++){
        if(block.content[i].type !== 'statement'){
            continue;
        }

        var propertyToken = block.content[i],
            propertyValues = properties[propertyToken.property] || [];

        if(lastPropertyToken && propertyToken.property !== lastPropertyToken.property){
            propertyValues = [];
        }

        delete properties[propertyToken.property];

        propertyValues.push(propertyToken.valueTokens);

        if(deepEqual(lastPropertyToken, propertyToken)){
            continue;
        }

        properties[propertyToken.property] = propertyValues;
        lastPropertyToken = propertyToken;
    }

    return properties;
}

function optimiseSelectorBlock(block, ruleset, definedRules){
    var properties = optimiseStatements(block);

    for(var i = 0; i < block.selectors.length; i++){
        var newBlock = new Block(
            'selectorBlock',
            block.selectors.slice(i,i+1),
            ruleset,
            definedRules,
            properties
        );
        optimiseSelector(block.selectors[i], newBlock, definedRules);
        ruleset.push(newBlock);
    }
}

function optimiseSpecialBlock(block, ruleset){
    ruleset.push({
        type: 'specialBlock',
        kind: block.kind,
        keyTokens: block.keyTokens,
        properties: optimiseStatements(block),
        content: optimise(block.content)
    });
}

function optimiseBlock(block, ruleset, definedRules){
    if(block.selectors){
        optimiseSelectorBlock(block, ruleset, definedRules);
    }else if(block.kind){
        optimiseSpecialBlock(block, ruleset, definedRules);
    }
}

function optimiseAt(at, ruleset){
    ruleset.push({
        kind: at.kind,
        type: 'at',
        valueTokens: at.valueTokens
    });
}

function optimiseItem(item, ruleset, definedRules){
    switch(item.type){
        case 'block': return optimiseBlock(item, ruleset, definedRules);
        case 'at': return optimiseAt(item, ruleset, definedRules);
    }
}

function optimiseRules(rules){
    var lastRule = rules[0];
    for(var i = 1; i < rules.length; i++){
        var rule = rules[i];

        if(rule.type === 'selectorBlock'){

            if(deepEqual(rule.properties, lastRule.properties)){
                rule.selectors.unshift.apply(rule.selectors, lastRule.selectors);
                lastRule.remove();
            }
            lastRule = rule;
        }
        if(rule.type === 'specialBlock'){
            optimiseRules(rule.content);
        }
    }
}

function optimise(ast){
    var ruleset = [];
    var definedRules = {};

    for (var i = 0; i < ast.length; i++) {
        optimiseItem(ast[i], ruleset, definedRules);
    };
    optimiseRules(ruleset);

    return ruleset;
}

module.exports = optimise;