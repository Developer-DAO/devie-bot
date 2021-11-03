export function isValidUrl(userInput: string) {
    let url_string;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      url_string = new URL(userInput);
    }
    catch (_) {
      return false;
    }
    return url_string.protocol === 'http:' || url_string.protocol === 'https:';
  }