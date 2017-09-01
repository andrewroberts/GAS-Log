// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint: 22 March 2015 08:56 GMT
// Unit Tests: 22 March 2015 08:50 GMT

/*
 * Copyright (C) 2015-2017 Andrew Roberts (andrew@roberts.net)
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later 
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with 
 * this program. If not, see http://www.gnu.org/licenses/.
 */

/**
 * Log.gs
 * ======
 *
 * Wrapper for the BetterLog library those main new feature is the 
 * conditional, automatic output of calling function names. This uses a 
 * forced error to get the stack trace rather than using 
 * arguments.callee.name which is deprecated in strict ES5, and who knows,
 * GAS might be conforming to that by the time yor read this!
 *
 * NOTE: As this library uses exceptions to get the function names, 
 * the displaying function names feature has to be disabled for the 
 * debugger in the script editor to work.
 *
 * https://sites.google.com/site/scriptsexamples/custom-methods/betterlog
 *
 * Include BetterLog library - MYB7yzedMbnJaMKECt6Sm7FLDhaBgl_dE 
 */

// TODO - Look at BetterLog options
// TODO - Allow more than one value to be passed to a format string 
// (apply() or Utilities.formatString(template, args)?)

// Public Properties
// -----------------

// Enum for setting the logging level
var Level = BetterLog.Level;

// Enum for whether or not to output the calling function's name
var DisplayFunctionNames = Object.freeze({
  YES : true,
  NO  : false
});

// Enum for Outputting a user id
var DisplayUserId = Object.freeze({
  USER_KEY_HIDE : 'USER_KEY_HIDE', // Display the active user key but hide most of the chars
  USER_KEY_FULL : 'USER_KEY_FULL', // Display the full active user key
  EMAIL_HIDE    : 'EMAIL_HIDE',    // Display the active user email but hide the user name
  EMAIL_FULL    : 'EMAIL_FULL',    // Display the full active user email
  NONE          : 'NONE'           // Do not display user ID 
});

// Private Properties
// ------------------

var initOptions_= {};
var thisApp_ = this;

// Public Methods
// --------------

/**
 * Initialise Betterlog
 *
 * @param {InitOptions}
 */

function init(initOptions) {

  initOptions_.level                = Level.OFF;               // Level of logging to be output  
  initOptions_.sheetId              = '';                      // log sheet id (will use one called 'Log')  
  initOptions_.sheetName            = '';                      // Specify log sheet name  
  initOptions_.displayFunctionNames = DisplayFunctionNames.NO; // Display calling function names  
  initOptions_.displayUserId        = DisplayUserId.NONE;      // Whether a user ID should be output
  initOptions_.firebaseUrl          = null;                    // Firebase url
  initOptions_.firebaseSecret       = null;                    // Firebase secret
  initOptions_.lock                 = null;                    // Lock service 

  if (typeof initOptions === 'object') {
    for (var key in initOptions) {
      if (initOptions.hasOwnProperty(key)) {      
        initOptions_[key] = initOptions[key];
      }
    }
  }

  if (initOptions_.level === Level.OFF) {
    return;
  }

  if (initOptions_.lock === null) {
    throw new Error('You have to specify a lock service, e.g. LockService.getScriptLock()')
  }

  BetterLog.storeLock(initOptions_.lock)

  BetterLog.setLevel(initOptions_.level);
    
  if (initOptions_.firebaseUrl !== null) {
    
    // Firebase has to come first, so that if it isn't used and 
    // the sheet ID isn't specified this is passed to BetterLog and the 
    // active sheet is used
    BetterLog.useFirebase(initOptions_.firebaseUrl, initOptions_.firebaseSecret)
    
  } else {
    
    BetterLog.useSpreadsheet(initOptions_.sheetId, initOptions_.sheetName); 
  }
  
  BetterLog.storeUserId(initOptions.displayUserId)
  
} // init()
  
/**
 * Message for user. Critical error that stops the script. Back out or throw 
 * an error. 
 *
 * @param {Object} message The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
 * @param {Object...} options If a format string is used in the message, a number of values to insert into the format string.
 *
 * @returns {Log} This object, for chaining
 */
   
function severe(message, options) {
  message = (typeof message !== 'undefined') ? Utilities.formatString.apply(null, arguments) : ''  
  format_(BetterLog.severe, message); 
  return thisApp_;
}
  
/**
 * Message for user. Possiblly severe error, but continue operation.
 *
 * @param {Object} message The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
 * @param {Object...} options  If a format string is used in the message, a number of values to insert into the format string.
 *
 * @returns {Log} This object, for chaining
 */
   
function warning(message, options) {
  message = (typeof message !== 'undefined') ? Utilities.formatString.apply(null, arguments) : ''  
  format_(BetterLog.warning, message);
  return thisApp_;  
}
  
/**
 * Purely informational message for user.
 *
 * @param {Object} message The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
 * @param {Object...} options If a format string is used in the message, a number of values to insert into the format string.
 *
 * @returns {Log} This object, for chaining
 */
  
function info(message, options) {
  message = (typeof message !== 'undefined') ? Utilities.formatString.apply(null, arguments) : ''  
  format_(BetterLog.info, message);
  return thisApp_;
}
  
/**
 * High level details for developer.
 *
 * @param {Object} message The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
 * @param {Object...} options If a format string is used in the message, a number of values to insert into the format string.
 *
 * @returns {Log} This object, for chaining
 */
  
function fine(message, options) {
  message = (typeof message !== 'undefined') ? Utilities.formatString.apply(null, arguments) : ''
  format_(BetterLog.fine, message);
  return thisApp_;
}
  
/** 
 * Mid-level details for developer.
 *
 * @param {Object} message The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
 * @param {Object...} options If a format string is used in the message, a number of values to insert into the format string.
 *
 * @returns {Log} This object, for chaining
 */
  
function finer(message, options) {
  message = (typeof message !== 'undefined') ? Utilities.formatString.apply(null, arguments) : ''  
  format_(BetterLog.finer, message);
  return thisApp_;
}
  
/**
 * Low-level details for developer.
 *
 * @param {Object} message The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
 * @param {Object...} options If a format string is used in the message, a number of values to insert into the format string.
 *
 * @returns {Log} This object, for chaining
 */
   
function finest(message, options) {
  message = (typeof message !== 'undefined') ? Utilities.formatString.apply(null, arguments) : ''  
  format_(BetterLog.finest, message);
  return thisApp_;
}

/**
 * Function entry point
 *
 * @param {Object} message The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
 * @param {Object...} options If a format string is used in the message, a number of values to insert into the format string.
 *
 * @returns {Log} This object, for chaining
 */
   
function functionEntryPoint(message, options) {
  message = (typeof message !== 'undefined') ? Utilities.formatString.apply(null, arguments) : ''  
  format_(BetterLog.finest, message);
  return thisApp_;
}

/**
 * Get BetterLog level
 *
 * @returns {string}
 */

function getLevel() {return BetterLog.getLevel();}

/**
 * Set BetterLog level
 *
 * @param {Level} level
 * 
 * @returns {string};
 */

function setLevel(level) {return BetterLog.setLevel(level);}

/**
 * BetterLog configuration details for developer.
 *
 * @param {Object} message The message to log or an sprintf-like format string (uses Utilities.formatString() internally - see http://www.perlmonks.org/?node_id=20519 as a good reference).
 * @param  {Object...} options If a format string is used in the message, a number of values to insert into the format string.
 *
 * @returns {Log} This object, for chaining
 */

function blConfig(message, options) {
  message = Utilities.formatString.apply(null, arguments)
  format_(BetterLog.config, message);
  return thisApp_;
}

/**
 * Clear the debug log 
 */
   
function clear() {
  BetterLog.clear()
} // clear()
    
// Private Methods
// ---------------

/**
 * Private function for formatting the string before passing it to BetterLog
 *
 * @param {function} the BetterLog function to call
 * @param {String} message 
 *
 * @returns {Log} This object, for chaining
 */
 
function format_(logFunction, message) {
  
  var hyphenl
  var callingfunctionName = '';
  
  if (initOptions_.level === Level.OFF) {
    return;
  }
  
  if (initOptions_.displayFunctionNames) {

    var hyphen = ' - ';

    callingfunctionName = getFunctionName() + '()';

    if (typeof message === 'undefined' || message === '') {
    
      message = '';
      hyphen = '';  
    }
    
  } else {
  
    hyphen = (initOptions_.firebaseUrl === null) ? '- ' : ''; // Remove the first space as that is added by BetterLog
  
    if (typeof message === 'undefined' || message === '') {
    
      // All variables are ignored
      logFunction = function() {};
    }
  }
  
  logFunction(callingfunctionName + hyphen + message);
  
  return;
  
  // Private functions
  // -----------------

  /**
   * Get the function name from the stack trace generated when throwing
   * an error
   *
   * @return {string} function name
   */
  
  function getFunctionName() {
  
    try {
    
      throw new Error('Throw error to get stack trace');
      
    } catch (error) {
    
      // The calling function we're interested in is four levels up
      var stack = error.stack.split('\n')[3];
      var functionName = getFunctionNameFromStackTraceLine(stack);
      return functionName;
      
    } // format_.getFunctionName()
    
    // Private Functions
    // -----------------
    
    /** 
     * Get the function name from a line of stack trace.
     *
     * @param {string} txt
     *
     * @return {string} function name
     */
    
    function getFunctionNameFromStackTraceLine(txt) {
      
//      Logger.log(txt);
      
      // '\tat <fileName> [(<Library>)]:<lineNumber> (<functionName>)'

/*
      // TODO - Fails for objects returning objects containing functions

      var colon = txt.indexOf(':');
      var firstBrace = txt.indexOf('(', colon);
      var lastBrace = txt.indexOf(')', colon);
      var functionName = txt.slice(firstBrace + 1, lastBrace);
*/            
      return txt;
      
    } // format_.getFunctionName.getFunctionNameFromStackTraceLine()
    
  } // format_.getFunctionName()

} // format_()

