export function isAdvanced(): boolean {
  const v = process.env.IS_ADVANCED ?? "false";
  const isAdvanced = ["true", "1", "t", "y"].includes(v.toLowerCase());
  // console.debug({ isAdvanced })
  return isAdvanced;
}
export function getAccessCode(): string {
  const code = process.env.CODE;
  const codes = code?.split(",") ?? [];
  const defCode = isAdvanced() ? "" : codes[0];
  // console.debug({ defCode })
  return defCode;
}
export const IS_ADVANCED = isAdvanced();
export const DEF_ACCESS_CODE = getAccessCode();
