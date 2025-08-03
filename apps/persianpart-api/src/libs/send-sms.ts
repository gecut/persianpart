import { URLSearchParams } from 'url';

import fetch from 'node-fetch';

/**
 * Input type for sendSMS function
 */
export interface SendSMSParams {
  apikey: string;
  receptor: string;
  token: string;
  sender?: string; // optional sender line
}

/**
 * Output type for sendSMS function
 */
export interface KavenegarResponse {
  return: {
    status: number;
    message: string;
  };
  entries?: Array<{
    messageid: number;
    message: string;
    status: number;
    statustext: string;
    sender: string;
    receptor: string;
    date: number;
    cost: number;
  }>;
}

/**
 * Sends an SMS using Kavenegar API
 */
export const sendSMS = async ({
  apikey,
  receptor,
  token,
}: SendSMSParams): Promise<KavenegarResponse> => {
  const url = `http://api.kavenegar.com/v1/${apikey}/verify/lookup.json`;

  const res = await fetch(url, {
    method: 'POST',
    body: new URLSearchParams({
      receptor,
      token,
      template: 'persianpart-new-order',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP Error ${res.status}: ${text}`);
  }

  const json: KavenegarResponse = (await res.json()) as KavenegarResponse;

  if (json.return.status !== 200) {
    throw new Error(
      `Kavenegar Error ${json.return.status}: ${json.return.message}`,
    );
  }

  return json;
};
