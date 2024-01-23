<script lang="ts" setup>
  import { onMounted, reactive, ref, watch } from "vue"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import {
    FormInput,
    FormLabel,
    FormSelect,
    FormTextarea,
    InputGroup,
  } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import { Menu, Tab, Dialog } from "@/base-components/Headless"
  import {
    ICreateInvoice,
    ICustomer,
    ICustomerInput,
    IEmployee,
  } from "@/_helper/types-api"
  import TomSelect from "@/base-components/TomSelect"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import Litepicker from "@/base-components/Litepicker"
  import { toast } from "vue3-toastify"
  import { WindowScrollController } from "@fullcalendar/vue3"
  import { formatCurrency, formatDate } from "@/utils/helper"

  const props = defineProps({
    invoiceModal: Boolean,
    dataPayment: Object,
  })

  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "update"): void
  }>()
</script>

<template>
  <Dialog
    :open="invoiceModal"
    @close="
      () => {
        emit('close', false)
      }
    ">
    <Dialog.Panel>
      <div class="p-4 mb-6 w-full" style="height: 80vh">
        <a
          class="intro-x grid items-center gap-3 !box p-3 transition duration-300 ease-in-out bg-white rounded-md cursor-pointer dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400">
          <div class="flex items-center">
            <div
              class="text-slate-500 flex items-center h-10 rounded-lg relative bg-transparent">
              <el-input-number
                v-model="cart.amount"
                :min="action.min"
                :max="action.max"
                :size="action.size" />
            </div>
            <div class="max-w-[50%] truncate ml-4">
              {{ cart.itemName }}
            </div>
            <div class="ml-auto font-medium">
              Rp. {{ formatCurrency(cart.itemPrice) }}
            </div>
            <button class="rounded border ml-2 hover:bg-red-700">
              <Lucide
                icon="X"
                class="w-4 h-4 text-slate-500 hover:text-white" />
            </button>
          </div>
        </a>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>
