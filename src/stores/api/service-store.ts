import type { IService } from "@/_helper/types-api"
import { defineStore } from "pinia"
import router from "@/router"
import axios from "axios"
import fetchWrapper from "@/utils/axios/fetch-wrapper"

export type ServiceState = {
  serviceData: IService | null
  serviceList: IService | null
  returnUrl: null
}

export const useServiceStore = defineStore({
  id: "auth",
  state: () =>
    ({
      serviceData: null,
      serviceList: null,
      returnUrl: null,
    } as ServiceState),
  actions: {
    async createService(service: IService) {
      const res = await fetchWrapper.post(`item`, service)
    },
    async getService() {
      try {
        const params = {
          itemType: "service",
        }
        const service = await fetchWrapper.get(`item`)

        this.serviceList = service.data
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error)
      }
    },
  },
})
