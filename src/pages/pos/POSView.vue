<script setup lang="ts">
  import _ from "lodash"
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
  import { IService, ICart, IEmployee, ITransaction } from "@/_helper/types-api"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import { formatCurrency } from "@/utils/helper"
  import { toast } from "vue3-toastify"
  import TomSelect from "@/base-components/TomSelect"
  import Tippy from "@/base-components/Tippy"

  const addItemModal = ref(false)
  const setAddItemModal = (value: boolean) => {
    addItemModal.value = value
  }
  const addItemRef = ref(null)

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
  const carts = ref<ICart[]>([])
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
      const response = await fetchWrapper.get("item", params)
      serviceItem.value = response?.data as IService[]
    } catch (error) {}
  }
  const getEmployee = async () => {
    try {
      const response = await fetchWrapper.get("employee", params)
      employeeList.value = response?.data as IEmployee[]
    } catch (error) {}
  }

  const employeeList = ref<IEmployee[]>([])
  const invoiceStorage = localStorage.getItem("invoice")

  let paymentCode = ref("")
  if (invoiceStorage) {
    const invoice = JSON.parse(invoiceStorage)
    paymentCode = invoice?.paymentCode
  }

  const addCart = (item: IService) => {
    if (!invoiceStorage) {
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
        carts.value.push({ ...item, amount: 1 })
      }
    }
  }

  const clearItem = (item: ICart) => {
    const index = carts.value.findIndex((itm) => itm.itemCode === item.itemCode)

    if (index !== -1) {
      carts.value.splice(index, 1)
    }
  }

  const employeeCode = ref("")
  const updateEmployeeCode = (cart: any, event: any) => {
    cart.employeeCode = event
  }
  const pay = () => {
    console.log(carts)
  }

  onMounted(() => {
    getData()
    getEmployee()
  })
</script>

<template>
  <div class="flex gap-5 mt-5 intro-y">
    <!-- BEGIN: Item List -->
    <div class="flex-1 col-span-12 intro-y lg:col-span-8">
      <div class="grid">
        <div class="grid">
          <div class="flex flex-col items-center mb-2 intro-y sm:flex-row">
            <h2 class="mr-auto text-lg font-medium">Transaksi Terakhir</h2>
          </div>
          <div
            class="flex w-full h-[7rem] overflow-x-auto overflow-y-hidden gap-3 my-3">
            <a
              v-for="(item, index) in 10"
              :key="index"
              class="block w-36 h-12 col-span-12 intro-y sm:col-span-4 2xl:col-span-3">
              <Tippy variant="primary" content="#INV-2127-20231108">
                <div class="flex p-3 rounded-md box zoom-in">
                  <div class="block font-medium truncate">
                    <a href="" class="font-medium whitespace-nowrap">
                      #INV-2127-20231108
                    </a>
                    <div
                      class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      Nama Customer
                    </div>
                    <div
                      class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      08 - 11 - 2023
                    </div>
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
        <strong>#{{ paymentCode ? paymentCode : "####" }}</strong>
      </div>
      <div class="p-2 mt-5 box grid gap-3">
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
            <button class="rounded border ml-2 hover:bg-black">
              <Lucide
                @click="clearItem(cart)"
                icon="X"
                class="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <!-- <TomSelect
            v-model="employeeCode"
            style="border: 1px !important"
            :options="{
              placeholder: 'Pilih Karyawan',
            }"
            @update:modelValue="updateEmployeeCode(cart, $event)"
            class="w-full">
            <option
              :value="employee.employeeCode"
              v-for="(employee, index) in employeeList"
              :key="index">
              {{ employee.employeeName }}
            </option>
          </TomSelect> -->
        </a>
        <p v-if="!carts.length" class="text-center p-3 text-slate-300">
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
          class="w-32 border-slate-300 dark:border-darkmode-400 text-slate-500">
          Clear Items
        </Button>
        <Button @click="pay" variant="primary" class="w-32 ml-auto shadow-md">
          Charge
        </Button>
      </div>
    </div>
    <!-- <Tab.Group class="col-span-12 lg:col-span-4">
      <div class="pr-1 intro-y">
        <div class="p-2 box">
          <Tab.List variant="pills">
            <Tab>
              <Tab.Button as="button" class="w-full py-2"> Ticket </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button as="button" class="w-full py-2"> Details </Tab.Button>
            </Tab>
          </Tab.List>
        </div>
      </div>
      <Tab.Panels>
        <Tab.Panel> </Tab.Panel>
        <Tab.Panel>
          <div class="p-5 mt-5 box">
            <div
              class="flex items-center pb-5 border-b border-slate-200 dark:border-darkmode-400">
              <div>
                <div class="text-slate-500">Time</div>
                <div class="mt-1">02/06/20 02:10 PM</div>
              </div>
              <Lucide icon="Clock" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
            <div
              class="flex items-center py-5 border-b border-slate-200 dark:border-darkmode-400">
              <div>
                <div class="text-slate-500">Customer</div>
                <div class="mt-1">{{ fakerData[0].users[0].name }}</div>
              </div>
              <Lucide icon="User" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
            <div
              class="flex items-center py-5 border-b border-slate-200 dark:border-darkmode-400">
              <div>
                <div class="text-slate-500">People</div>
                <div class="mt-1">3</div>
              </div>
              <Lucide icon="Users" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
            <div class="flex items-center pt-5">
              <div>
                <div class="text-slate-500">Table</div>
                <div class="mt-1">21</div>
              </div>
              <Lucide icon="Mic" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group> -->
    <!-- END: Ticket -->
  </div>

  <!-- BEGIN: Add Item Modal -->
  <Dialog
    :open="addItemModal"
    @clsoe="
      () => {
        setAddItemModal(false)
      }
    "
    :initialFocus="addItemRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          {{ fakerData[0].foods[0].name }}
        </h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12">
          <FormLabel htmlFor="pos-form-4" class="form-label">
            Quantity
          </FormLabel>
          <div class="flex flex-1">
            <Button
              type="button"
              class="w-12 mr-1 border-slate-200 bg-slate-100 dark:bg-darkmode-700 dark:border-darkmode-500 text-slate-500">
              -
            </Button>
            <FormInput
              id="pos-form-4"
              type="text"
              class="w-24 text-center"
              placeholder="Item quantity"
              value="2" />
            <Button
              type="button"
              class="w-12 ml-1 border-slate-200 bg-slate-100 dark:bg-darkmode-700 dark:border-darkmode-500 text-slate-500">
              +
            </Button>
          </div>
        </div>
        <div class="col-span-12">
          <FormLabel htmlFor="pos-form-5">Notes</FormLabel>
          <FormTextarea id="pos-form-5" placeholder="Item notes"></FormTextarea>
        </div>
      </Dialog.Description>
      <Dialog.Footer class="text-right">
        <Button
          variant="outline-secondary"
          type="button"
          @click="
            () => {
              setAddItemModal(false)
            }
          "
          class="w-24 mr-1">
          Cancel
        </Button>
        <Button variant="primary" type="button" class="w-24" ref="addItemRef">
          Add Item
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Add Item Modal -->
</template>
