'use strict';
var events = require('../models/events');

/**
 * Controller that renders our index (home) page.
 */
function index (request, response) {
  var html = "";
   for(var i=0; i< events.all.length; i++){
        html = html + events.all[i].title + "<br>";
    }
  var contextData = {
    'title': 'MGT 656',
    'tagline': 'You are doomed (just kidding).',
    'html': html
  };
  response.render('index.html', contextData);
}

module.exports = {
  index: index
};
