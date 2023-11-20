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

    getData()
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
    carts.value.map((cart: any) => {
      priceMeta.value.subtotal = carts.value.reduce(
        (acc, cartItem) => acc + cartItem.itemPrice, // Ganti 'totalItem' dengan nama properti yang sesuai
        0
      )
      priceMeta.value.totalItem = carts.value.reduce(
        (acc, cartItem) => acc + cartItem.amount, // Ganti 'totalItem' dengan nama properti yang sesuai
        0
      )

      priceMeta.value.totalPoint = carts.value.reduce(
        (acc, cartItem) => acc + cartItem.itemPoint, // Ganti 'totalItem' dengan nama properti yang sesuai
        0
      )
    })
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

  const getData = async () => {
    try {
      const response = await fetchWrapper.get("item/menu", params)
      serviceItem.value = response as IService[]
    } catch (error) {}
  }

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
    } else {
      const existingItem = carts.value.find(
        (cartItem) => cartItem.itemCode === item.itemCode
      )
      if (existingItem) {
        // Jika item sudah ada, tambahkan kuantitasnya
        existingItem
      } else {
        // Jika item belum ada, tambahkan item baru ke dalam keranjang
        carts.value.push({
          itemCode: item.itemCode,
          itemName: item.itemName,
          itemPrice: item.itemPrice,
          itemPoint: item.itemPoint,
          employeeCode: null,
          amount: 1,
        })
      }
    }
  }
  const clearItem = (item: ICart) => {
    const index = carts.value.findIndex((itm) => itm.itemCode === item.itemCode)

    if (index !== -1) {
      carts.value.splice(index, 1)
    }
  }

  const processModal = ref(false)
  let dataOrder = ref({})
  const pay = () => {
    if (!paymentStorage) {
      toast.error("Silahkan buat pesanan baru!")
    } else if (!carts.value.length) {
      toast.error("Keranjang Masih Kosong, Silahkan pilih menu!")
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
      const response = await fetchWrapper.get("transaction/payment")
      lastTransaction.value = response as ILastTransaction[]
    } catch (error) {}
  }

  const deleteAllItem = () => {
    carts.value = [] as ICart[]
  }

  onMounted(() => {
    getData()
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
            <h2 class="mr-auto text-lg font-medium">Transaksi Terakhir</h2>
          </div>
          <div
            class="flex w-full h-[8rem] overflow-x-auto overflow-y-hidden gap-3 my-3">
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
                    <div
                      class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      {{
                        trx.totalPrice
                          ? "Rp. " + formatCurrency(trx.totalPrice)
                          : "-"
                      }}
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
          </div>
        </div>

        <div class="grid">
          <div class="flex flex-col items-center mb-8 intro-y sm:flex-row">
            <h2 class="mr-auto text-lg font-medium">Cashier</h2>
          </div>
          <div class="lg:flex intro-y">
            <div class="relative">
              <FormInput
                type="text"
                class="w-full px-4 py-3 pr-10 lg:w-64 !box"
                placeholder="Search item..." />
              <Lucide
                icon="Search"
                class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3 text-slate-500" />
            </div>
            <FormSelect
              @input="(value: any) => {
                console.log(value.target.value)
              }"
              class="w-full px-4 py-3 mt-3 ml-auto !box lg:w-auto lg:mt-0">
              <option>Sort By</option>
              <option value="a">A to Z</option>
              <option value="b">Z to A</option>
              <option value="c">Lowest Price</option>
              <option value="d">Highest Price</option>
            </FormSelect>
          </div>
          <div class="grid grid-cols-12 gap-5 pt-5 mt-5 border-t">
            <a
              v-for="(service, index) in serviceItem"
              :key="index"
              href="#"
              @click="addCart(service)"
              class="block col-span-12 intro-y sm:col-span-4 2xl:col-span-3">
              <div class="flex p-3 rounded-md box zoom-in">
                <div class="block font-medium truncate">
                  <a href="" class="font-medium whitespace-nowrap">
                    {{ service.itemName }}
                  </a>
                  <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                    {{ "Rp. " + formatCurrency(service.itemPrice) }}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Item List -->
    <!-- BEGIN: Ticket -->
    <div class="flex-none w-1/3 max-h-screen overflow-auto">
      <div class="flex justify-between p-5 box">
        <strong>No Order: </strong>
        <strong
          >#{{
            paymentData.paymentCode ? paymentData.paymentCode : "####"
          }}</strong
        >
      </div>
      <div class="p-2 mt-5 box grid gap-3">
        <div
          class="p-2 flex justify-center"
          style="border-bottom: 1px solid #0000001a">
          <strong>Keranjang</strong>
        </div>
        <a
          v-for="(cart, index) in carts"
          href="#"
          :key="index"
          class="intro-x grid items-center gap-3 !box p-3 transition duration-300 ease-in-out bg-white rounded-md cursor-pointer dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400">
          <div class="flex">
            <div class="max-w-[50%] truncate mr-1">
              {{ cart.itemName }}
            </div>
            <div class="text-slate-500">{{ cart.amount }}X</div>
            <div class="ml-auto font-medium">
              Rp. {{ formatCurrency(cart.itemPrice) }}
            </div>
            <button class="rounded border ml-2 hover:bg-red-700">
              <Lucide
                @click="clearItem(cart)"
                icon="X"
                class="w-4 h-4 text-slate-500 hover:text-white" />
            </button>
          </div>
        </a>
        <p v-if="!carts.length" class="text-center p-3 text-slate-300">
          Keranjang masih kosong,
          <br />
          Silahkan Pilih Menu
        </p>
      </div>
      <div class="p-5 mt-5 box">
        <div class="flex">
          <div class="mr-auto">Total Item</div>
          <div class="font-medium">
            {{ priceMeta.totalItem }}
          </div>
        </div>
        <div class="flex mt-4">
          <div class="mr-auto">Total Point</div>
          <div class="font-medium">{{ priceMeta.totalPoint }}</div>
        </div>
        <div
          class="flex pt-4 mt-4 border-t border-slate-200/60 dark:border-darkmode-400">
          <div class="mr-auto text-base font-medium">Subtotal</div>
          <div class="text-base font-medium">
            Rp.
            {{
              priceMeta.subtotal != 0
                ? formatCurrency(priceMeta.subtotal)
                : priceMeta.subtotal
            }}
          </div>
        </div>
      </div>
      <div class="flex mt-5">
        <Button
          @click="deleteAllItem"
          class="w-32 border-slate-300 dark:border-darkmode-400 text-slate-500">
          Hapus Item
        </Button>
        <Button @click="pay" variant="primary" class="w-32 ml-auto shadow-md">
          Proses
        </Button>
      </div>
    </div>
    <!-- END: Ticket -->
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
