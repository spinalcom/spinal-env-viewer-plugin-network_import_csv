/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
// import {TypedArray_Float64} from 'spinal-core-connectorjs_type';
import {
  SpinalBmsDevice,
  SpinalBmsEndpoint
} from 'spinal-model-bmsnetwork';
import {SpinalServiceTimeseries} from 'spinal-model-timeseries';
import {
  SPINAL_RELATION_TYPE,
  SpinalGraphService
} from 'spinal-env-viewer-graph-service';
import moment from 'moment';
import {parseDateUTC} from '../datePatern.js';
import spinalCore, {FileSystem} from 'spinal-core-connectorjs_type';
const spinalServiceTimeseries = new SpinalServiceTimeseries();
const q = require('q');

export default class CsvDataHandler {
  constructor(encoding, decimalPatern, datePatern) {
    this.dictionary = new Map();
    this.encoding = encoding;
    this.decimalPatern = decimalPatern;
    this.datePatern = datePatern;
    this.dates = [];
    this.objCreated = new Set();
  }

  onData(data, count) {
    switch (count) {
      case 0:
        return Promise.resolve();
      case 1:
        return this.handleHeaderName(data);
      case 2:
        return this.handleHeaderUnit(data);
      default:
        return this.handleData(data);
    }
  }
  consumeDataParsed(subNetworkId, contextId, outputDeviceName) {
    let deferred = q.defer();
    this.createOrGetDevice(subNetworkId, contextId, outputDeviceName).then(
      async (device) => {
        const deviceChildren = await SpinalGraphService.getChildrenInContext(
          device.id.get(), contextId);

        let idx = 0;
        for (const [, endpointData] of this.dictionary) {
          // eslint-disable-next-line no-await-in-loop
          const endpoint = await this.getOrCreateEndpoint(
            deviceChildren, endpointData, device, contextId);
          // eslint-disable-next-line no-await-in-loop
          await this.updateEndpointDevice(endpoint, endpointData, this.dates);
          idx += 1;
          // eslint-disable-next-line no-await-in-loop
          await this.waitHubConsumeData();
          const completion = idx / this.dictionary.size;
          deferred.notify(completion);
        }
        deferred.resolve();
      });
    return deferred.promise;
  }

  waitHubConsumeData() {
    return new Promise((resolve) => {
      const __loop = () => {
        const tmp = FileSystem._tmp_objects;
        for (const key in tmp) {
          if (tmp.hasOwnProperty(key)) {
            const element = tmp[key];
            if (element instanceof spinalCore._def[
              'SpinalTimeSeriesArchiveDay']) {
              setTimeout(() => {
                __loop();
              }, 200);
              return;
            }
          }
        }
        resolve();
      };
      setTimeout(() => {
        __loop();
      }, 300);
    });
  }

  updateEndpointDevice(endpoint, endpointData, dates) {
    const prom = [];
    const timeseries = endpointData.timeseries;

    for (let index = 0; index < timeseries.length; index++) {
      const value = timeseries[index];
      const date = moment.utc(dates[index]).toDate();
      prom.push(spinalServiceTimeseries.insertFromEndpoint(endpoint.id.get(),
        value,
        date));
    }
    return Promise.all(prom);
  }

  async getOrCreateEndpoint(deviceChildren, element, device, contextId) {
    // create or get endpoint
    for (let idx = 0; idx < deviceChildren.length; idx++) {
      const deviceChild = deviceChildren[idx];
      if (deviceChild.name.get() === element.name) {
        return deviceChild;
      }
    }
    const timeseries = element.timeseries;
    const res = new SpinalBmsEndpoint(element.name, '', timeseries[timeseries
      .length - 1], element.unit, element.dataType, element.type);
    const tmpInfo = {
      type: SpinalBmsEndpoint.nodeTypeName,
      name: element.name,
      idNetwork: res.id.get()
    };
    const childId = SpinalGraphService.createNode(tmpInfo, res);
    await SpinalGraphService.addChildInContext(
      device.id.get(),
      childId,
      contextId,
      SpinalBmsEndpoint.relationName,
      SPINAL_RELATION_TYPE,
    );
    this.objCreated.add(res);
    return SpinalGraphService.getInfo(childId);
  }

  async createOrGetDevice(subNetworkId, contextId, deviceName) {
    const children = await SpinalGraphService.getChildrenInContext(
      subNetworkId, contextId);
    // search child device
    for (let index = 0; index < children.length; index++) {
      const element = children[index];
      // if exist return it
      if (deviceName === element.name.get()) {
        return element;
      }
    }
    // if not exist create then return it
    const res = new SpinalBmsDevice(deviceName);
    const tmpInfo = {
      type: SpinalBmsDevice.nodeTypeName,
      name: deviceName,
      idNetwork: res.id.get()
    };
    const childId = SpinalGraphService.createNode(tmpInfo, res);
    await SpinalGraphService.addChildInContext(
      subNetworkId,
      childId,
      contextId,
      SpinalBmsDevice.relationName,
      SPINAL_RELATION_TYPE,
    );
    this.objCreated.add(res);
    return SpinalGraphService.getInfo(childId);
  }


  handleHeaderName(data) {
    for (let index = 2; index < data.length; index++) {
      const element = data[index];
      this.dictionary.set(index, {
        name: element,
        dataType: '',
        timeseries: []
      });
    }
  }

  guessType(name, unit) {
    if (/Hygro/i.exec(name) !== null) return 'Hygrometry';
    switch (unit) {
      case '°C':
        return 'Temperature';
      case 'W':
        return 'Power';
      case 'kWh':
        return 'Power';
      default:
        return 'Other';
    }
  }
  handleHeaderUnit(data) {
    for (let index = 2; index < data.length; index++) {
      const element = data[index];
      const tmp = this.dictionary.get(index);
      tmp.unit = element;
      tmp.type = this.guessType(data.name, element);
    }
  }
  handleData(data) {
    const date = parseDateUTC(`${data[0]} ${data[1]}`, this.datePatern);
    if (date === 'Invalid date') {
      console.error(`${data[0]} ${data[1]} is not a valid date.`);
    }
    this.dates.push(date);
    for (let index = 2; index < data.length; index++) {
      let element;
      if (this.decimalPatern === 'comma') {
        element = parseFloat(data[index].replace(',', '.'));
      } else {
        element = parseFloat(data[index]);
      }
      element = Number.isNaN(element) ? data[index] : element;
      const tmp = this.dictionary.get(index);
      tmp.timeseries.push(element);
      if (tmp.dataType === '') {
        switch (true) {
          case Number.isInteger(element):
            tmp.dataType = 'Integer';
            break;
          case typeof element === 'number' && !Number.isInteger(element):
            tmp.dataType = 'Double';
            break;
          default:
            tmp.dataType = 'String';
            break;
        }
      }
    }
  }
}
