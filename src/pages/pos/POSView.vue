<script setup lang="ts">
  import _, { debounce } from "lodash"
  import { onMounted, reactive, ref, watch } from "vue"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import {
    FormInput,
    FormLabel,
    FormSelect,
    FormTextarea,
  } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import { Menu, Tab, Dialog } from "@/base-components/Headless"
  import {
    IService,
    ICart,
    IEmployee,
    ITransaction,
    ILastTransaction,
  } from "@/_helper/types-api"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import { formatCurrency, formatDate } from "@/utils/helper"
  import { toast } from "vue3-toastify"
  import TomSelect from "@/base-components/TomSelect"
  import Tippy from "@/base-components/Tippy"
  import DialogConfirm from "./DialogConfirm.vue"
  import DialogPaymentUpdate from "./DialogPaymentUpdate.vue"
  import DialogInvoice from "./DialogInvoice.vue"
  import Cart from "./Cart.vue"
  import type { TabsPaneContext } from "element-plus"

  const params = reactive({
    keyword: "",
    current_page: 1,
    pagesize: 20,
    sort_column: "id",
    sort_direction: "asc",
  })
  const getParams = (data: any) => {
    params.current_page = data.current_page
    params.pagesize = data.pagesize
    params.sort_column = data.sort_column
    params.sort_direction = data.sort_direction

    getData("")
  }
  const serviceItem = ref<IService[]>([])
  let carts = ref<ICart[]>([])
  const transactionData = ref<ITransaction>()

  const priceMeta = ref({
    subtotal: 0,
    totalItem: 0,
    totalPoint: 0,
    totalCarge: 0,
  })

  const calculateTotals = () => {
    let subtotal = 0
    let totalItem = 0
    let totalPoint = 0

    carts.value.forEach((cart: any) => {
      subtotal += cart.servicesPrice * cart.amount
      totalItem += cart.amount
      totalPoint += cart.servicesPoint * cart.amount
    })

    priceMeta.value.subtotal = subtotal
    priceMeta.value.totalItem = totalItem
    priceMeta.value.totalPoint = totalPoint
  }

  watch(
    () => carts,
    (val: any) => {
      if (val.value.length) {
        calculateTotals()
      } else {
        priceMeta.value.subtotal = 0
        priceMeta.value.totalItem = 0
        priceMeta.value.totalPoint = 0
        priceMeta.value.totalCarge = 0
      }
    },
    {
      deep: true,
    }
  )

  // payment Storage
  const paymentStorage = localStorage.getItem("paymentCreated")
  let paymentData = ref({
    paymentCode: "",
    customerName: "",
    transactionDate: "",
  })
  if (paymentStorage) {
    const payment = JSON.parse(paymentStorage)
    paymentData.value.paymentCode = payment?.paymentCode
    paymentData.value.customerName = payment?.customerName
    paymentData.value.transactionDate = payment?.transactionDate
  }

  // Cart Proccess
  const addCart = (item: IService) => {
    if (!paymentStorage) {
      toast.error("Silahkan buat pesanan baru!")
      return
    }

    const existingItem = carts.value.find(
      (cartItem) => cartItem.servicesCode === item.servicesCode
    )
    if (existingItem) {
      // existingItem
      existingItem.amount += 1
    } else {
      // Jika item belum ada, tambahkan item baru ke dalam keranjang
      carts.value.push({
        servicesCode: item.servicesCode,
        servicesName: item.servicesName,
        servicesPrice: item.servicesPrice,
        servicesPoint: item.servicesPoint,
        employeeCode: null,
        amount: 1,
      })
    }
  }

  const clearItem = (item: ICart) => {
    const index = carts.value.findIndex(
      (itm) => itm.servicesCode === item.servicesCode
    )

    if (index !== -1) {
      carts.value.splice(index, 1)
    }
  }

  const counting = (value: string, initValue: any) => {
    if (value === "plus") {
      initValue.amount++
    } else {
      if (initValue.amount != 0) {
        initValue.amount--
      }
    }
  }

  const processModal = ref(false)
  let dataOrder = ref({})
  const pay = () => {
    const amount = carts.value.some((e) => e.amount === 0)
    if (!paymentStorage) {
      toast.error("Silahkan buat pesanan baru!")
    } else if (!carts.value.length) {
      toast.error("Keranjang Masih Kosong, Silahkan pilih menu!")
    } else if (amount) {
      toast.error("Silihkan pilih jumlah item!")
    } else {
      dataOrder.value = {
        ...paymentData.value,
        carts,
      }
      processModal.value = true
    }
  }

  const paymentUpdateModal = ref(false)
  const invoiceModal = ref(false)
  let paymentUpdateData = ref<ILastTransaction>()
  const paymentUpdate = (value: any) => {
    // paymentUpdateData.value = value as ILastTransaction
    // paymentUpdateModal.value = true
    if (value?.paymentStatus !== "PAID") {
      paymentUpdateData.value = value as ILastTransaction
      paymentUpdateModal.value = true
    }
  }

  // Delete Item
  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value
  }
  const deleteButtonRef = ref(null)

  const lastTransaction = ref<ILastTransaction[]>([])
  const getLastTransaction = async () => {
    try {
      const response = await fetchWrapper.get("pos/last-trx")
      lastTransaction.value = response as ILastTransaction[]
    } catch (error) {}
  }

  const deleteAllItem = () => {
    carts.value = []
  }

  interface TabMenu extends IService {
    categoryName: string
    services: IService[]
  }

  const tab = ref<TabMenu[]>([])
  const tabActive = ref("All")

  const tabClick = async (tab: TabsPaneContext, event: Event) => {
    try {
      console.log(tab, event)
    } catch (error) {}
  }

  const keyword = ref(null)
  const searchItem = _.debounce(async function (value: any) {
    keyword.value = value
    await getData(keyword.value)
  }, 200)
  const getData = async (keyword: any) => {
    try {
      const data: IService[] = await fetchWrapper.get(`pos/menu`, { keyword })
      const dataCategory = await fetchWrapper.get("pos/services-category")

      const groupedItemsByCategory: { [key: string]: any[] } = {}
      data.forEach((service: any) => {
        let { servicesCategory, ...rest } = service

        if (!servicesCategory) {
          servicesCategory = "All"
        }

        if (!groupedItemsByCategory[servicesCategory]) {
          groupedItemsByCategory[servicesCategory] = []
        }
        groupedItemsByCategory[servicesCategory].push(rest)
      })

      const categoriesNull = [
        ...dataCategory.map((cat: any) => cat.categoryName),
        "All",
      ]

      const mergedData: { categoryName: string; services: any[] }[] =
        categoriesNull.map((category: any) => {
          return {
            categoryName: category,
            services: groupedItemsByCategory[category] || [], // Gunakan data item yang sesuai dengan categoryName
          }
        })

      tab.value = mergedData as TabMenu[]
    } catch (error) {
      throw new Error("Gagal mengambil data")
    }
  }

  onMounted(() => {
    getData("")
    getLastTransaction()
  })
</script>

<template>
  <div class="flex gap-5 mt-5 intro-y">
    <!-- BEGIN: Item List -->
    <div class="flex-1 col-span-12 intro-y lg:col-span-8">
      <div class="grid">
        <!-- New Trx -->
        <div class="grid">
          <div class="flex flex-col items-center mb-2 intro-y sm:flex-row">
            <h2 class="mr-auto text-lg font-medium">Transaksi Hari Ini</h2>
          </div>
          <div
            :class="
              lastTransaction.length
                ? 'h-[8rem] border-b-2 border-b-slate-200 border-dashed pb-8 mb-8'
                : ''
            "
            class="flex w-full overflow-x-auto overflow-y-hidden gap-3 my-3">
            <a
              @click="paymentUpdate(trx)"
              v-for="(trx, index) in lastTransaction"
              :key="index"
              class="block w-max h-max col-span-12 intro-y sm:col-span-4 2xl:col-span-3">
              <Tippy variant="primary" :content="trx?.paymentCode">
                <div
                  class="h-[6.5rem] w-[17.5rem] grid grid-cols-2 grid-rows-3 p-3 rounded-md box zoom-in">
                  <div class="font-black text-md whitespace-nowrap">
                    ORDER #{{ trx?.paymentCode }}
                  </div>

                  <div class="text-end mt-0.5">
                    <a
                      :class="
                        trx.paymentStatus === 'PAID'
                          ? 'bg-green-600'
                          : 'bg-amber-500'
                      "
                      class="text-white rounded-full px-2 py-0.5 font-medium text-xs">
                      {{ trx.paymentStatus === "PAID" ? "Lunas" : "Proses" }}
                    </a>
                  </div>

                  <div class="row-start-2 grid">
                    <div
                      class="text-slate-800 text-xs whitespace-nowrap mt-0.5">
                      {{ trx.customerName }}
                    </div>
                    <div
                      class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      {{ trx.totalAmount }} Item
                    </div>
                  </div>

                  <div
                    class="row-start-3 col-start-2 flex items-end justify-end text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{
                      formatDate(
                        trx.paymentDate.toLocaleString(),
                        "YYYY-MMMM-DD HH:mm"
                      )
                    }}
                  </div>
                </div>
              </Tippy>
            </a>
            <div
              v-if="!lastTransaction.length"
              class="w-full flex justify-center text-slate-400">
              Belum ada transaksi
            </div>
          </div>
        </div>

        <!-- Mennu -->
        <div class="grid">
          <div class="flex flex-col items-center mb-2 intro-y sm:flex-row">
            <h2 class="mr-auto text-3xl font-medium">Menu</h2>
            <div class="relative">
              <FormInput
                @update:modelValue="searchItem"
                type="text"
                class="w-full px-4 py-3 pr-10 lg:w-64 !box"
                placeholder="Search item..." />
              <Lucide
                icon="Search"
                class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3 text-slate-500" />
            </div>
          </div>
          <el-tabs
            v-model="tabActive"
            type="card"
            class="demo-tabs"
            @tab-click="tabClick">
            <el-scrollbar height="60vh">
              <el-tab-pane
                class="grid grid-cols-12 gap-5 leading-relaxed"
                v-for="(item, index) in tab"
                :key="index"
                :label="item.categoryName"
                :name="item.categoryName">
                <div
                  v-for="(services, index) in item.services"
                  @click="addCart(services)"
                  class="block col-span-12 intro-y sm:col-span-4 2xl:col-span-3">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="(services as any).servicesName"
                    placement="top-start">
                    <div class="flex p-3 rounded-md box zoom-in">
                      <div class="block font-medium truncate">
                        <a href="" class="font-medium whitespace-nowrap">
                          {{ (services as any).servicesName }}
                        </a>
                        <div
                          class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                          {{
                            "Rp. " +
                            formatCurrency((services as any).servicesPrice)
                          }}
                        </div>
                      </div>
                    </div>
                  </el-tooltip>
                </div>
              </el-tab-pane>
            </el-scrollbar>
          </el-tabs>
        </div>
      </div>
    </div>
    <!-- END: Item List -->

    <!-- BEGIN: Cart -->
    <Cart
      class="flex-none"
      :childCarts="carts"
      :price="priceMeta"
      @clearItem="clearItem"
      @delete-all-item="deleteAllItem"
      @pay="pay" />
    <!-- END: Cart -->

    <Dialog
      :open="deleteConfirmationModal"
      @close="
        () => {
          setDeleteConfirmationModal(false)
        }
      "
      :initialFocus="deleteButtonRef">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Are you sure?</div>
          <div class="mt-2 text-slate-500">
            Do you really want to delete these records? <br />
            This process cannot be undone.
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button
            variant="outline-secondary"
            type="button"
            @click="
              () => {
                setDeleteConfirmationModal(false)
              }
            "
            class="w-24 mr-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            type="button"
            class="w-24"
            ref="deleteButtonRef">
            Delete
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  </div>

  <!-- BEGIN: Dialog Proccess -->
  <DialogConfirm
    :processTransaction="processModal"
    :dataOrder="dataOrder"
    :metaPrice="priceMeta"
    @close="processModal = false" />
  <!-- END: Dialog Proccess -->

  <!-- BEGIN: Dialog Proccess -->
  <DialogPaymentUpdate
    :updateModal="paymentUpdateModal"
    :dataPayment="paymentUpdateData"
    @close="paymentUpdateModal = false" />
  <!-- END: Dialog Proccess -->

  <!-- BEGIN: Dialog Proccess -->
  <DialogInvoice
    :invoiceModal="invoiceModal"
    :dataPayment="paymentUpdateData"
    @close="invoiceModal = false" />
  <!-- END: Dialog Proccess -->
</template>

<style scoped>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .category-list::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .category-list {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
