// Twitter handles can only have ascii alphanumeric character and are limited to a length of 15

import { UTwitterHandleResponse } from '../types';

// Handles _used_ to be limited to 20 characters, so there may be some out there that are that long
function validTwitterUser(username: string): boolean {
	return /^[a-zA-Z0-9_]{1,20}$/.test(username);
}

function buildTwitterURL(handle: string): string {
  return `https://www.twitter.com/${handle}`;
}

/**
 * Attempts to extract a twitter handle from the input
 *
 * @param   {string}  handle  The value received as user input
 *
 * @return  {string}          The result of cleaning the input
 */
function sanitiseTwitterHandle(handle: string): string {
  let clean = handle.trim();
  // Remove any trailing '/'s
  if (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  // Remove any URL Parameters
  while (clean.lastIndexOf('?') > 0) {
    clean = clean.slice(0, clean.lastIndexOf('?'));
  }

  // Remove everyhing part from the last part of the URL
  if (clean.lastIndexOf('/') > 0) {
    clean = clean.slice(clean.lastIndexOf('/') + 1);
  }

  // Remove any characters remaining that are not valid in a twitter handle (including the '@')
  return clean.replace(/\W/g, '');
}

/**
 * Attempts to create a twitter handle and twitter URL from the provided input
 *
 * @example
 * createTwitterHandle('Developer_DAO');
 * // return { isValid: true, handle: 'Developer_DAO', URL: 'https://www.twitter.com/Developer_DAO }
 * @example
 * createTwitterHandle('@Developer_DAO');
 * // return { isValid: true, handle: 'Developer_DAO', URL: 'https://www.twitter.com/Developer_DAO }
 * @example
 * createTwitterHandle('http://www.twitter.com/Developer_DAO');
 * // return { isValid: true, handle: 'Developer_DAO', URL: 'https://www.twitter.com/Developer_DAO }
 * @example
 * createTwitterHandle('this is really long and isnt a valid handle');
 * // return { isValid: false }
 * @param   {string}                       input  This should be either a full twitter URL e.g. https://www.twitter.com/Developer_DAO or a valid twitter handle e.g. Developer_DAO or @Developer_DAO
 * @return  {UTwitterHandleResponse}         When valid inputs are entered returns isValid = true along with the handle and the URL for the twitter account.
 */
export function createTwitterHandle(input: string): UTwitterHandleResponse {
  const cleanHandle = sanitiseTwitterHandle(input);
  const validHandle = validTwitterUser(cleanHandle);
  if (validHandle) {
    const twitterUrl = buildTwitterURL(cleanHandle);
    return { isValid: true, handle: cleanHandle, URL: twitterUrl };
  }
  else {
    console.error('Invalid Handle', { original: input, cleaned: cleanHandle });
    return { isValid: false };
  }
}
