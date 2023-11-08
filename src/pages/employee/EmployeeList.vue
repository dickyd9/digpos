<script setup lang="ts">
  import { ref, reactive, onMounted } from "vue"
  import _ from "lodash"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import { FormInput, FormSelect } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import { Menu } from "@/base-components/Headless"
  import TableEmployee from "./components/TableEmployee.vue"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import { IEmployee, IEmployeeInput } from "@/_helper/types-api"

  //==== Get Data Start ====\\
  const listData = ref<IEmployee[]>([])
  const pagination = ref<IEmployeeInput>()
  const loading: any = ref(true)
  const params = reactive({
    keyword: "",
    current_page: 1,
    pagesize: 20,
    sort_column: "",
    sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "employeeCode", title: "Kode", isUnique: true, sort: false },
      { field: "employeeName", title: "Nama Karyawan" },
      { field: "employeeAddress", title: "Alamat", sort: false },
      { field: "employeeContact", title: "No. Telpon", type: "number", sort: false },
      { field: "employeeGender", title: "Gender", sort: false },
      { field: "createdAt", title: "Tanggal Dibuat", type: "dateTime" },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("employee", params)

      listData.value = response?.data as IEmployee[]
      pagination.value = response.meta as IEmployeeInput
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

  onMounted(() => {
    setTimeout(() => {
      getData()
    }, 20)
  })
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">List Karyawan</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md"> Add New User </Button>
      <Menu>
        <Menu.Button :as="Button" class="px-2 !box">
          <span class="flex items-center justify-center w-5 h-5">
            <Lucide icon="Plus" class="w-4 h-4" />
          </span>
        </Menu.Button>
        <Menu.Items class="w-40">
          <Menu.Item>
            <Lucide icon="Users" class="w-4 h-4 mr-2" /> Add Group
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="MessageCircle" class="w-4 h-4 mr-2" /> Send Message
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <div class="hidden mx-auto md:block text-slate-500">
        Showing 1 to 10 of 150 entries
      </div>
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
      <TableEmployee
        :dataList="listData"
        :cols="cols"
        :meta="pagination"
        :params="params"
        :loading="loading"
        @update="getParams" />
    </div>
    <!-- BEGIN: Users Layout -->
  </div>
</template>
