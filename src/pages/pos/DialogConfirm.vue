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
    processTransaction: Boolean,
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
      const response = await fetchWrapper.get("pos/employee-list", { keyword })
      employeeList.value = response?.data as IEmployee[]
      list.value = response.map((item: any) => {
        return {
          value: `${item.employeeCode}`,
          label: `${item.employeeName}`,
        }
      })
    } catch (error) {}
  }

  const createTicketRef = ref(null)

  const setProcessTransaction = () => {
    emit("close", false)
  }

  const confirmModal = ref(false)
  const setConfirmModal = (value: boolean) => {
    confirmModal.value = value
  }

  const updateEmployee = (employeeCode: any, cart: any) => {
    cart.employeeCode = employeeCode
  }

  interface ListItem {
    value: string
    label: string
  }

  const list = ref<ListItem[]>([])
  const options = ref<ListItem[]>([])
  const value = ref<string[]>([])
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
    try {
      const cartData = props?.dataOrder?.carts.map((cart: any) => {
        return {
          employeeCode: cart.employeeCode || "",
          amount: cart.amount,
          itemCode: cart.itemCode,
        }
      })

      const response = await fetchWrapper.put(
        `transaction/${props?.dataOrder?.paymentCode}`,
        { data: cartData }
      )
      toast.success(response.message)
      confirmModal.value = false
      emit("close", false)
      localStorage.removeItem("paymentCreated")

      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      toast.error(error.response?.data.message)
    }
  }

  // watch(
  //   () => props.processTransaction,
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
    :open="props.processTransaction"
    size="lg"
    @close="setProcessTransaction"
    :initialFocus="createTicketRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Konfirmasi Pemesanan</h2>
      </Dialog.Title>
      <!-- <Dialog.Description class="flex gap-3 max-h-96 overflow-auto"> -->
      <Dialog.Description>
        <el-scrollbar max-height="200px">
          <a
            v-for="(cart, index) in props?.dataOrder?.carts"
            :key="index"
            class="intro-x grid items-center gap-3 mb-2 !box max-h-fit p-3 transition duration-300 ease-in-out bg-white rounded-md cursor-pointer dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400">
            <div class="grid grid-cols-2 items-center">
              <div>
                <div class="max-w-[50%] truncate mr-1">
                  {{ cart.itemName }}
                </div>

                <div class="flex gap-2">
                  <div class="text-slate-500">{{ cart.amount }}X</div>
                  <div class="font-medium">
                    Rp. {{ formatCurrency(cart.itemPrice) }}
                  </div>
                </div>
              </div>

              <div v-if="cart.itemType !== 'product'" class="m-2 grid gap-2">
                <el-select
                  v-model="cart.employeeCode"
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
            </div>
          </a>
        </el-scrollbar>
        <!-- <div class="grid gap-2 h-44 overflow-auto"> -->
        <!-- </div> -->
        <div
          class="flex py-4 mt-4"
          style="
            border-top: 1px dashed #00000034;
            border-bottom: 1px dashed #00000034;
          ">
          <table class="w-full text-left">
            <tr>
              <th>Kode Transaksi</th>
              <td>:</td>
              <td>{{ props.dataOrder?.paymentCode }}</td>
            </tr>
            <tr>
              <th>Nama Customer</th>
              <td>:</td>
              <td>{{ props?.dataOrder?.customerName }}</td>
            </tr>
            <tr>
              <th>Tanggal Transaksi</th>
              <td>:</td>
              <td>
                {{
                  formatDate(props.dataOrder?.transactionDate, "DD - MMMM - YY")
                }}
              </td>
            </tr>
          </table>
          <table class="w-full text-left">
            <tr>
              <th>Total Item</th>
              <td>:</td>
              <td>{{ props.metaPrice?.totalItem }}</td>
            </tr>
            <tr>
              <th>Total Point</th>
              <td>:</td>
              <td>{{ props.metaPrice?.totalPoint }}</td>
            </tr>
            <tr>
              <th>Total Tagihan</th>
              <td>:</td>
              <td>Rp. {{ formatCurrency(props.metaPrice?.subtotal) }}</td>
            </tr>
          </table>
        </div>
      </Dialog.Description>
      <Dialog.Footer class="text-right">
        <Button
          variant="outline-secondary"
          type="button"
          @click="setProcessTransaction"
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
        </Button>
      </Dialog.Footer>
      <!-- BEGIN: Overlapping Modal Content -->
      <Dialog
        :open="confirmModal"
        @close="
          () => {
            setConfirmModal(false)
          }
        ">
        <Dialog.Panel>
          <div class="p-5 text-center">
            <Lucide icon="Info" class="w-16 h-16 mx-auto mt-3 text-warning" />
            <div class="mt-5 text-3xl">Apakah Data Sudah Benar ?</div>
          </div>
          <div class="px-5 pb-8 text-center">
            <Button
              type="button"
              variant="outline-secondary"
              @click="
                () => {
                  setConfirmModal(false)
                }
              "
              class="w-24 mr-1">
              Batal
            </Button>
            <Button
              @click="saveData"
              type="button"
              variant="primary"
              class="w-24"
              ref="{deleteButtonRef}">
              Yakin
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      <!-- END: Overlapping Modal Content -->
    </Dialog.Panel>
  </Dialog>
</template>
