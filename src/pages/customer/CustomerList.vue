<script setup lang="ts">
  import _ from "lodash"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import { FormInput, FormSelect } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import Table from "@/base-components/Table"
  import { Menu } from "@/base-components/Headless"
  import TableCustomer from "./components/TableCustomer.vue"
  import { ref, reactive, onMounted } from "vue"
  import { ICustomer, IPaginate } from "@/_helper/types-api"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import DialogCustomer from "./components/DialogCustomer.vue"

  //==== Get Data Start ====\\
  const listData = ref<ICustomer[]>([])
  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const params = reactive({
    keyword: "",
    current_page: 1,
    pagesize: 20,
    sort_column: "id",
    sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "customerCode", title: "Kode", isUnique: true, sort: false },
      { field: "customerName", title: "Nama Customer" },
      {
        field: "customerDOB",
        title: "Tanggal Lahir",
        type: "dateTime",
        sort: false,
      },
      { field: "customerAddress", title: "Alamat Customer", sort: false },
      { field: "customerEmail", title: "Email Customer", sort: false },
      { field: "customerGender", title: "Gender", sort: false },
      { field: "customerContact", title: "No. Telpon", sort: false },
      { field: "createdAt", title: "Tanggal Dibuat", type: "dateTime" },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("customer", params)

      listData.value = response?.data as ICustomer[]
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

  // Dialog Start
  const dialog = ref(false)
  // Dialog End

  onMounted(() => {
    setTimeout(() => {
      getData()
    }, 20)
  })
  //==== Get Data End ====\\
</script>

<template>
  <div class="flex justify-between items-center mt-10 p-4 rounded-md bg-white">
    <h2 class="text-lg font-medium intro-y">List Customer</h2>
    <div class="flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap">
      <Button @click="dialog = true" variant="primary" class="mr-2 shadow-md">
        Add New Customer
      </Button>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <FormInput
            type="text"
            class="w-56 pr-10 !box"
            placeholder="Search..." />
          <Lucide
            icon="Search"
            class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
    </div>
    <!-- BEGIN: Users Layout -->
    <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
      <TableCustomer
        :dataList="listData"
        :cols="cols"
        :meta="pagination"
        :params="params"
        :loading="loading"
        @update="getParams" />
    </div>
    <!-- BEGIN: Users Layout -->

    <!-- BEGIN: Dialog Customer -->
    <DialogCustomer
      :modalPreview="dialog"
      @close="dialog = false"
      @update="
        () => {
          dialog = false
          getData()
        }
      " />
    <!-- END: Dialog Customer -->
  </div>
</template>
