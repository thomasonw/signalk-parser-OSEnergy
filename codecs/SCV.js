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
 * SCV codec
 * 
 * @repository 			https://github.com/thomasonw/signalk-parser-OSEnergy
 * @author 			Al Thomason <thomason.al@gmail.com>
 *
 */

"use strict";

/*
SYSTEM CONFIG –- SCV;
"SCV;, Lockout, fav32V?, RevAmp, SvOvr, BcOvr, CpOvr,   ,AltTempSet, drtNORM, drtSMALL, drtHALF, PBF,      ,Amp Limit, Watt Limit,  , Alt Poles, Drive Ratio, Shunt Ratio,   ,IdleRPM, TachMinField:”

SYSTEM CONFIG –- SCV;
    SCV;
0       N   Lockout
1       N   Fav32V?
2       N   RevAmp
3       N   SvOvr
4       N   BcOvr
5       N   CpOvr
6       -   <blank>
7       N   AltTempSet
8       N   drtNORM
9       N   drtSMALL
10      N   drtHALF
11      N   PBF
12      -   <blank>
13      N   Amp Limit
14      N   Watt Limit
15      -   <blank>
16      N   Alt Poles
17      N   Drive Ratio
18      N   Shunt Ratio
19      N   IdleRPM
20      N   TachMinField
*/



var Codec = require('../lib/OSEnergy');
 
module.exports = new Codec('SCV', function(multiplexer, input) {
  var values = input.values;

  multiplexer.self();
  
  var pathValues = []
  pathValues.push({
    "path": "electrical.alternator.pulleyRatio",
    "value": this.float(values[17])
  })
  
  multiplexer.pullyRatio = this.float(values[17]);


  if (pathValues.length > 0) {
    multiplexer.add({
      "updates": [{
        "source": this.source(input.instrument),
        "timestamp": this.timestamp(),
        "values": pathValues
      }],
      "context": multiplexer._context
    });
  }
  return true;
  
});

