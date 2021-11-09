import { createTwitterHandle } from '../utils/twitterHandle';

const emoji = '😀😃😄😂';

const inputs = [
	'http://www.twitter.com/AidenMontgomery',
	'https://www.twitter.com/AidenMontgomery',
	'http://twitter.com/AidenMontgomery',
	'https://twitter.com/AidenMontgomery',
	'http://www.twitter.com/AidenMontgomery/',
	'http://www.twitter.com/AidenMontgomery?test=fail',
	'http://www.twitter.com/AidenMontgomery?test=fail?test=fail?test=fail?test=fail',
	'@AidenMontgomery',
	'AidenMontgomery',
	' AidenMontgomery ',
	' AidenMontgomery',
	'AidenMontgomery ',
	'http:/www.twitter.com/AidenMontgomery',
	'htp://www.twitter.com/AidenMontgomery',
	'//www.twitter.com/AidenMontgomery',
	'ftp://www.twitter.com/AidenMontgomery',
	'http:\\\\www.twitter.com/AidenMontgomery',
	'http://www.twitter.com/Aiden Montgomery',
	'@Aiden Montgomery',
	'http://www.twitter.com/' + emoji,
	'@😀😃😄😂',
	'😀😃😄😂',
];

inputs.forEach(u => {
  const twitterHandleResult = createTwitterHandle(u);
  if (twitterHandleResult.isValid) {
    console.log('Success', twitterHandleResult);
  }
  else {
    console.error('Invalid Handle', u);
  }
});
