// cartsStore.ts
import { ICart, IService } from "@/_helper/types-api"
import { defineStore } from "pinia"

export const useCartsStore = defineStore({
  id: "carts",
  state: () => ({
    carts: [] as ICart[], // Ganti IService dengan tipe data yang sesuai
  }),
  actions: {
    // Fungsi untuk menambahkan item ke keranjang
    addCart(item: IService) {
      const cartsFromLocalStorage = localStorage.getItem("carts")
      
      const existingItem = this.carts.find(
        (cartItem) => cartItem.servicesCode === item.servicesCode
      )

      if (existingItem) {
        // Jika item sudah ada, tambahkan jumlahnya
        existingItem.amount += 1
      } else {
        // Jika item belum ada, tambahkan item baru ke dalam keranjang
        this.carts.push({
          servicesCode: item.servicesCode,
          servicesName: item.servicesName,
          servicesPrice: item.servicesPrice,
          servicesPoint: item.servicesPoint,
          employeeCode: null,
          amount: 1,
        })
      }

      // Simpan data carts ke local storage setiap kali ada perubahan
      localStorage.setItem("carts", JSON.stringify(this.carts))
    },
    // Fungsi untuk mengambil data keranjang dari local storage saat aplikasi dimuat
    loadCartsFromLocalStorage() {
      const cartsFromLocalStorage = localStorage.getItem("carts")
      if (cartsFromLocalStorage) {
        this.carts = JSON.parse(cartsFromLocalStorage)
      }
    },
  },
})
