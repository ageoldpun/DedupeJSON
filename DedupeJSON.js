var fs = require('fs');

/*
 * REQUIREMENTS
 * 1. The data from the newest date should be preferred
 * 2. Duplicate IDs count as dups.
 *    Duplicate emails count as dups. Both must be unique in our dataset.
 *    Duplicate values elsewhere do not count as dups.
 * 3. If the dates are identical the data from the record provided last in the list should be preferred
 */

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

var appendReturnLeads = function(greaterDate, matchingLead, lead) {
  switch (greaterDate) {
    case "a":
      // delete b from the returnLeads array
      returnLeads.splice(returnLeads.indexOf(matchingLead), 1);
      break;
    case "b":
      // delete a from the returnLeads array
      returnLeads.splice(returnLeads.indexOf(lead), 1);
      break;
    default:
      // find out which has higher index and delete the other from returnLeads array
      if (originalLeads.indexOf(matchingLead) > originalLeads.indexOf(lead)) {
        returnLeads.splice(returnLeads.indexOf(lead), 1);
      } else {
        returnLeads.splice(returnLeads.indexOf(matchingLead), 1);
      }
  }
}

var originalLeads = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).leads;
var returnLeads = originalLeads

originalLeads.forEach(function(lead, index) {
  // loop through the leads to see if any ids match
  originalLeads.forEach(function(matchingLead, matchingIndex) {
    if (lead._id === matchingLead._id && index !== matchingIndex) {
      // if so, find out which one has later date and delete the other
      var greaterDate = maxDate(lead.entryDate, matchingLead.entryDate);
      appendReturnLeads(greaterDate, matchingLead, lead);
    }
  });

  // loop through the leads to see if any emails match
  originalLeads.forEach(function(matchingLead, matchingIndex) {
    if (lead.email === matchingLead.email && index !== matchingIndex) {
      // if so, find out which one has later date and delete the other
      var greaterDate = maxDate(lead.entryDate, matchingLead.entryDate);
      appendReturnLeads(greaterDate, matchingLead, lead);
    }
  });
});

console.log(returnLeads);
return returnLeads;
