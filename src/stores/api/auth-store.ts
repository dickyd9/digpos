import type {
  GenericResponse,
  ILoginInput,
  ILoginResponse,
  IUser,
} from "@/_helper/types-api"
import { defineStore } from "pinia"
import router from "@/router"
import fetchWrapper from "@/utils/axios/fetch-wrapper"
import { toast } from "vue3-toastify"

export type AuthStoreState = {
  authUser: IUser | null
  access_token: null
  returnUrl: null
  isAuth: boolean
}

export const useAuthStore = defineStore({
  id: "auth",
  state: () =>
    ({
      access_token: null,
      authUser: null,
      returnUrl: null,
      isAuth: false,
    } as AuthStoreState),
  getters: {},
  actions: {
    async login(user: ILoginInput) {
      try {
        const res = await fetchWrapper.post(`auth/signIn`, user)

        this.access_token = res.access_token
        this.isAuth = true

        localStorage.setItem(
          "access",
          JSON.stringify({ token: res.access_token, auth: this.isAuth })
        )
        await this.getUserWithToken()
        await toast.success("Berhasil Login")
        // Tunggu sebentar sebelum pindah ke dashboard
        setTimeout(() => {
          // Navigasi ke dashboard
          router.push(this.returnUrl || "/pos")
        }, 1000)
      } catch (error: any) {
        toast.error(error.response.data.message)
      }
    },
    async getUserWithToken() {
      try {
        const user = await fetchWrapper.get(`user/profile`)

        this.authUser = user
        localStorage.setItem("user_data", JSON.stringify(user))
      } catch (error) {
        router.push("/login")
      }
    },
    async validateToken() {
      if (!this.isAuth) {
        await fetchWrapper.get("auth/validateToken")
        try {
        } catch (err: any) {
          this.isAuth = false
          toast.error(err.response.data.message)
        }
      }
    },
    setAuthUser(user: IUser | null) {
      this.authUser = user
    },
    async logout() {
      try {
        // Hapus data autentikasi dari localStorage
        localStorage.removeItem("access")
        localStorage.removeItem("user_data")
        localStorage.removeItem("invoice")

        // Hapus data pengguna dari toko autentikasi
        this.authUser = null

        // Redirect ke halaman login atau halaman lain yang sesuai
        router.push("/login")
      } catch (error) {
        // Tangani kesalahan jika gagal logout
        console.error("Gagal logout:", error)
      }
    },
  },
  persist: {
    enabled: true,
  },
})
