<script lang="ts" setup>
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
    dialogBooking: Boolean,
    dataOrder: Object,
    metaPrice: Object,
  })

  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "update"): void
  }>()

  const employeeList = ref<IEmployee[]>([])
  const chooseEmployee = ref([])
  const getData = async (keyword: string) => {
    try {
      const response = await fetchWrapper.get("pos/customer-list", { keyword })
      employeeList.value = response?.data as IEmployee[]
      list.value = response.map((item: any) => {
        return {
          value: `${item.customerCode}`,
          label: `${item.customerName}`,
        }
      })
    } catch (error) {}
  }

  const createTicketRef = ref(null)

  const setdialogBooking = () => {
    emit("close", false)
  }

  const confirmModal = ref(false)
  const setConfirmModal = (value: boolean) => {
    confirmModal.value = value
  }

  interface ListItem {
    value: string
    label: string
  }

  const list = ref<ListItem[]>([])
  const options = ref<ListItem[]>([])
  const customer = ref<string[]>([])
  const loading = ref(false)

  const remoteMethod = async (query: string) => {
    await getData(query)
    if (query) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        options.value = list.value.filter((item) => {
          return item.label.toLowerCase().includes(query.toLowerCase())
        })
      }, 200)
    } else {
      options.value = []
    }
  }

  const saveData = async () => {
    // try {
    //   const cartData = props?.dataOrder?.carts.map((cart: any) => {
    //     return {
    //       employeeCode: cart.employeeCode || "",
    //       amount: cart.amount,
    //       itemCode: cart.itemCode,
    //     }
    //   })
    //   const response = await fetchWrapper.put(
    //     `transaction/${props?.dataOrder?.paymentCode}`,
    //     { data: cartData }
    //   )
    //   toast.success(response.message)
    //   confirmModal.value = false
    //   emit("close", false)
    //   localStorage.removeItem("paymentCreated")
    //   setTimeout(() => {
    //     window.location.reload()
    //   }, 2000)
    // } catch (error: any) {
    //   toast.error(error.response?.data.message)
    // }
  }

  // watch(
  //   () => props.dialogBooking,
  //   (newValue) => {
  //     if (newValue) {
  //       setTimeout(() => {
  //         getData()
  //       }, 20)
  //     }
  //   }
  // )
</script>

<template>
  <Dialog
    :open="props.dialogBooking"
    size="lg"
    @close="setdialogBooking"
    :initialFocus="createTicketRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Booking Form</h2>
      </Dialog.Title>
      <!-- <Dialog.Description class="flex gap-3 max-h-96 overflow-auto"> -->
      <Dialog.Description>
        <el-scrollbar max-height="500px">
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Nama Customer
            </FormLabel>
            <el-select
              v-model="customer"
              class="w-full"
              filterable
              remote
              reserve-keyword
              placeholder="Tuliskan Nama Karyawan ..."
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </div>
        </el-scrollbar>
      </Dialog.Description>
      <Dialog.Footer class="text-right">
        <!-- <Button
          variant="outline-secondary"
          type="button"
          @click="setdialogBooking"
          class="w-32 mr-1">
          Batal
        </Button>
        <Button
          @click="(event: MouseEvent) => {
            event.preventDefault();
            confirmModal = true
          }"
          variant="primary"
          type="button"
          class="w-32"
          ref="createTicketRef">
          Lanjutkan
        </Button> -->
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
