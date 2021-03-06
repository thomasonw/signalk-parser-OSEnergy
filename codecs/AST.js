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
 * AST codec
 * 
 * @repository 			https://github.com/thomasonw/signalk-parser-OSEnergy
 * @author 			Al Thomason <thomason.al@gmail.com>
 *
 */

"use strict";

/*
ALTERNATOR STATUS --   AST;
“AST;, Hours,    , BatVolts, AltAmps, BatAmps, SystemWatts,   ,TargetVolts, TargetAmps, TargetWatts, AltState,   ,BTemp, ATemp,   ,RPMs,   , AltVolts, FTemp, FAmps, FLD%”

ALTERNATOR STATUS --   AST;
    AST;
0       N  Hours
1       -  <blank>
2       N   BatVolts
3       N   AltAmps
4       N   BatAmps
5       N   SystemWatts
6       -   <blank>
7       N   TargetVolts
8       N   TargetAmps
9       N   TargetWatts
10      N   AltState
11      -   <blank>
12      N   BTemp
13      N   ATemp
14      -   <blannk>
15      N   RPMs
16      -   <blank>
17      N   AltVolts
18      N   FETTemp
19      N   FieldAmps
20      N   Field%
*/



var Codec = require('../lib/OSEnergy');
 
module.exports = new Codec('AST', function(multiplexer, input) {
  var values = input.values;

  multiplexer.self();
  
  var pathValues = []
  pathValues.push({
    "path": "electrical.alternator.voltage",
    "value": this.float(values[17])
  })
  
  pathValues.push({
    "path": "electrical.alternator.current",
    "value": this.float(values[3])
  })
  
  switch (this.int(values[10])) {
      case 5:
      case 6:
      case 7:  
            pathValues.push({
                "path": "electrical.alternator.mode",
                "value": "charging bulk"  
            })
            break;
            
      case 8:  
            pathValues.push({
                "path": "electrical.alternator.mode",
                "value": "charging acceptance" 
            })
            break;
            
      case 9:  
            pathValues.push({
                "path": "electrical.alternator.mode",
                "value": "charging overcharge" 
            })
            break;            
      
      case 10:
      case 11:
            pathValues.push({
                "path": "electrical.alternator.mode",
                "value": "charging float"  
            })
            break;

                        
      case 13:  
            pathValues.push({
                "path": "electrical.alternator.mode",
                "value": "charging equalize" 
            })
            break;            
  
      case 12:
      case 14:
            pathValues.push({
                "path": "electrical.alternator.mode",
                "value": "other"  
            })
            break;

       default:
            pathValues.push({
                "path": "electrical.alternator.mode",
                "value": "unknown"  
            })
            break;             
  }
  
  
  
  if (this.int(values[13]) != -99) {
      pathValues.push({
        "path": "electrical.alternator.temperature",
        "value": this.transform(this.float(values[13]),'c','k')  
    })
  }
  
  
  if (multiplexer.pullyRatio != null) {
      pathValues.push({
        "path": "electrical.alternator.revolutions",
        "value": this.int(values[15]) * multiplexer.pullyRatio  / 60.0 
    })   
      
  }
  
  
  if (this.int(values[18]) != -99) {
      pathValues.push({
        "path": "electrical.alternator.regulatorTemperature",
        "value":  this.transform(this.float(values[18]),'c','k') 
    })
  }
  
  pathValues.push({
    "path": "electrical.batteries."+multiplexer.associatedBus+".voltage",
    "value": this.float(values[2])
  })
  
  pathValues.push({
    "path": "electrical.alternator.fieldDrive",
    "value": this.int(values[20])
  })
  

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
