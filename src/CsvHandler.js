import Papa from "papaparse";
import * as Q from 'q';
export default class CsvHandler {
  constructor() {

  }

  /**
   * parse one line and try to guess the encoding
   * @param {*} file
   * @memberof CsvHandler
   */
  getPreview(file, encoding) {
    return new Promise((resolve, reject) => {
      const nbRow = 4;
      const data = [];
      Papa.parse(file, {
        encoding,
        preview: nbRow,
        skipEmptyLines: true,
        step(row) {
          data.push(row.data[0]);
          if (data.length >= nbRow) {
            resolve(data);
          }
        },
        error: reject
      });
    });
  }


  parse(file, encoding) {
    const deferred = Q.defer();
    Papa.parse(file, {
      encoding,
      skipEmptyLines: true,
      step(row) {
        deferred.notify(row.data);
      },
      complete() {
        deferred.resolve();
      },
      error: deferred.reject
    });
    return deferred.promise;
  }

}
