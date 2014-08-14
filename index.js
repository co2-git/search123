/**
 *    search123 Node API module
 *    =========================
 *
 *    A module to connect with the search123 API in order to perform searches
 *
**/

// Get the validate() function that will validate options

var validate = require('./lib/validate');

// Get the parameters model

var parameters = require('./lib/parameters');

// Promises

var Q = require('q');

// Search API URL

var url = 'http://cgi.search123.uk.com/xmlfeed?';

// DOM parser helper function

function getData (node, of) {
  var tag = node.getElementsByTagName(of).item(0);
  if ( tag ) {
    return node.getElementsByTagName(of).item(0).childNodes.item(0).nodeValue;
  }
}


// DOM parser helper function

function getSections (section) {

  var sections = [];

  Array.prototype.slice.call(section).forEach(function (node) {
    sections.push({
      title:            getData(node, 'title'),
      description:      getData(node, 'description'),
      favicon:          getData(node, 'favicon'),
      display_url:      getData(node, 'display_url'),
      url:              getData(node, 'url'),
      rank:             getData(node, 'rank'),
    });
  });

  return sections;
}

// The actual function

function search123 (options) {

  // Make a promise
  
  var deferred = Q.defer();

  // Use domain

  var domain = require('domain').create();

  // On domain errors, reject promise

  domain.on('error', function (error) {
    console.log('error', error.message, error.name, error.stack.split(/\n/));
    deferred.reject(error);
  });

  // Run domain

  domain.run(function () {

    // Validate options

    validate(options);

    // URL-Encode options

    for ( var param in parameters ) {
      if ( parameters[param].encode ) {
        options[param] = encodeURIComponent(options[param]);
      }
    }

    // Encode the options into urlParamters

    var urlParameters = [];

    for ( var option in options ) {
      if ( ['aid', 'ip', 'query', 'market', 'uid', 'client_ref', 'organic_start', 'organic_size'] ) {
        urlParameters.push(require('util').format('%s=%s', option, options[option]));
      }
    }

    // Add query string to the URL

    url += urlParameters.join('&');

    console.log('Search API', url);

    // Use the requests module

    var request = require('request');

    // Call search123

    request(url, domain.intercept(function (response, body) {

      // Get DOMParser

      var DOMParser = require('xmldom').DOMParser;

      // Parse XML response

      var doc = new DOMParser().parseFromString(body);

      // Build promise reponse

      var res = {
        sponsored: {
          ads: getSections(doc.getElementsByTagName('sponsored').item(0)
            .getElementsByTagName('ads').item(0)
            .getElementsByTagName('ad'))
        }
      };

      // Get organic results if any

      var organic = doc.getElementsByTagName('organic').item(0);

      if ( organic ) {
        res.organic = {
          matched: +organic
            .getElementsByTagName('matched').item(0)
            .childNodes.item(0).nodeValue,
          listings: getSections(organic
            .getElementsByTagName('listings').item(0)
            .getElementsByTagName('listing'))
        };
      }

      // Resolve promises

      deferred.resolve({ json: res, xml: body });

    }));
  });

  // Return promise

  return deferred.promise;
}

// Expose search123

module.exports = search123;
