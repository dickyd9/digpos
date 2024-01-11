<script lang="ts" setup>
  import { ICart } from "@/_helper/types-api"
  import { formatCurrency, formatDate } from "@/utils/helper"
  import Button from "@/base-components/Button"
  import { computed, ref } from "vue"
  import Lucide from "@/base-components/Lucide"

  const props = defineProps({
    childCarts: Object,
    price: Object,
  })

  const emit = defineEmits<{
    (e: "clearItem", data: ICart): any
    (e: "deleteAllItem"): void
    (e: "pay"): void
  }>()

  // Carts Data
  const action = ref({
    min: 1,
    max: 100,
    size: 'default'
  })
  const carts = computed(() => {
    return props.childCarts
  })

  const priceMeta = computed(() => {
    return props.price
  })

  const clearItem = (value: any) => {
    emit("clearItem", value)
  }

  const deleteAllItem = () => {
    emit("deleteAllItem")
  }

  const pay = () => {
    emit("pay")
  }

  // Payment Storage
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
</script>

<template>
  <div class="w-1/3 max-h-screen overflow-auto">
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
        :key="index"
        class="intro-x grid items-center gap-3 !box p-3 transition duration-300 ease-in-out bg-white rounded-md cursor-pointer dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400">
        <div class="flex items-center">
          <div
            class="text-slate-500 flex items-center h-10 rounded-lg relative bg-transparent">
            <el-input-number
              v-model="cart.amount"
              :min="action.min"
              :max="action.max"
              :size="action.size" 
            />
          </div>
          <div class="max-w-[50%] truncate ml-4">
            {{ cart.itemName }}
          </div>
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
      <p v-if="!carts?.length" class="text-center p-3 text-slate-300">
        Keranjang masih kosong,
        <br />
        Silahkan Pilih Menu
      </p>
    </div>
    <div class="p-5 mt-5 box">
      <div class="flex">
        <div class="mr-auto">Total Item</div>
        <div class="font-medium">
          {{ priceMeta?.totalItem }}
        </div>
      </div>
      <div class="flex mt-4">
        <div class="mr-auto">Total Point</div>
        <div class="font-medium">{{ priceMeta?.totalPoint }}</div>
      </div>
      <div
        class="flex pt-4 mt-4 border-t border-slate-200/60 dark:border-darkmode-400">
        <div class="mr-auto text-base font-medium">Subtotal</div>
        <div class="text-base font-medium">
          Rp.
          {{
            priceMeta?.subtotal != 0
              ? formatCurrency(priceMeta?.subtotal)
              : priceMeta?.subtotal
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
</template>
