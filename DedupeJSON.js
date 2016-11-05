var fs = require('fs');

/*
 * REQUIREMENTS
 * 1. The data from the newest date should be preferred
 * 2. Duplicate IDs count as dups.
 *    Duplicate emails count as dups. Both must be unique in our dataset.
 *    Duplicate values elsewhere do not count as dups.
 * 3. If the dates are identical the data from the record provided last in the list should be preferred
 */

var originalLeads = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).leads;
var returnLeads = originalLeads;
var removedEntries = [];

var maxDate = function(dateA, dateB) {
  var parsedDateA = Date.parse(dateA);
  var parsedDateB = Date.parse(dateB);
  if (parsedDateA > parsedDateB) {
    return 'a';
  } else if (parsedDateB > parsedDateA) {
    return 'b';
  } else if (parsedDateA == parsedDateB) {
    return 'same';
  }
};

var removeDuplicateLead = function(greaterDate, lead, matchingLead) {
  switch (greaterDate) {
    case "a":
      // delete b from the returnLeads array
      removedEntries.push(returnLeads[returnLeads.indexOf(matchingLead)]);
      returnLeads.splice(returnLeads.indexOf(matchingLead), 1);
      break;
    case "b":
      // delete a from the returnLeads array
      removedEntries.push(returnLeads[returnLeads.indexOf(lead)]);
      returnLeads.splice(returnLeads.indexOf(lead), 1);
      break;
    default:
      // find out which has higher index and delete the other from returnLeads array
      if (originalLeads.indexOf(matchingLead) > originalLeads.indexOf(lead)) {
        removedEntries.push(returnLeads[returnLeads.indexOf(lead)]);
        returnLeads.splice(returnLeads.indexOf(lead), 1);
      } else {
        removedEntries.push(returnLeads[returnLeads.indexOf(matchingLead)]);
        returnLeads.splice(returnLeads.indexOf(matchingLead), 1);
      }
  }
};

originalLeads.forEach(function(lead, index) {
  // loop through the leads to see if any ids match
  originalLeads.forEach(function(matchingLead, matchingIndex) {
    if (lead._id === matchingLead._id && index !== matchingIndex) {
      var greaterDate = maxDate(lead.entryDate, matchingLead.entryDate);
      removeDuplicateLead(greaterDate, lead, matchingLead);
    }
  });

  // loop through the leads to see if any emails match
  originalLeads.forEach(function(matchingLead, matchingIndex) {
    if (lead.email === matchingLead.email && index !== matchingIndex) {
      var greaterDate = maxDate(lead.entryDate, matchingLead.entryDate);
      removeDuplicateLead(greaterDate, lead, matchingLead);
    }
  });
});

var log = 'Original file name: ' + process.argv[2] +
  '\nOriginal data: ' + JSON.stringify({leads: originalLeads}) +
  '\nRemoved Entries: ' + JSON.stringify({leads: removedEntries});

fs.writeFileSync('./dedupe.json', JSON.stringify({leads: returnLeads}), 'utf-8');
fs.writeFileSync('./removedEntries.log', log, 'utf-8');
