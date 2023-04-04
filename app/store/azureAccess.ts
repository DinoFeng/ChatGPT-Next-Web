import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAccessStore } from "./access";
// import { queryMeta } from "../utils";

export interface AzureAccessControlStore {
  apiKey: string;
  sourceName: string;
  deploymentId: string;
  apiVersion: string;
  isDefault: boolean;
  getAzureConfig: () => string;
  // isAdvanced: () => boolean;
  setDefaultAccess: (_: boolean) => void;
  updateSourceName: (_: string) => void;
  updateDeploymentId: (_: string) => void;
  updateApiVersion: (_: string) => void;
  updateApiKey: (_: string) => void;
}

export const AZURE_ACCESS_KEY = "azure-access-control";

export const useAzureAccessStore = create<AzureAccessControlStore>()(
  persist(
    (set, get) => ({
      isDefault: true,
      apiKey: "",
      sourceName: "",
      deploymentId: "",
      apiVersion: "",
      getAzureConfig() {
        if (this.isDefault) {
          return JSON.stringify({
            apiKey: this.apiKey,
            sourceName: this.sourceName,
            deploymentId: this.deploymentId,
            apiVersion: this.apiVersion,
            useAzure: this.isDefault,
          });
        } else {
          return "";
        }
      },

      // isAdvanced() {
      //   return queryMeta("isAdvanced") === "true";
      // },
      setDefaultAccess(val: boolean) {
        set((state) => ({ isDefault: val }));
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
      updateApiKey(apiKey: string) {
        const accessStore = useAccessStore.getState();
        accessStore.updateToken(apiKey);
        set((state) => ({ apiKey }));
      },
    }),
    {
      name: AZURE_ACCESS_KEY,
      version: 1,
    },
  ),
);
