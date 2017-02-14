# signalk-parser-OSEenergy


A Node.js [stream.Transform](https://nodejs.org/api/stream.html#stream_class_stream_transform) which converts [OSEnergy](https://github.com/OSEnergy/OSEnergy) sentences into Signal K delta messages.

## Supported Products
http://arduinoalternatorregulator.blogspot.com/




## LIMITATION

t.b.d: Test subdirectory needs to be created. 


## Installation and Use

Open a termainal in the approperate directory (e.g.: ```cd ~/signalk-server-node/node_modules```) and then:

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

To install several  support files used in Signal-k (and some examples), do the following:
```
$ cp  -R -f -v signalk-support/signalk-server-node  ../../..
$ cd ~/signalk-server-node
$ ./bin/osenergy-from-file
```
(You may have to set the executable permission flag 1st, ```chmod 755 ./bin/osenergy-from-file```  - until I can figure out the workaround for a Github/windows permission issue)



## Use as a Node Module

See https://github.com/thomasonw/OSEnergy-signalk/blob/master/signalk-support/signalk-server-node/providers/OSEnergy-signalk.js  for an example in a Node application.


