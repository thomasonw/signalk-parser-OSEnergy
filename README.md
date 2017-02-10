# signalk-parser-OSEenergy


A Node.js [stream.Transform](https://nodejs.org/api/stream.html#stream_class_stream_transform) which converts [OSEnergy](https://github.com/OSEnergy/OSEnergy) sentences into Signal K delta messages.

## Supported Products
http://arduinoalternatorregulator.blogspot.com/




## LIMITATION
At this time, only a single instance of the parser may be executed.  There are global variables used to retain the battery ID and device name.  This is because I am very limited in Javascript skills:   ==***If anyone is able to provide insight, or a push, on how to solve this please do!***==

see variables ```deviceName``` and ```associatedBus``` in file ```./lib/index.js```

t.b.d: Test subdirectory need to be created. 


## Installation and Use

```
$ git clone https://github.com/thomasonw/signalk-parser-OSEnergy.git
$ cd signalk-parser-OSEnergy
$ npm install
$ echo 'AST;,0.84, ,14.31,0.0,0.0,0, ,13.34,1000,15000,10, ,80,95, ,0, ,14.31,-99,-99,0' | ./bin/OSEnergy-signalk
```

Should return something like this:

```
{
  "self": "B270F85A",
  "version": "1",
  "vessels": {
    "B270F85A": {
      "uuid": "B270F85A",
      "electrical": {
        "alternator": {
          "dcQualities": {
            "voltage": {
              "value": 14.31,
              "source": {
                "type": "OSEnergy",
                "sentence": "AST",
                "label": "signalk-parser-OSEnergy",
                "talker": "???"
              },
              "timestamp": "2017-02-10T20:53:40.000Z"
            },
            "current": {
              "value": 0,
              "source": {
                "type": "OSEnergy",
                "sentence": "AST",
                "label": "signalk-parser-OSEnergy",
                "talker": "???"
              },
              "timestamp": "2017-02-10T20:53:40.000Z"
            },
            "temperature": {
              "value": 308.15000000000003,
              "source": {
                "type": "OSEnergy",
                "sentence": "AST",
                "label": "signalk-parser-OSEnergy",
                "talker": "???"
              },
              "timestamp": "2017-02-10T20:53:40.000Z"
            }
          },
          "fieldDrive": {
            "value": 0,
            "source": {
              "type": "OSEnergy",
              "sentence": "AST",
              "label": "signalk-parser-OSEnergy",
              "talker": "???"
            },
            "timestamp": "2017-02-10T20:53:40.000Z"
          }
        },
        "batteries": {
          "0": {
            "dcQualities": {
              "voltage": {
                "value": 14.31,
                "source": {
                  "type": "OSEnergy",
                  "sentence": "AST",
                  "label": "signalk-parser-OSEnergy",
                  "talker": "???"
                },
                "timestamp": "2017-02-10T20:53:40.000Z"
              }
            }
          }
        }
      }
    }
  }
}
```

You can also pipe a file into the parser CLI:

```
$ cat some-file.log | ./bin/OSEnergy-signalk
```

## Use as a Node Module

See https://github.com/thomasonw/OSEnergy-signalk/blob/master/signalk-support/signalk-server-node/providers/OSEnergy-signalk.js  for an example in a Node application.
