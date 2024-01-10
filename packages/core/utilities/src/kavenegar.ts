import { stringify } from 'node:querystring';

import fetch from 'node-fetch';

import type { ParsedUrlQueryInput } from 'node:querystring';

export interface SendInterface extends ParsedUrlQueryInput {
  message: string;
  receptor: string;
  sender?: string;
}

export class KavenegarApi {
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  apiKey: string;
  host = 'api.kavenegar.com';
  version = 'v1';

  send(data: SendInterface) {
    return this._request('sms', 'send', data);
  }

  protected async _request(
    action: string,
    method: string,
    params: ParsedUrlQueryInput,
  ) {
    const path = `/${this.version}/${this.apiKey}/${action}/${method}.json`;
    const dataForPost = stringify(params);

    return await fetch(`https://${this.host}${path}`, {
      method: 'POST',
      headers: {
        'Content-Length': dataForPost.length.toString(),
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: dataForPost,
    }).then((response) => response.json());
  }
}

// const KavenegarApi = function (options) {
//   this.options = {};
//   this.options.host = 'api.kavenegar.com';
//   this.options.version = 'v1';
//   this.options.apikey = options.apikey;
// };
//
// KavenegarApi.prototype.request = function (action, method, params, callback) {
//   const path =
// '/' +
// this.options.version +
// '/' +
// this.options.apikey +
// '/' +
// action +
// '/' +
// method +
// '.json';
//   const postdata = querystring.stringify(params);
//   const post_options = {
// host: this.options.host,
// port: '443',
// path: path,
// method: 'POST',
// headers: {
//   'Content-Length': postdata.length,
//   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
// },
//   };
//   const req = https.request(post_options, function (e) {
// e.setEncoding('utf8');
// let result = '';
// e.on('data', function (data) {
//   result += data;
// });
// e.on('end', function () {
//   try {
// const jsonObject = JSON.parse(result);
// if (callback)
//   callback(
// jsonObject.entries,
// jsonObject.return.status,
// jsonObject.return.message,
//   );
//   } catch (e) {
// console.log('Exception!', e);
// if (callback) {
//   callback(e.message, 500);
// }
//   }
// });
//   });
//   req.write(postdata, 'utf8');
//   req.on('error', function (e) {
// if (callback)
//   callback(
// JSON.stringify({
//   error: e.message,
// }),
//   );
//   });
//   req.end();
// };
// KavenegarApi.prototype.Send = function (data, callback) {
//   this.request('sms', 'send', data, callback);
// };
//
