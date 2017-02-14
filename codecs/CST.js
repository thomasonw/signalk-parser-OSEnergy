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
CAN  STATUS  --  CST; 
“CST;, BatteryID, IDOverride, Instance, Priority,      ,Enable NMEA2000?, Enable OSE?,    ,AllowRBM?,IsRBM, ShuntAtBat?,     ,RBM ID, IgnoringRBM?,Enable_NMEA2000-RAT?,   ,CAN_ID”


CAN STATUS --   CST;

    CST;
0       N  BatteryID 
1       N  IDOverride 
2       N  Instance 
3       N  Priority
4       -  <blank>
5       N  Enable NMEA2000?
6       N  Enable OSE?
7       -  <blank>
8       N  AllowRBM?
9       N  IsRBM 
10      N  ShuntAtBat?
11      -  <blank>
12      N  RBM ID
13      N  IgnoringRBM?
14      N  Enable_NMEA2000-RAT?
15      -  <blank>
16      N  CAN_ID

*/



var Codec = require('../lib/OSEnergy');

 
module.exports = new Codec('CST', function(multiplexer, input) {
  var values = input.values;

  multiplexer.associatedBus = values[0]

  return true;
  
});

