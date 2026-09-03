/** `https://keyflow.fasttrackstudio.app/` → `keyflow.fasttrackstudio.app`. */
export function hostOf(url: string): string {
	return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
