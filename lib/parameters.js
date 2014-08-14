var validator = require('validator');

validator.extend('isAID', function (str) {
  return (/^(\d+){5}$/).test(str);
});

validator.extend('isQuery', function (str) {
  return (/^(.+){1,100}$/).test(str);
});

validator.extend('isUserAgent', function (str) {
  return (/^.+?[/\s][\d.]+$/).test(str);
});

validator.extend('NO', function (str) {
  return str === 'NO';
});

validator.extend('isMarket', function (str) {
  return (/^([a-z]){2}$/).test(str);
});

module.exports = {
  "aid": {
    description: "Affiliate identification, assigned by Search123.uk.com",
    type: String,
    required: true,
    match: 'isAID'
  },

  "query": {
    description: "Search keyword or phrase(100 characters maximum).",
    type: String,
    required: true,
    match: 'isQuery',
    encode: true
  },

  "ip": {
    description: "IP address of the user viewing the search results on your site. (period delimited, four octet string).",
    type: String,
    required: true,
    match: 'isIP'
  },

  "uid": {
    description: "A Unique Identifier number use to ensure traffic qualitywith some partners. You may hardcode &uid=1 into your request query. A Unique Identifier number used to ensure traffic quality with some partners. We suggest that you use s123_12307, where you insert the Traffic Partner ID from your system.",
    type: String,
    required: true
  },

  "client_ref": {
    description: "The page which the user is on when the search is made. NOT the value in the HTTP_REFERER header.",
    type: String,
    required: true,
    match: 'isURL',
    encode: true
  },

  "client_ua": {
    description: "The value of the HTTP_USER_AGENT your user is sending in their headers.",
    type: String,
    required: true,
    match: 'isUserAgent',
    encode: true
  },

  "usid": {
    description: "User Session ID",
    type: String,
    required: true
  },

  "start": {
    description: "Index number (base 0) of the first listing to return from the entire result set. If the 'start' parameter is not included or out of range, the returned result set will begin with listing one of n (integer).",
    type: Number,
    min: 1,
    max: 20
  },

  "size": {
    description: "Maximum number of listings to return. A default and maximum of 20 listings will be returned per request (integer).",
    type: Number,
    min: 1,
    max: 20
  },

  "adult": {
    description: "Where content level is known, do not return adult listings (NO is the only value recognized)",
    type: String,
    match: 'NO'
  },

  "market": {
    description: "Two letter code for the market(s) you are approved for",
    type: String,
    match: 'isMarket'
  }
};