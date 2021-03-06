/*
 * index.js
 *
 * @description 	Reads codec directory and adds the codecs to an object.
 * @repository 		https://github.com/thomasonw/signalk-parser-OSEnergy
 * @author 		Al Thomason <thomason.al@gmail.com>
 *
 *
 *
 * Copyright 2017, William (Al) Thomson
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
 *
 */

var codecs = {
  AST: require('./AST'),
  CST: require('./CST'),
  NPC: require('./NPC'),
  SCV: require('./SCV'),
  };

module.exports = codecs;
