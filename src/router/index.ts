import {
  NavigationGuardNext,
  RouteLocationNormalized,
  createRouter,
  createWebHistory,
} from "vue-router"
import SideMenu from "../layouts/SideMenu/SideMenu.vue"

import ErrorPage from "../pages/ErrorPage.vue"
import Login from "@/pages/Login.vue"
import Register from "@/pages/Register.vue"

// Menu
import Dashbord from "../pages/dashboard/Dashboard.vue"
import ReportRoute from "./report.route"
import itemRoute from "./item.route"
import EmployeeRoute from "./employee.route"
import CustomerRoute from "./customer.route"
import { requireAuth } from "@/utils/axios/routerMiddleware"
import POSView from "@/pages/pos/POSView.vue"

const routes = [
  {
    path: "/",
    component: SideMenu,
    children: [
      {
        path: "/",
        name: "Dashboard",
        component: Dashbord,
      },
      {
        path: "/pos",
        name: "POS",
        component: POSView,
      },
      ...CustomerRoute,
      ...EmployeeRoute,
      ...ReportRoute,
      ...itemRoute,
    ],
    beforeEnter: requireAuth,
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/error-page",
    name: "error-page",
    component: ErrorPage,
  },
  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach(
//   async (
//     to: RouteLocationNormalized,
//     from: RouteLocationNormalized,
//     next: NavigationGuardNext
//   ) => {
//     const storage = localStorage.getItem("access")
//     interface Access {
//       auth: boolean
//       token: string | null
//     }

//     if (storage) {
//       const auth = JSON.parse(storage) as Access
//       if (to.meta.requiresAuth && !auth.auth) {
//         next("/login")
//       }
//     }
//     next()
//   }
// )

export default router
