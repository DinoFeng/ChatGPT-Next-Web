import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BOT_HELLO } from "./chat";

export interface AzureAccessControlStore {
  accessCode: string;
  token: string;

  needCode: boolean;
  hideUserApiKey: boolean;
  openaiUrl: string;

  updateToken: (_: string) => void;
  updateCode: (_: string) => void;
  enabledAccessControl: () => boolean;
  isAuthorized: () => boolean;
  fetch: () => void;

  sourceName: string;
  deploymentId: string;
  apiVersion: string;

  isAdvanced: boolean;
  defaultAccessCode: string;

  getAzureConfig: () => string;
  updateSourceName: (_: string) => void;
  updateDeploymentId: (_: string) => void;
  updateApiVersion: (_: string) => void;

  enabledAdvancedControl: () => boolean;
  getAccessCode: () => string;
}

export const AZURE_ACCESS_KEY = "azure-access-control";
let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const useAzureAccessStore = create<AzureAccessControlStore>()(
  persist(
    (set, get) => ({
      token: "",
      accessCode: "",
      needCode: true,
      hideUserApiKey: false,
      openaiUrl: "/api/openai/",

      sourceName: "",
      deploymentId: "",
      apiVersion: "",

      isAdvanced: false,
      defaultAccessCode: "",

      enabledAccessControl() {
        get().fetch();

        return get().needCode;
      },
      updateCode(code: string) {
        set(() => ({ accessCode: code }));
      },
      updateToken(token: string) {
        set(() => ({ token }));
      },
      isAuthorized() {
        get().fetch();
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

            if ((res as any).botHello) {
              BOT_HELLO.content = (res as any).botHello;
            }
          })
          .catch(() => {
            console.error("[Config] failed to fetch config");
          })
          .finally(() => {
            fetchState = 2;
          });
      },

      getAzureConfig() {
        return JSON.stringify({
          apiKey: get().token,
          sourceName: get().sourceName,
          deploymentId: get().deploymentId,
          apiVersion: get().apiVersion,
        });
      },
      updateSourceName(sourceName: string) {
        set((state) => ({ sourceName }));
      },
      updateDeploymentId(deploymentId: string) {
        set((state) => ({ deploymentId }));
      },
      updateApiVersion(apiVersion: string) {
        set((state) => ({ apiVersion }));
      },
      enabledAdvancedControl() {
        get().fetch();
        return get().isAdvanced;
      },
      getAccessCode() {
        get().fetch();
        return get().accessCode || get().defaultAccessCode;
      },
    }),
    {
      name: AZURE_ACCESS_KEY,
      version: 1,
    },
  ),
);
