export function isAdvanced(): boolean {
  const v = process.env.IS_ADVANCED ?? "false";
  const r = ["true", "1", "t", "y"].includes(v.toLowerCase());
  // console.debug({ r })
  return r;
}
export function getAccessCode(): string {
  const code = process.env.CODE;
  const codes = code?.split(",") ?? [];
  return isAdvanced() ? "" : codes[0];
}
export const IS_ADVANCED = isAdvanced();
export const DEF_ACCESS_CODE = getAccessCode();
