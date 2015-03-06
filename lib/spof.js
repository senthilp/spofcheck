/**
 * Copyright (c) 2012 eBay Inc.
 * Author: Senthil Padmanabhan
 *
 * Released under the MIT License
 * http://www.opensource.org/licenses/MIT
 *
 * The node version of spof.
 * Retrieves the spof api from the core engine, registers the rule and
 * exports the updated spof object
 */

var spof = require('./engine').spof,
    rules = require('./rules').rules;

// Registering the default SPOF rules
spof.registerRules(rules);

// Exporting the spof object with the rules applied
module.exports.spof = spof;