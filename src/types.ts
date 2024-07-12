import { Endpoints } from '@octokit/types';

export type GithubReleaseResponse =
	Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'];
