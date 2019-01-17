/*
The MIT License (MIT)

Copyright (c) 2014-2017 Bryan Hughes <bryan@nebri.us>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { CoreIO, IOptions as ICoreIOOptions } from 'core-io';
import {
  getPins, getBoardRevision,
  VERSION_3_MODEL_A_PLUS,
  VERSION_3_MODEL_B,
  VERSION_3_MODEL_B_PLUS,
  VERSION_1_MODEL_ZERO_W
} from 'raspi-board';
import { module as base } from 'raspi';
import { module as gpio } from 'raspi-gpio';
import { module as i2c } from 'raspi-i2c';
import { module as led } from 'raspi-led';
import { module as pwm } from 'raspi-soft-pwm';
import { module as serial, DEFAULT_PORT } from 'raspi-serial';

export interface IOptions {
  includePins?: Array<number | string>;
  excludePins?: Array<number | string>;
  enableSerial?: boolean;
}

module.exports = function RaspiIO({ includePins, excludePins, enableSerial }: IOptions = {}) {
  const options: ICoreIOOptions = {
    pluginName: 'Raspi IO',
    pinInfo: getPins(),
    platform: {
      base,
      gpio,
      i2c,
      led,
      pwm
    }
  };

  if (typeof enableSerial === 'undefined') {
    enableSerial =
      getBoardRevision() !== VERSION_3_MODEL_A_PLUS &&
      getBoardRevision() !== VERSION_3_MODEL_B_PLUS &&
      getBoardRevision() !== VERSION_3_MODEL_B &&
      getBoardRevision() !== VERSION_1_MODEL_ZERO_W;
  }
  if (enableSerial) {
    options.platform.serial = serial;
    options.serialIds = {
      DEFAULT: DEFAULT_PORT
    };
  }

  // TODO
  // if (Array.isArray(includePins)) {
  //   const newPinMappings = {};
  //   for (const pin of includePins) {
  //     const normalizedPin = this[raspiBoardModule].getPinNumber(pin);
  //     if (normalizedPin === null) {
  //       throw new Error(`Invalid pin "${pin}" specified in includePins`);
  //     }
  //     newPinMappings[normalizedPin] = pinMappings[normalizedPin];
  //   }
  //   pinMappings = newPinMappings;
  // } else if (Array.isArray(excludePins)) {
  //   pinMappings = Object.assign({}, pinMappings);
  //   for (const pin of excludePins) {
  //     const normalizedPin = this[raspiBoardModule].getPinNumber(pin);
  //     if (normalizedPin === null) {
  //       throw new Error(`Invalid pin "${pin}" specified in excludePins`);
  //     }
  //     delete pinMappings[normalizedPin];
  //   }
  // }

  return new CoreIO(options);
};
