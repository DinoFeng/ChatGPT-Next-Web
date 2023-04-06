import { create } from "zustand";
import { persist } from "zustand/middleware";
import { queryMeta } from "../utils";

export interface AccessControlStore {
  accessCode: string;
  token: string;

  updateToken: (_: string) => void;
  updateCode: (_: string) => void;
  enabledAccessControl: () => boolean;
  enabledAdvancedControl: () => boolean;
  getAccessCode: () => string;
}

export const ACCESS_KEY = "access-control";

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({
      token: "",
      accessCode: "",
      enabledAccessControl() {
        return queryMeta("access") === "enabled";
      },
      updateCode(code: string) {
        set((state) => ({ accessCode: code }));
      },
      updateToken(token: string) {
        set((state) => ({ token }));
      },
      enabledAdvancedControl() {
        return queryMeta("isAdvanced") === "true";
      },
      getAccessCode() {
        const defaultAccessCode = !this.enabledAdvancedControl()
          ? queryMeta("accessCode")
          : "";
        return this.accessCode || defaultAccessCode;
      },
    }),
    {
      name: ACCESS_KEY,
      version: 1,
    },
  ),
);
