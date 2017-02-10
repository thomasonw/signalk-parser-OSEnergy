/*
 * Copyright 2017 Al Thomason <thomason.al@gmail.com>
 *   (Based on work from: Fabian Tollenaar <fabian@starting-point.nl> )
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



/* 
 * CST codec
 * 
 * @repository 			https://github.com/thomasonw/signalk-parser-OSEnergy
 * @author 			Al Thomason <thomason.al@gmail.com>
 *
 */

"use strict";

/*
NAME & PASSWORD CONFIG – NPC;
"NPC;,  Use BT?, Name, Password, , SerialNum”

NAME & PASSWORD CONFIG – NPC;
    NPC;
0       N  Use BT? 
1       S  Name 
2       S  Password 
4       -  <blank>
5       N  SerialNum

*/



var Codec = require('../lib/OSEnergy');

 
module.exports = new Codec('NPC', function(multiplexer, input) {
  var values = input.values;
  var lib    = require('../lib/index');

  lib.setDN(values[1]);

  return true;
  
});

