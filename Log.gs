// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint: 22 March 2015 08:56 GMT
// Unit Tests: 22 March 2015 08:50 GMT

/*
 * Copyright (C) 2015 Andrew Roberts (andrew@roberts.net)
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
  YES: true,
  NO: false
});

// Enum for whether or not to output a temporary user id
var DisplayUserId = Object.freeze({
  YES: true,
  NO: false
});

// Class for passing options to init()
function InitOptions() {

  // Level of logging to be output
  this.level = Level.OFF;
  
  // log sheet id (will use one called 'Log')  
  this.sheetId = ''; 
  
  // Specify log sheet name  
  this.sheetName = 'Log'; 
  
  // Display calling function names  
  this.displayFunctionNames = DisplayFunctionNames.NO; 
  
  // Whether a user ID should be output
  this.displayUserId = DisplayUserId.NO;
  
} // InitOptions()

// Private Properties
// ------------------

// Local copy of the inital options
var initOptions_ = new InitOptions();

var thisApp_ = this;

var userId_;

// Public Methods
// --------------

/**
 * Initialise Betterlog
 *
 * @param {InitOptions}
 */

function init(initOptions) {

  var key;

  if (typeof initOptions !== 'undefined') {
  
    for (key in initOptions) {

      if (initOptions.hasOwnProperty(key)) {      
        initOptions_[key] = initOptions[key];
      }
    }
  }

  BetterLog.setLevel(initOptions_.level);
  
  if (initOptions_.level !== Level.OFF) {
    BetterLog.useSpreadsheet(initOptions_.sheetId, initOptions_.sheetName);
  }
  
  if (initOptions.displayUserId) {
    userId_ = Session.getTemporaryActiveUserKey()
  }
  
} // init
  
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
 * Clear the debug log sheet
 */
   
function clear() {

  if (initOptions_.sheetId !== '') {
  
    SpreadsheetApp
      .openById(initOptions_.sheetId)
      .getSheetByName(initOptions_.sheetName)
      .clearContents();
  
  } else {
  
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(initOptions_.sheetName)
      .clearContents();
  }
  
  SpreadsheetApp.flush()
  
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
  
  var hyphen = ' - ';
  var callingfunctionName = '';
  
  if (initOptions_.level === Level.OFF) {
    return;
  }
  
  if (initOptions_.displayFunctionNames) {

    callingfunctionName = getFunctionName() + '()';

    if (typeof message === 'undefined' || message === '') {
    
      message = '';
      hyphen = '';  
    }
    
  } else {
  
    if (typeof message === 'undefined' || message === '') {
    
      // All variables are ignored
      logFunction = function() {};
    }
  }
  
  if (initOptions_.displayUserId) {
    message = userId_ + ' - ' + message
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

