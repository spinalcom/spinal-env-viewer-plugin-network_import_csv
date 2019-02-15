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

import moment from 'moment';

const dayPaterns = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY/MM/DD",
  "YYYY/DD/MM"
];

const hoursPaterns = [
  "HH/mm/ss",
  "hh/mm/ss a"
];

const datePaterns = [];
for (let index = 0; index < dayPaterns.length; index++) {
  const datePatern = dayPaterns[index];
  for (let idx = 0; idx < hoursPaterns.length; idx++) {
    const hoursPatern = hoursPaterns[idx];
    datePaterns.push(`${datePatern} ${hoursPatern}`);
  }
}

export function parseDate(str, patern = datePaterns) {
  const test = moment.utc(str, patern);
  return test.format('ll LTS');
}

export function parseDateUTC(str, patern = datePaterns) {
  const test = moment.utc(str, patern);
  return test.format();
}


export {
  datePaterns
};
