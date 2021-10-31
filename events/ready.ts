export const name = 'ready';
export const once = true;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function execute(client: any) {
	console.log(`Ready! Logged in as ${client.user.tag}`);
}