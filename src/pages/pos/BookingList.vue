<script setup lang="ts">
  import _ from "lodash"
  import { ref, reactive, onMounted } from "vue"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import {
    FormCheck,
    FormInput,
    FormSelect,
    FormInline,
    FormLabel,
  } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import { Dialog, Menu } from "@/base-components/Headless"
  import Table from "@/base-components/Table"
  import ReportPieChart from "@/components/ReportPieChart"
  import { IBookingList, IPaginate } from "@/_helper/types-api"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import TableBooking from "./components/TableBooking.vue"
  import DialogBooking from "./components/DialogBooking.vue"

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value
  }
  const deleteButtonRef = ref(null)

  const booking = ref(false)
  const setDialogBooking = (value: boolean) => {
    booking.value = value
  }

  //==== Get Data Start ====\\
  const listBooking = ref<IBookingList[]>([])
  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const date = new Date()
  const params = reactive({
    // type: "Bulanan",
    // month: date.getUTCMonth() + 1,
    // year: date.getUTCFullYear(),
    // page: 1,
    // limit: 20,
    // sort_column: "id",
    // sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "customerData.customerName", title: "Nama Pelanggan" },
      { field: "item", title: "Jumlah Item" },
      { field: "status", title: "Status" },
      { field: "createdAt", title: "Tanggal Booking", type: "dateTime" },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("transaction/booking", params)
      listBooking.value = response.data as IBookingList[]
      pagination.value = response.meta as IPaginate
    } catch {}

    loading.value = false
  }

  const getParams = (data: any) => {
    // params.page = data.current_page
    // params.month = data.month
    // params.year = data.year
    // params.limit = data.pagesize
    // params.sort_column = data.sort_column
    // params.sort_direction = data.sort_direction
    getData()
  }
  //==== Get Data End ====\\

  // Filter
  const filterMonth = ref(null)
  const filterEvent = (data: any) => {
    const currentDate = data
    // params.month = currentDate?.getMonth() + 1
    // params.year = currentDate?.getFullYear()
    getParams(params)
  }
  const datePickerSize = ref("large")

  onMounted(() => {
    setTimeout(() => {
      getData()
    }, 20)
  })
</script>

<template>
  <div
    class="flex justify-between items-center mt-10 p-4 rounded-md intro-y bg-white">
    <h2 class="text-lg font-medium intro-y">Booking List</h2>

    <div class="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
      <Button
        @click="
          () => {
            setDialogBooking(true)
          }
        "
        variant="primary"
        type="button"
        class="w-24 mr-1">
        Create Booking
      </Button>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Transaction Table -->
    <div class="col-span-12 sm:col-span-6 lg:col-span-12">
      <div class="p-5 mt-5 intro-y box">
        <TableBooking
          :dataList="listBooking"
          :cols="cols"
          :meta="pagination"
          :params="params"
          :loading="loading"
          @update="getParams" />
      </div>
    </div>
    <!-- END: Weekly Transaction Table -->
  </div>
  <DialogBooking
    :dialogBooking="booking"
    @close="
      () => {
        setDialogBooking(false)
      }
    " />
  <!-- BEGIN: Delete Confirmation Modal -->
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
  <!-- END: Delete Confirmation Modal -->
</template>
