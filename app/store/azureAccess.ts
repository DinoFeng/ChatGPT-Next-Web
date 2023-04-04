import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AzureAccessControlStore {
  apiKey: string;
  sourceName: string;
  deploymentId: string;
  apiVersion: string;
  isDefault: boolean;
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
        set((state) => ({ apiKey }));
      },
    }),
    {
      name: AZURE_ACCESS_KEY,
      version: 1,
    },
  ),
);
