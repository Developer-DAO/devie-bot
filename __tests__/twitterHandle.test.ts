import { createTwitterHandle } from '../utils/twitterHandle';

const emoji = '😀😃😄😂';

const inputs = [
	{ input: 'http://www.twitter.com/AidenMontgomery', shouldBeValid: true },
	{ input: 'https://www.twitter.com/AidenMontgomery', shouldBeValid: true },
	{ input: 'http://twitter.com/AidenMontgomery', shouldBeValid: true },
	{ input: 'https://twitter.com/AidenMontgomery', shouldBeValid: true },
	{ input: 'http://www.twitter.com/AidenMontgomery/', shouldBeValid: true },
	{ input: 'http://www.twitter.com/AidenMontgomery?test=fail', shouldBeValid: true },
	{ input: 'http://www.twitter.com/AidenMontgomery?test=fail?test=fail?test=fail?test=fail', shouldBeValid: true },
	{ input: '@AidenMontgomery', shouldBeValid: true },
	{ input: 'AidenMontgomery', shouldBeValid: true },
	{ input: ' AidenMontgomery ', shouldBeValid: true },
	{ input: ' AidenMontgomery', shouldBeValid: true },
	{ input: 'AidenMontgomery ', shouldBeValid: true },
	{ input: 'http:/www.twitter.com/AidenMontgomery', shouldBeValid: true },
	{ input: 'htp://www.twitter.com/AidenMontgomery', shouldBeValid: true },
	{ input: '//www.twitter.com/AidenMontgomery', shouldBeValid: true },
	{ input: 'ftp://www.twitter.com/AidenMontgomery', shouldBeValid: true },
	{ input: 'http:\\\\www.twitter.com/AidenMontgomery', shouldBeValid: true },
	{ input: 'http://www.twitter.com/Aiden Montgomery', shouldBeValid: true },
	{ input: '@Aiden Montgomery', shouldBeValid: true },
	{ input: 'http://www.twitter.com/' + emoji, shouldBeValid: false },
	{ input: '@😀😃😄😂', shouldBeValid: false },
	{ input: '😀😃😄😂', shouldBeValid: false },
];

describe('Twitter handle', () => {
	test.each(inputs)('$input', ({ input, shouldBeValid }) => {
		const twitterHandleResult = createTwitterHandle(input);
		expect(twitterHandleResult.isValid).toEqual(shouldBeValid);
	});
});
