import { useAuthStore } from "@/stores/api/auth-store"
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router"

export const requireAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const authStore = useAuthStore()

  if (authStore.isAuth && authStore.access_token) {
    next()
  } else {
    next("/login")
  }
}
