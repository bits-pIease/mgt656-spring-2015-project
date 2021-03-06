'use strict';

var events = require('../models/events');


/**
 * Controller that renders our index (home) page.
 */
function index (request, response) {
  var now = new Date();
  var contextData = {
    'title': 'MGT 656',
    'tagline': 'You are doomed (just kidding).',
    'events': [] 
  };
  for(var i=0; i < events.all.length; i++){
    var event = events.all[i];
    if(event.date > now){
      contextData.events.push(event);
    }
  }
  response.render('index.html', contextData);
}
function sprint2(request, response){
  response.render('sprint2.html');
}
function sprint(request, response){
  response.render('sprint.html');
}
function sprint3(request, response){
  response.render('sprint3.html');
}

module.exports = {
  index: index,
  'sprint': sprint,
  'sprint2' : sprint2,
  'sprint3': sprint3
};
