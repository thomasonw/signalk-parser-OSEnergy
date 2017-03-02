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

var Transform = require('stream').Transform;
var util = require('util');
var _ = require('lodash');
var codecs = require('../codecs');
var debug = require('debug')('signalk-parser-OSEnergy');
var uuid = require('uuid').v4;
var Multiplexer = require('signalk-multiplexer');

function Parser(opts) {
  if (!(this instanceof Parser)) {
    return new Parser(opts);
  }

  var self = this;
  var options = opts || {};

  
  if (!options.stream) {
    options.stream = {};
  }

  options.stream.objectMode = true;
  Transform.call(this, options.stream);

  this._linesParsed = 0;
  this._linesProcessed = 0;
  this._options = options;
  this._lineBuffer = "";
 

  this.self = {};
  this.self.id = this._options.selfId || String(uuid().split('-')[0]).toUpperCase();
  this.self.type = this._options.selfType || 'uuid';

  this._multiplexer = new Multiplexer(this.self.id, this.self.type);
  this._codecs = require('../codecs');
  this._multiplexer.deviceName = "???";	 	// Placeholder until we recevie a true device name from NPS; string.
  this._multiplexer.associatedBus = 0;		// Assume device is on DC bus 0 until updated from CST; string.
  this._multiplexer.pullyRatio = null;      // Pully Ratio N/A till we receive it from a SCV: string.

  this._multiplexer.on('change', function() {
    if (self.listeners('sentence').length > 0 ||
      self.listeners('signalk').length > 0 ||
      self.listeners('data').length > 0) {
      var data = self._multiplexer.retrieve();

      self.emit('sentence', data, self._linesParsed, self._linesProcessed);
      self.emit('signalk', data, self._linesParsed, self._linesProcessed);
      self.push(data);
    }
  });

  this._multiplexer.on('change:delta', function(delta) {
    self.emit('delta', delta, self._linesParsed, self._linesProcessed);
  });
}

util.inherits(Parser, Transform);

Parser.prototype._validSentence = function(sentence) {
  sentence = String(sentence).trim();

  if ((sentence === "") || (sentence.length < 5)){
    return false;
  }

   
  if ((sentence.charAt(3) == ';') && (sentence.charAt(4) == ',')) {
      return true
  } else
    return false;

}

Parser.prototype._lineData = function(sentence) {
  this.emit('OSEnergy', sentence);
  var values = sentence.split(',');

    var data = {
      instrument: this._multiplexer.deviceName,
      type:       values[0].slice(0, 3),
      values: []
    };

  
  for (var i = 1; i < values.length; i++) {
    data.values.push(values[i]);
  }

  return data;
}


Parser.prototype._decode = function(data, line) {
  if (typeof codecs[data.type.toUpperCase()] !== 'undefined') {
    return codecs[data.type.toUpperCase()].decode(this._multiplexer, data, line);
  }
}

Parser.prototype._transform = function(chunk, encoding, done) {
  if (Buffer.isBuffer(chunk)) {
    chunk = chunk.toString();
  }

  var self = this;

  this._lineBuffer += chunk;

  if (this._lineBuffer.indexOf('\n') !== -1 || (this._lineBuffer.indexOf('\n') === -1 && this._lineBuffer.indexOf(';') !== -1)) {
    var split = this._lineBuffer.split('\n'); 
    var unfinished = "";
    var lines = [];

    _.each(split, function(line) {
      line = line.trim();

      if (line !== '') {
        if (line.length >= 5 && line.charAt(3) == ';' && line.charAt(4) == ',') {
            // we have a full line - and it looks like it might be valid.
            lines.push(line);
        } else {
          unfinished += line;
        }
      }
    });

    _.each(lines, function(line) {
      if (self._validSentence(line)) {
        var data = self._lineData(line);
        var valid = self._decode(data, line);

        // Internal counter counting lines that were processed
        self._linesProcessed++;

        if (valid) {
          // Internal counter counting lines that were actually parsed.
          // Lines that weren't parsed are either of an unsupported type (see codecs) or VOID.
          self._linesParsed++;
        }
      }
    });
  }
        // Cut out the lines(s) we just prcoessed from _lineBuffer
  if (split[split.length - 1].length >= 5 && split[split.length - 1].charAt(3) == ';' && split[split.length - 1].charAt(4) == ',') {
      this._lineBuffer = split[split.length - 1];
    } else {
      this._lineBuffer = "";
    }
 
  
  return done();
}

Parser.prototype._flush = function(done) {
  return done();
}



function parseLine(line, cb, opts) {
  var parser = new Parser(opts);

  parser.on('sentence', function(signal) {
    cb(null, signal);
    parser.end();
    parser = undefined;
  });

  parser.write(line);
}



module.exports = {
  Parser: Parser,
  parse: parseLine
};



