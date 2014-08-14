var parameters    = require('./parameters');

var format        = require('util').format;

var validator     = require('validator');

module.exports    = function validate (options) {

  // Make sure we have options

  if ( ! ( !!options || options instanceof Object ) ) {
    throw new TypeError('Options must be an object');
  }

  // Parameter validation variables

  var valid, declared, typeMatch, minMatch, maxMatch, intMatch, lenMatch, regexMatch;

  // Validate options against parameters

  for ( var param in parameters ) {

    // Whether or not the option is declared

    declared  = typeof options[param] !== 'undefined' && options[param] !== null;

    // Whether or not the option has the right type

    typeMatch = true;

    // Whether or not the option is an integer

    intMatch = true;

    // Whether or not the option matches the parameter regular expression

    regexMatch = true;

    // If option is declared, perform validation

    if ( declared ) {

      // Type validation

      switch ( parameters[param].type ) {

        // Number

        case Number:

          // Basic type check

          typeMatch = typeof options[param] === 'number';

          break;

        // String

        case String:

          // Basic type check

          typeMatch = typeof options[param] === 'string';

          // Regex match using validator

          if ( typeMatch && parameters[param].match ) {
            regexMatch = validator[parameters[param].match](options[param]);
          }

          break;
      }
    }

    // Whether or not the option is valid

    valid = (declared && typeMatch && intMatch && regexMatch);

    // Upon option not valid

    if ( ! valid ) {
      if ( parameters[param].required ) {

        // Throw error on option not declared

        if ( ! declared ) {
          throw new Error(format('Missing parameter %s', param));
        }

        // Throw error on option type mismatch

        if ( ! typeMatch ) {
          throw new TypeError(format('Invalid type for parameter %s. Expecting %s, got %s',
            param, parameters[param].type.name.toLowerCase(), typeof options[param]));
        }

        // Throw error on option not an integer
        
        if ( ! intMatch ) {
          throw new TypeError(format('Parameter %s is supposed to be an integer, got %s',
            param, options[param]));
        }

        // Throw error if option not matching regex
        
        if ( ! regexMatch ) {
          throw new Error(format('Parameter %s does not match pattern %s, got %s',
            param, parameters[param].match.toString(), options[param]));
        }
      }
    }
  }
};
