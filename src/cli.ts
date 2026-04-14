import * as readline from "node:readline";
import type { Repo } from "./github";

export async function pickRepo(repos: Repo[]): Promise<Repo> {
	console.log("\nSearch results:\n");
	for (let i = 0; i < repos.length; i++) {
		const r = repos[i];
		console.log(
			`  ${i + 1}. ${r.full_name} — ⭐ ${r.stargazers_count} — ${r.description ?? "(no description)"}`,
		);
	}
	console.log();

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const selected = await new Promise<Repo>((resolve, reject) => {
		const ask = () => {
			rl.question(`Enter number (1-${repos.length}): `, (answer) => {
				const num = Number.parseInt(answer, 10);
				if (num >= 1 && num <= repos.length) {
					resolve(repos[num - 1]);
				} else {
					console.log(
						`Invalid choice. Please enter a number between 1 and ${repos.length}.`,
					);
					ask();
				}
			});
		};
		rl.on("close", () => reject(new Error("Input closed before selection")));
		ask();
	});

	rl.close();
	return selected;
}
