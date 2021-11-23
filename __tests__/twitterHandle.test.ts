import { createTwitterHandle } from '../utils/twitterHandle';

const emoji = '😀😃😄😂';

const inputs = [
	{ input: 'http://www.twitter.com/Developer_DAO', shouldBeValid: true },
	{ input: 'https://www.twitter.com/Developer_DAO', shouldBeValid: true },
	{ input: 'http://twitter.com/Developer_DAO', shouldBeValid: true },
	{ input: 'https://twitter.com/Developer_DAO', shouldBeValid: true },
	{ input: 'http://www.twitter.com/Developer_DAO/', shouldBeValid: true },
	{ input: 'http://www.twitter.com/Developer_DAO?test=fail', shouldBeValid: true },
	{ input: 'http://www.twitter.com/Developer_DAO?test=fail?test=fail?test=fail?test=fail', shouldBeValid: true },
	{ input: '@Developer_DAO', shouldBeValid: true },
	{ input: 'Developer_DAO', shouldBeValid: true },
	{ input: ' Developer_DAO ', shouldBeValid: true },
	{ input: ' Developer_DAO', shouldBeValid: true },
	{ input: 'Developer_DAO ', shouldBeValid: true },
	{ input: 'http:/www.twitter.com/Developer_DAO', shouldBeValid: true },
	{ input: 'htp://www.twitter.com/Developer_DAO', shouldBeValid: true },
	{ input: '//www.twitter.com/Developer_DAO', shouldBeValid: true },
	{ input: 'ftp://www.twitter.com/Developer_DAO', shouldBeValid: true },
	{ input: 'http:\\\\www.twitter.com/Developer_DAO', shouldBeValid: true },
	{ input: 'http://www.twitter.com/Developer _DAO', shouldBeValid: true },
	{ input: '@Developer _DAO', shouldBeValid: true },
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
