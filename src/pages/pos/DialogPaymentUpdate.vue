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
  import DialogInvoice from "./DialogInvoice.vue"

  const props = defineProps({
    updateModal: Boolean,
    dataPayment: Object,
  })

  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "update"): void
  }>()

  const employeeList = ref<IEmployee[]>([])
  const chooseEmployee = ref([])
  const getData = async () => {
    try {
      const response = await fetchWrapper.get("employee")
      employeeList.value = response?.data as IEmployee[]
    } catch (error) {}
  }

  const createTicketRef = ref(null)

  const setProcessTransaction = () => {
    emit("close", false)
  }

  const invoiceModal = ref(false)
  const setInvoiceModal = (value: boolean) => {
    invoiceModal.value = value
  }

  const confirmModal = ref(false)
  const setConfirmModal = (value: boolean) => {
    confirmModal.value = value
  }

  const paymentMethod = ref("CASH")
  const paymentInput = ref(false)
  const updatePayment = reactive({
    paymentMethod: "",
    paymentPrice: 0,
  })

  const updatePaymentInput = (value: any) => {
    if (value === "CASH") {
      paymentInput.value = false
    } else {
      paymentInput.value = true
    }
  }

  const saveData = async () => {
    try {
      if (!paymentInput.value && updatePayment.paymentPrice === 0) {
        toast.error("Nominal Tidak Boleh 0")
      } else {
        const response = await fetchWrapper.patch(
          `transaction/updatePaymentStatus/${props?.dataPayment?.paymentCode}`,
          updatePayment
        )
        toast.success(response.message)
        confirmModal.value = false
        emit("close", false)
        
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error: any) {
      toast.error(error.response?.data.message)
    }
  }

  watch(
    () => props.updateModal,
    (newValue) => {
      if (newValue) {
        setTimeout(() => {
          getData()
        }, 20)
      }
    }
  )
</script>

<template>
  <Dialog
    :open="props.updateModal"
    size="md"
    @close="setProcessTransaction"
    :initialFocus="createTicketRef">
    <Dialog.Panel>
      <Dialog.Title class="flex justify-between">
        <div class="grid">
          <h2 style="font-size: 1.2rem" class="mr-auto text-base font-medium">
            Pembayaran
          </h2>
          <p style="font-size: 0.7rem">
            ORDER #{{ props?.dataPayment?.paymentCode }}
          </p>
        </div>
        <Button
          @click="setInvoiceModal(true)"
          type="button"
          variant="primary"
          class="w-fit">
          Lihat Invoice
        </Button>
      </Dialog.Title>
      <!-- <Dialog.Description class="flex gap-3 max-h-96 overflow-auto"> -->
      <Dialog.Description>
        <div class="grid gap-6">
          <!--  -->
          <div class="grid gap-3">
            <div class="h-full">
              <FormLabel htmlFor="pos-form-2">Metode Pembayaran</FormLabel>
              <FormSelect
                v-model="updatePayment.paymentMethod"
                @update:modelValue="updatePaymentInput"
                class="mt-3 !box sm:mt-0">
                <option value="CASH">Cash</option>
                <option value="DEBIT">Debit</option>
              </FormSelect>
            </div>
            <div class="h-full">
              <FormLabel htmlFor="pos-form-2">Nominal Pembayaran</FormLabel>
              <InputGroup>
                <InputGroup.Text id="input-group-email"> Rp. </InputGroup.Text>
                <FormInput
                  id="regular-form-5"
                  type="number"
                  v-model="updatePayment.paymentPrice"
                  :disabled="paymentInput"
                  class="flex-1 mt-3 sm:mt-0"
                  placeholder="Masukkan Nominal Pembayaran" />
              </InputGroup>
            </div>
          </div>
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
      <!-- BEGIN: Invoice -->
      <DialogInvoice
        :invoiceModal="invoiceModal"
        :dataPayment="props.dataPayment"
        @close="invoiceModal = false" />
      <!-- END: Invoice -->

      <!-- BEGIN: Confirm -->
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
      <!-- END: Confirm -->
    </Dialog.Panel>
  </Dialog>
</template>
