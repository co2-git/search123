var validate = require('./lib/validate');

var parameters = require('./lib/parameters');

var Q = require('q');

var url = 'http://cgi.search123.uk.com/xmlfeed?';

function getData (node, of) {
  var tag = node.getElementsByTagName(of).item(0);
  if ( tag ) {
    return node.getElementsByTagName(of).item(0).childNodes.item(0).nodeValue;
  }
}

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

function search123 (options) {
  
  var deferred = Q.defer();

  var domain = require('domain').create();

  domain.on('error', function (error) {
    console.log('error', error.message, error.name, error.stack.split(/\n/));
    deferred.reject(error);
  });

  domain.run(function () {
    // Validate options

    validate(options);

    // Encode options

    for ( var param in parameters ) {
      if ( parameters[param].encode ) {
        options[param] = encodeURIComponent(options[param]);
      }
    }

    var urlParameters = [];

    // Encode the options into urlParamters

    for ( var option in options ) {
      urlParameters.push(require('util').format('%s=%s', option, options[option]));
    }

    // Add query string to the URL

    url += urlParameters.join('&');

    var request = require('request');

    request(url, domain.intercept(function (response, body) {

      var DOMParser = require('xmldom').DOMParser;

      var doc = new DOMParser().parseFromString(body);

      var res = {
        sponsored: {
          ads: getSections(doc.getElementsByTagName('sponsored').item(0)
            .getElementsByTagName('ads').item(0)
            .getElementsByTagName('ad'))
        }
      };

      var organic = doc.getElementsByTagName('organic').item(0);

      if ( organic ) {
        res.organic = {
          matched: +doc.getElementsByTagName('organic').item(0)
            .getElementsByTagName('matched').item(0)
            .childNodes.item(0).nodeValue,
          listings: getSections(doc.getElementsByTagName('organic').item(0)
            .getElementsByTagName('listings').item(0)
            .getElementsByTagName('listing'))
        };
      }

      deferred.resolve(res);

    }));
  });

  return deferred.promise;
}

module.exports = search123;
