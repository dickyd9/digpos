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
  } from "@/_helper/types-api"
  import TomSelect from "@/base-components/TomSelect"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import Litepicker from "@/base-components/Litepicker"
  import { toast } from "vue3-toastify"
  import { WindowScrollController } from "@fullcalendar/vue3"

  const props = defineProps({
    newOrderModal: Boolean,
  })
  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "update"): void
  }>()

  const dateToString = (date: any) => {
    return date.toISOString().split("T")[0]
  }

  const stringToDate = (str: any) => {
    return new Date(str)
  }

  const customerList = ref<ICustomer[]>([])
  const chooseCustomer = reactive<ICreateInvoice>({
    customerCode: "" as string,
  })
  const createCustomer = ref<ICustomerInput>({
    customerDOB: new Date(),
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    customerContact: 0,
    customerGender: "",
  })

  const litePikcerDate = ref("")
  const handleDateChange = (value: any) => {
    createCustomer.value.customerDOB = new Date(value)
  }

  const getData = async () => {
    try {
      const response = await fetchWrapper.get("customer/all")
      customerList.value = response as ICustomer[]
    } catch (error) {}
  }

  watch(
    () => props.newOrderModal,
    (newValue) => {
      if (newValue) {
        setTimeout(() => {
          getData()
        }, 20)
      }
    }
  )

  const tabs = ref([
    {
      title: "Pilih Customer",
      key: "choose",
    },
    {
      title: "Tambah Customer",
      key: "create",
    },
  ])
  const activeTab = ref("choose")
  const createTicketRef = ref(null)

  const setNewOrderModal = () => {
    emit("close", false)
    activeTab.value = "choose"
    chooseCustomer.customerCode = ""
  }

  const saveData = async () => {
    if (activeTab.value === "choose") {
      try {
        const response = await fetchWrapper.post("transaction", chooseCustomer)
        toast.success(response.message)
        emit("close", false)
        localStorage.setItem("paymentCreated", JSON.stringify(response))

        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } catch (error: any) {
        toast.error(error.response?.data.message)
      }
    } else {
      try {
        const customer = await fetchWrapper.post(
          "customer",
          createCustomer.value
        )
        const response = await fetchWrapper.post("transaction", {
          customerCode: customer?.detail?.customerCode,
        })
        toast.success(response.message)
        emit("close", false)
        emit("update")
        localStorage.setItem("paymentCreated", JSON.stringify(response))

        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } catch (error: any) {
        toast.error(error.response?.data.message)
      }
    }
  }
</script>

<template>
  <Dialog
    :open="props.newOrderModal"
    size="lg"
    @close="setNewOrderModal"
    :initialFocus="createTicketRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">New Order</h2>
      </Dialog.Title>
      <!-- <Dialog.Description class="flex gap-3 max-h-96 overflow-auto"> -->
      <Dialog.Description>
        <Tab.Group class="col-span-12 lg:col-span-4">
          <div class="pr-1 intro-y">
            <div class="p-2 box">
              <Tab.List variant="pills">
                <Tab v-for="(tab, index) in tabs" :key="index">
                  <Tab.Button
                    @click="
                      () => {
                        activeTab = tab.key
                      }
                    "
                    as="button"
                    class="w-full py-2">
                    {{ tab.title }}
                  </Tab.Button>
                </Tab>
              </Tab.List>
            </div>
          </div>
          <Tab.Panels>
            <Tab.Panel>
              <div class="my-4 !box">
                <TomSelect
                  v-model="chooseCustomer.customerCode"
                  style="border: 1px !important"
                  :options="{
                    placeholder: 'Select Customer',
                  }"
                  class="w-full">
                  <option
                    :value="customer.customerCode"
                    v-for="(customer, index) in customerList"
                    :key="index">
                    {{ customer.customerName }}
                  </option>
                </TomSelect>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div class="inline-grid grid-cols-2 grid-rows-3 gap-x-6 mt-4">
                <div class="h-fit">
                  <FormLabel htmlFor="pos-form-2">Nama</FormLabel>
                  <FormInput
                    v-model="createCustomer.customerName"
                    id="pos-form-2"
                    type="text"
                    class="flex-1"
                    placeholder="Nama Customer" />
                </div>
                <div class="h-fit">
                  <FormLabel htmlFor="pos-form-3">Email</FormLabel>
                  <FormInput
                    v-model="createCustomer.customerEmail"
                    id="pos-form-3"
                    type="text"
                    class="flex-1"
                    placeholder="Email Customer" />
                </div>
                <div class="h-fit">
                  <FormLabel htmlFor="pos-form-3">No. telpon</FormLabel>
                  <FormInput
                    v-model="createCustomer.customerContact"
                    id="pos-form-3"
                    type="text"
                    class="flex-1"
                    placeholder="No Telpon" />
                </div>
                <div class="h-fit">
                  <FormLabel
                    htmlFor="pos-form-3"
                    placeholder="Select your favorite actors"
                    >Gender</FormLabel
                  >
                  <FormSelect
                    v-model="createCustomer.customerGender"
                    class="w-full">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </FormSelect>
                </div>
                <div class="h-fit">
                  <FormLabel htmlFor="pos-form-3">Tanggal Lahir</FormLabel>
                  <Litepicker
                    v-model="litePikcerDate"
                    :options="{
                      autoApply: false,
                      position: 'top',
                      showWeekNumbers: true,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true,
                      },
                    }"
                    class="block"
                    @update:modelValue="handleDateChange" />
                </div>
                <div class="h-fit">
                  <FormLabel htmlFor="pos-form-3">Alamat</FormLabel>
                  <FormTextarea
                    style="resize: none"
                    id="validation-form-6"
                    v-model="createCustomer.customerAddress"
                    name="comment"
                    placeholder="Alamat" />
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Dialog.Description>
      <Dialog.Footer class="text-right">
        <Button
          variant="outline-secondary"
          type="button"
          @click="setNewOrderModal"
          class="w-32 mr-1">
          Cancel
        </Button>
        <Button
          @click="saveData"
          variant="primary"
          type="button"
          class="w-32"
          ref="createTicketRef">
          Create Invoice
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>

<style>
  .tom-select.ts-wrapper .ts-control {
    border: 1px !important;
  }
</style>
