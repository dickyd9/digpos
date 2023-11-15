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
        <div
          style="
                margin: 0 1rem;
                width: 100%
                font-size: 1.7rem;
                font-weight: 600;
                border-bottom: 1px dashed #0000004f;
              "
          class="p-3 text-center">
          <p>Nama Perusahaan / Bisnis</p>
          <p class="text-gray-400 font-light">Alamat</p>
        </div>
        <div class="mt-4 mx-[1rem] grid">
          <div class="flex justify-between">
            <div class="font-bold">DATE</div>
            <div class="text-end">
              {{ formatDate(props?.dataPayment?.paymentDate, "DD MMMM YYYY") }}
            </div>
          </div>

          <div class="row-start-2 flex justify-between">
            <div class="font-bold">INVOICE</div>
            <div class="text-end">#{{ props?.dataPayment?.invoice }}</div>
          </div>

          <table class="mt-6 table-auto hover:table-fixed">
            <tr>
              <th class="text-start pb-2 border-b border-gray-200">No</th>
              <th class="text-start pb-2 border-b border-gray-200">
                Nama
              </th>
              <th class="text-start pb-2 border-b border-gray-200">
                Harga
              </th>
              <th class="text-start pb-2 border-b border-gray-200">
                Item
              </th>
              <th class="text-start pb-2 border-b border-gray-200">
                Total
              </th>
            </tr>

            <tr v-for="(pay, index) in props?.dataPayment?.items" key="index">
              <td class="text-start py-2 border-b border-gray-200">
                {{ index + 1 }}
              </td>
              <td class="text-start py-2 border-b border-gray-200">
                {{ pay.itemName }}
              </td>
              <td class="text-start py-2 border-b border-gray-200">
                {{ "Rp. " + formatCurrency(pay.itemPrice) }}
              </td>
              <td class="text-center py-2 border-b border-gray-200">
                {{ pay.itemAmount }}
              </td>
              <td class="text-start py-2 border-b border-gray-200">
                {{ "Rp. " + formatCurrency(pay.totalPrice) }}
              </td>
            </tr>

            <tr>
              <td class="text-start font-bold py-2 border-b border-gray-200">Jumlah</td>
              <td class="text-start font-bold py-2 border-b border-gray-200"></td>
              <td class="text-start font-bold py-2 border-b border-gray-200"></td>
              <td class="text-center font-bold py-2 border-b border-gray-200">{{ props.dataPayment?.totalAmount }}</td>
              <td class="text-start font-bold py-2 border-b border-gray-200">{{ "Rp. " + formatCurrency(props.dataPayment?.totalPrice) }}</td>
            </tr>
          </table>

          <div
            class="grid justify-end text-end my-6 py-3"
            style="
              border-bottom: 1px dashed #0000004f;
              border-top: 1px dashed #0000004f;
            ">
            <div class="grid grid-cols-2 gap-3">
              <p class="font-bold">Pembayaran :</p>
              <p class="ml-auto">
                {{ props.dataPayment?.paymentMethod }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <p class="font-bold">Jumlah Point :</p>
              <p class="ml-auto">
                {{ props.dataPayment?.totalPoint }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <p class="font-bold">Jumlah Bayar :</p>
              <p class="ml-auto">
                Rp. {{ formatCurrency(props.dataPayment?.paymentAmount) }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <p class="font-bold">Kembali :</p>
              <p class="ml-auto">
                Rp. {{ formatCurrency(props.dataPayment?.changeAmount) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>
