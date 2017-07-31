const _ = require('lodash');

function buildXML (opts) {
    const name = opts.name;
    const attr = opts.attr;
    const children = opts.children || [];

    if (!name) {
        throw new Error('opts.name is required.');
    }
    
    return [
        `<${name}${attr ? (' ' + stringifyAttributes(attr)) : ''}>`,
        _.map(children, (opts) => {
            return buildXML(opts);
        }).join(''),
        `</${name}>`
    ].join('');
}

function stringifyAttributes (attr = {}) {
    return _.map(attr, (val, key) => {
        return `${key}="${val}"`;
    }).join(' ');
}

module.exports = function (attr, opts) {
    return [
        `<?xml${opts ? (' ' + stringifyAttributes(attr)) : ''}?>`,
        buildXML(opts)
    ].join('');
};
