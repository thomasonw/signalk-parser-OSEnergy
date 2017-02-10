/*
 * Origional work: Copyright 2015 Fabian Tollenaar <fabian@starting-point.nl>
 * Modified work:  Copyright 2017 William (Al) Thomason <thomason.al@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

! function() {
  "use strict";

  var OSEnergy = function(name, decoder) {
    if (!(this instanceof OSEnergy)) return new OSEnergy();

    this.name = name;
    this._decoder = decoder;
    this.exceptions = [];

    this.errors = {
      GENERAL: 0,
      MALFORMED: 1,
      VOID: 2,
      VOID_MODE: 3
    };
  };

  OSEnergy.prototype.source = function(talker) {
    var source = {
      type: 'OSEnergy',
      sentence: this.name,
      label: 'signalk-parser-OSEnergy'
    };

    if(typeof talker === 'string' && talker.trim().length > 0) {
      source.talker = talker.toUpperCase()
    }

    return source
  };

  OSEnergy.prototype.transform = function(value, inputFormat, outputFormat) {
    value = this.float(value);

    inputFormat = inputFormat.toLowerCase();
    outputFormat = outputFormat.toLowerCase();

    if (inputFormat === outputFormat) {
      return value;
    }

    // AH
    if (inputFormat == 'ah') {
      if (outputFormat == 'c') return value  * 3600;
    }

    // C
    if (inputFormat == 'c') {
      if (outputFormat == 'ah') return value / 3600;
    }

    // Celsius
    if (inputFormat == 'c') {
      if (outputFormat == 'k') return value + 273.15
    }
    // Fahrenheit 
    if (inputFormat == 'f') {
      if (outputFormat == 'k') return (value + 459.67) * 5/9;
    }

    // Just return input if input/output formats are not recognised.
    return value;
  };

  OSEnergy.prototype.reportError = function(errorCode, errorMsg) {
    this.exceptions.push({
      source: this.name,
      code: errorCode,
      message: errorMsg,
      time: new Date().toISOString()
    });
  };

 
  OSEnergy.prototype.timestamp = function(time, date) {
    /* TIME (UTC) */
    if (time) {
      var hours, minutes, seconds;
      hours = this.int(time.slice(0, 2), true);
      minutes = this.int(time.slice(2, 4), true);
      seconds = this.int(time.slice(-2), true);
    } else {
      var dt, hours, minutes, seconds;
      dt = new Date();
      hours = dt.getUTCHours();
      minutes = dt.getUTCMinutes();
      seconds = dt.getUTCSeconds();
    }

    /* DATE (UTC) */
    if (date) {
      var year, month, day;
      day = this.int(date.slice(0, 2), true);
      month = this.int(date.slice(2, 4), true);
      year = this.int(date.slice(-2));

      // HACK copied from jamesp/node-nmea
      if (year < 73) {
        year = this.int("20" + year);
      } else {
        year = this.int("19" + year);
      }
    } else {
      var dt, year, month, day;

      dt = new Date();
      year = dt.getUTCFullYear();
      month = dt.getUTCMonth();
      day = dt.getUTCDate();
    }

    /* construct */
    var d = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    return d.toISOString();
  }



  OSEnergy.prototype.zero = function(n) {
    if (this.float(n) < 10) {
      return "0" + n;
    } else {
      return "" + n;
    }
  }

  OSEnergy.prototype.int = function(n) {
    if (("" + n).trim() === '') {
      return 0;
    } else {
      return parseInt(n, 10);
    }
  }

  OSEnergy.prototype.float = function(n) {
    if (("" + n).trim() === '') {
      return 0.0;
    } else {
      return parseFloat(n);
    }
  }


  OSEnergy.prototype.decode = function() {
    return this._decoder.apply(this, Array.prototype.slice.call(arguments));
  }

  module.exports = OSEnergy;

}();

