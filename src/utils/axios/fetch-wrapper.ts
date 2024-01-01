import axios from "axios"
import { useAuthStore } from "@/stores/api/auth-store"
import router from "@/router"
import { toast } from "vue3-toastify"

const base_url = import.meta.env.VITE_API_URL as string

const axiosInstance = axios.create({
  baseURL: `https://dev-backend.digvation.tech/api` || `${base_url}/api`,
  withCredentials: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
})

interface Access {
  isAuth: boolean
  token: string | null
}

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access")

    if (accessToken) {
      const token = JSON.parse(accessToken) as Access
      config.headers.Authorization = `Bearer ${token.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      toast.error(error.response.data.message)
      router.push("/login")
    }
    return Promise.reject(error)
  }
)

// axiosInstance.interceptors.request.use(async (config: any) => {
//   // const token = localStorage.getItem("token")
//   // const authStore = useAuthStore()
//   // const token = await authStore.validateToken()
//   // console.log(token)
//   return config

//   // if (isTokenGood(token)) {
//   //   return config
//   // } else {
//   //   logout()
//   // }
// })

export default {
  async get(url: any, params = {}) {
    try {
      const response = await axiosInstance.get(url, {
        params,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async post(url: any, data = {}) {
    try {
      const response = await axiosInstance.post(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async put(url: any, data = {}) {
    try {
      const response = await axiosInstance.put(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async patch(url: any, data = {}) {
    try {
      const response = await axiosInstance.patch(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async delete(url: any) {
    try {
      const response = await axiosInstance.delete(url)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
