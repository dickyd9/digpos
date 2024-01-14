import { defineStore } from "pinia"
import { Icon } from "../base-components/Lucide/Lucide.vue"

export interface Menu {
  icon: Icon
  title: string
  pageName?: string
  subMenu?: Menu[]
  ignore?: boolean
}

export interface SideMenuState {
  menu: Array<Menu | "divider">
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: "Book",
        pageName: "POS",
        title: "Menu",
      },
      {
        icon: "Book",
        pageName: "BookingList",
        title: "Booking List",
      },
      // {
      //   icon: "User",
      //   pageName: "Karyawan",
      //   title: "Karyawan",
      //   subMenu: [
      //     {
      //       icon: "User",
      //       pageName: "Employee List",
      //       title: "List Karyawan",
      //     },
      //     {
      //       icon: "User",
      //       pageName: "Assign Employee",
      //       title: "Tugas Karyawan",
      //     },
      //   ],
      // },
      // {
      //   icon: "Inbox",
      //   pageName: "Service",
      //   title: "Service",
      // },
      // {
      //   icon: "FileText",
      //   pageName: "Report",
      //   title: "Report",
      //   subMenu: [
      //     {
      //       icon: "FileText",
      //       pageName: "Report Karyawan",
      //       title: "Report Karyawan",
      //     },
      //     {
      //       icon: "FileText",
      //       pageName: "Report Service",
      //       title: "Report Service",
      //     },
      //     {
      //       icon: "FileText",
      //       pageName: "Report Transaksi",
      //       title: "Report Transaksi",
      //     },
      //   ],
      // },
      // {
      //   icon: "User",
      //   pageName: "Customer List",
      //   title: "Customer",
      // },
      // {
      //   icon: "Archive",
      //   pageName: "Item",
      //   title: "Item",
      // },
    ],
  }),
})
