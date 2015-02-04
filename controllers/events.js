'use strict';

var events = require('../models/events');
var validator = require('validator');

// Date data that would be useful to you
// completing the project These data are not
// used a first.
//
var allowedDateInfo = {
  months: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  },
  minutes: [0, 30],
  hours: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
  ]
};

/**
 * Controller that renders a list of events in HTML.
 */
function listEvents(request, response) {
  var currentTime = new Date();
  var contextData = {
    'events': events.all,
    'time': currentTime
  };
  response.render('event.html', contextData);
}

function validateString(request, name, minVal, maxVal, contextData){
  var value = null;
  if (validator.isLength(request.body[name], minVal, maxVal) === false) {
    contextData.errors.push('Your ' + name + ' must be between 1 and 50 characters.');
  }
  else {
    value = request.body[name];
  }
  return value;
}

function validateInt(request, name, minVal, maxVal, contextData){
  var value = null;
  if (validator.isInt(request.body[name]) === false) {
    contextData.errors.push('Your ' + name + ' must be an integer.');
  }
  else {
    value = parseInt(request.body[name], 10);
    if (name === 'minute') {
      if (value !== minVal && value !== maxVal) {
        contextData.errors.push('Your ' + name + ' must be ' + minVal + ' or ' + maxVal + '.');
      }
    }
    else {
      if (value < minVal || value > maxVal) {
        contextData.errors.push('Your ' + name + ' must be between ' + minVal + ' and ' + maxVal + '.');
      }
    }
  }
  return value; 
}

/**
 * Controller that renders a page for creating new events.
 */
function newEvent(request, response){
  var contextData = {};
  response.render('create-event.html', contextData);
}

/**
 * Controller to which new events are submitted.
 * Validates the form and adds the new event to
 * our global list of events.
 */
function saveEvent(request, response){
  var contextData = {errors: []};

  if (validator.isURL(request.body.image, {protocols: ['http','https'], require_protocol: true }) === false) {
    contextData.errors.push('Your image URL must begin with http:// or https://.');
  }
  var URL = request.body.image; 
  if (URL.match(/\.(png|gif)$/) === null) {
    contextData.errors.push('Your image URL must end with .gif or .png.');
  }

  var title = validateString(request, 'title', 1, 50, contextData);
  var location = validateString(request, 'location', 1, 50, contextData);
  var year = validateInt(request, 'year', 2015, 2016, contextData);
  var month = validateInt(request, 'month', 0, 11, contextData);
  var day = validateInt(request, 'day', 1, 31, contextData);
  var hour = validateInt(request, 'hour', 0, 23, contextData);
  var minute = validateInt(request, 'minute', 0, 30, contextData)

  if (contextData.errors.length === 0) {
    var newEvent = {
      title: request.body.title,
      location: request.body.location,
      image: request.body.image,
      date: new Date(),
      attending: []
    };
    events.all.push(newEvent);
    response.redirect('/events');
  }else{
    response.render('create-event.html', contextData);
  }
}

function eventDetail (request, response) {
  var ev = events.getById(parseInt(request.params.id));
  if (ev === null) {
    response.status(404).send('No such event');
  }
  response.render('event-detail.html', {event: ev});
}

function rsvp (request, response){
  var ev = events.getById(parseInt(request.params.id));
  if (ev === null) {
    response.status(404).send('No such event');
  }

  if(validator.isEmail(request.body.email)){
    ev.attending.push(request.body.email);
    response.redirect('/events/' + ev.id);
  }else{
    var contextData = {errors: [], event: ev};
    contextData.errors.push('Invalid email');
    response.render('event-detail.html', contextData);    
  }

}
function api(request, response){
  var output = {events: []};
  var search = request.query.search;
  if(search){
    for(var i=0; i< events.all.length; i++){
      if(events.all[i].title.indexOf(search) !== -1){
        output.events.push(events.all[i]);
      }
    }
  }else{
    output.events = events.all;
  }
  
  response.send(output);
}

/**
 * Export all our functions (controllers in this case, because they
 * handles requests and render responses).
 */
module.exports = {
  'listEvents': listEvents,
  'eventDetail': eventDetail,
  'newEvent': newEvent,
  'saveEvent': saveEvent,
  'rsvp': rsvp,
  'api': api
};