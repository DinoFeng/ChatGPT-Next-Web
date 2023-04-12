import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AccessControlStore {
  accessCode: string;
  token: string;

  needCode: boolean;
  isAdvanced: boolean;
  defaultAccessCode: string;

  enabledAdvancedControl: () => boolean;
  getAccessCode: () => string;
  updateToken: (_: string) => void;
  updateCode: (_: string) => void;
  enabledAccessControl: () => boolean;
  isAuthorized: () => boolean;
  fetch: () => void;
}

export const ACCESS_KEY = "access-control";

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({
      accessCode: "",
      token: "",
      needCode: true,
      isAdvanced: true,
      defaultAccessCode: "",

      enabledAdvancedControl() {
        get().fetch();
        return get().isAdvanced;
      },
      getAccessCode() {
        get().fetch();
        return get().accessCode || get().defaultAccessCode;
      },
      enabledAccessControl() {
        get().fetch();

        return get().needCode;
      },
      updateCode(code: string) {
        set((state) => ({ accessCode: code }));
      },
      updateToken(token: string) {
        set((state) => ({ token }));
      },
      isAuthorized() {
        // has token or has code or disabled access control
        return (
          !!get().token ||
          !!get().getAccessCode() ||
          !get().enabledAccessControl()
        );
      },
      fetch() {
        if (fetchState > 0) return;
        fetchState = 1;
        fetch("/api/config", {
          method: "post",
          body: null,
        })
          .then((res) => res.json())
          .then((res: DangerConfig) => {
            console.log("[Config] got config from server", res);
            set(() => ({ ...res }));
          })
          .catch((e) => {
            console.error("[Config] failed to fetch config", e);
          })
          .finally(() => {
            fetchState = 2;
          });
      },
    }),
    {
      name: ACCESS_KEY,
      version: 1,
    },
  ),
);
