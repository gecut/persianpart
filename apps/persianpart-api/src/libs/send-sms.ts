import { URLSearchParams } from 'url';

import fetch from 'node-fetch';

/**
 * Input type for sendSMS function
 */
export interface SendSMSParams {
  apikey: string;
  receptor: string | string[]; // can send to multiple numbers
  message: string;
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
  message,
  sender,
}: SendSMSParams): Promise<KavenegarResponse> => {
  const url = `https://api.kavenegar.com/v1/${apikey}/sms/send.json`;

  const params = new URLSearchParams();
  params.append(
    'receptor',
    Array.isArray(receptor) ? receptor.join(',') : receptor,
  );
  params.append('message', message);
  if (sender) params.append('sender', sender);

  const res = await fetch(url, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
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
