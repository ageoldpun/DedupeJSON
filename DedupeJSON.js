var fs = require('fs');
var _ = require('./dependencies/lodash');

/*
 * REQUIREMENTS
 * 1. The data from the newest date should be preferred
 * 2. duplicate IDs count as dups. Duplicate emails count as dups. Both must be unique in our dataset. Duplicate values elsewhere do not count as dups.
 * 3. If the dates are identical the data from the record provided last in the list should be preferred
 */

var leads = JSON.parse(fs.readFileSync('leads.json', 'utf8')).leads;

console.log(leadsWithOriginalIndex);
