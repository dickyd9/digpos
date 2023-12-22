<script setup lang="ts">
  import _ from "lodash"
  import { onMounted, reactive, ref } from "vue"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import { FormInput, FormSelect } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import Tippy from "@/base-components/Tippy"
  import { Dialog, Menu } from "@/base-components/Headless"
  import Table from "@/base-components/Table"
  import { formatCurrency } from "@/utils/helper"
  import { IPaginate, IService } from "@/_helper/types-api"
  import { useServiceStore } from "@/stores/api/service-store"
  import { useAuthStore } from "@/stores/api/auth-store"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import TableService from "./TableService.vue"
  import DialogService from "./DialogService.vue"

  //==== Get Data Start ====\\
  const listService = ref<IService[]>([])
  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const params = reactive({
    keyword: '',
    current_page: 1,
    pagesize: 20,
    sort_column: "id",
    sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "servicesCode", title: "Kode", isUnique: true, sort: false },
      { field: "servicesName", title: "Nama Service" },
      { field: "servicesPrice", title: "Harga", type: "price" },
      { field: "servicesCategory", title: "Kategori" },
      { field: "servicesPoint", title: "Status", sort: false },
      { field: "createdAt", title: "Tanggal Dibuat", type: "dateTime" },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("services", params)

      listService.value = response?.data as IService[]
      pagination.value = response.meta as IPaginate
    } catch {}

    loading.value = false
  }

  const getParams = (data: any) => {
    params.current_page = data.current_page
    params.pagesize = data.pagesize
    params.sort_column = data.sort_column
    params.sort_direction = data.sort_direction

    getData()
  }
  //==== Get Data End ====\\

  // Dialog Start
  const dialog = ref(false)
  // Dialog End

  onMounted(() => {
    setTimeout(() => {
      getData()
    }, 20)
  })

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value
  }
  const deleteButtonRef = ref(null)
</script>

<template>
  <div class="flex justify-between items-center mt-10 p-4 rounded-md bg-white">
    <h2 class="text-lg font-medium intro-y">Service List</h2>
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button @click="dialog = true" variant="primary" class="mr-2 shadow-md">
        Add New Product
      </Button>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex justify-between flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <FormInput
            v-model="params.keyword"
            type="text"
            class="w-56 pr-10 !box"
            placeholder="Search..." />
          <Lucide
            icon="Search"
            class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
      <TableService
        :dataList="listService"
        :cols="cols"
        :meta="pagination"
        :params="params"
        :loading="loading"
        @update="getParams" />
    </div>
    <!-- END: Data List -->
  </div>
  <!-- BEGIN: Dialog Add Data -->
  <DialogService
    :modalPreview="dialog"
    @close="dialog = false"
    @update="() => {
      dialog = false
      getData()
    }" />
  <!-- END: Dialog Add Data -->

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
