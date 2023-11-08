<script setup lang="ts">
  import _ from "lodash"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Litepicker from "@/base-components/Litepicker"
  import { FormInline, FormSelect } from "@/base-components/Form"
  import Progress from "@/base-components/Progress"
  import Lucide from "@/base-components/Lucide"
  import StackedBarChart1 from "@/components/StackedBarChart1"
  import SimpleLineChart from "@/components/SimpleLineChart"
  import SimpleLineChart1 from "@/components/SimpleLineChart1"
  import SimpleLineChart2 from "@/components/SimpleLineChart2"
  import { Menu, Tab } from "@/base-components/Headless"
  import { Tab as HeadlessTab } from "@headlessui/vue"
  import { useRoute } from "vue-router"
  import { onMounted, reactive, ref } from "vue"
  import { IEmployee, ITask } from "@/_helper/types-api"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import TableEmployeeReport from "./components/TableEmployeeReport.vue"
  const route = useRoute()

  const employeeCode = route.params?.code
  const employeeData = ref<IEmployee>()
  const date = ref("")

  //==== Get Data Start ====\\
  const listData = ref<ITask[]>([])
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
      { field: "transactionRef", title: "Kode Transaksi" },
      { field: "serviceCode", title: "Kode Jasa" },
      { field: "createdAt", title: "Tanggal Dibuat", type: "dateTime" },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get(`employee/${employeeCode}`)

      employeeData.value = response as IEmployee
      listData.value = response?.report.task as ITask[]
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

  onMounted(async () => {
    setTimeout(() => {
      getData()
    }, 20)
  })
</script>

<template>
  <div class="flex items-center mt-8 intro-y rounded-md bg-white border-b border-slate-200/60 dark:border-darkmode-400">
    <div
      class="flex items-center p-5">
      <h2 class="mr-auto text-lg font-medium">Profile Karyawan</h2>
    </div>
  </div>
  <Tab.Group>
    <!-- BEGIN: Profile Info -->
    <div class="px-5 pt-5 mt-5 intro-y box">
      <div
        class="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
        <div
          class="flex items-center justify-center flex-1 px-5 lg:justify-start">
          <div
            class="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
            <img
              alt="Midone Tailwind HTML Admin Template"
              class="rounded-full"
              src="" />
          </div>
          <div class="ml-5">
            <div
              class="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
              {{ employeeData?.employeeName }}
            </div>
            <div class="text-slate-500">{{ employeeData?.employeeCode }}</div>
          </div>
        </div>
        <div
          class="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0">
          <div class="font-medium text-center lg:text-left lg:mt-3">
            Contact Details
          </div>
          <div
            class="flex flex-col items-center justify-center mt-4 lg:items-start">
            <div class="flex items-center truncate sm:whitespace-normal">
              <Lucide icon="User" class="w-4 h-4 mr-2" />
              {{ employeeData?.employeeGender }}
            </div>
            <div class="flex items-center mt-3 truncate sm:whitespace-normal">
              <Lucide icon="Phone" class="w-4 h-4 mr-2" />
              {{ employeeData?.employeeContact }}
            </div>
            <div class="flex items-center mt-3 truncate sm:whitespace-normal">
              <Lucide icon="Pin" class="w-4 h-4 mr-2" />
              {{ employeeData?.employeeAddress }}
            </div>
          </div>
        </div>
      </div>
      <Tab.List
        variant="link-tabs"
        class="flex-col justify-center text-center sm:flex-row lg:justify-start">
        <Tab :fullWidth="false">
          <Tab.Button class="py-4 cursor-pointer">Report Harian</Tab.Button>
        </Tab>
        <Tab :fullWidth="false">
          <Tab.Button class="py-4 cursor-pointer">Report Bulanan</Tab.Button>
        </Tab>
      </Tab.List>
    </div>
    <!-- END: Profile Info -->
    <Tab.Panels class="mt-5 intro-y">
      <!-- Harian -->
      <Tab.Panel>
        <div class="grid grid-cols-12 gap-6">
          <!-- BEGIN: Top Categories -->
          <div class="col-span-12 intro-y box lg:col-span-12">
            <div
              class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <div class="">
                <FormInline>
                  <FormLabel htmlFor="horizontal-form-1" class="sm:w-20">
                    Tanggal
                  </FormLabel>

                  <Litepicker
                    v-model="date"
                    :options="{
                      autoApply: false,
                      showWeekNumbers: true,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true,
                      },
                    }"
                    class="block w-56 mx-auto" />
                </FormInline>
              </div>
              <Menu class="ml-auto">
                <Menu.Button tag="a" class="block w-5 h-5" href="#">
                  <Lucide
                    icon="MoreHorizontal"
                    class="w-5 h-5 text-slate-500" />
                </Menu.Button>
                <Menu.Items class="w-40">
                  <Menu.Item>
                    <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Add Category
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="Settings" class="w-4 h-4 mr-2" />
                    Settings
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
            <div class="p-5">
              <TableEmployeeReport
                :dataList="listData"
                :cols="cols"
                :loading="loading" />
            </div>
          </div>
          <!-- END: Top Categories -->
        </div>
      </Tab.Panel>

      <!-- Bulanan -->
      <Tab.Panel>
        <div class="grid grid-cols-12 gap-6">
          <!-- BEGIN: Top Categories -->
          <div class="col-span-12 intro-y box lg:col-span-12">
            <div
              class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <div class="flex gap-4">
                <FormInline>
                  <FormLabel htmlFor="horizontal-form-1" class="sm:w-20">
                    Bulan
                  </FormLabel>

                  <FormSelect
                    class="mt-2 sm:mr-2"
                    aria-label="Default select example">
                    <option selected>Pilih Bulan</option>
                    <option>Liam Neeson</option>
                    <option>Daniel Craig</option>
                  </FormSelect>
                </FormInline>

                <FormInline>
                  <FormLabel htmlFor="horizontal-form-1" class="sm:w-20">
                    Tahun
                  </FormLabel>

                  <FormSelect
                    class="mt-2 sm:mr-2"
                    aria-label="Default select example">
                    <option>Pilih Bulan</option>
                    <option>Liam Neeson</option>
                    <option>Daniel Craig</option>
                  </FormSelect>
                </FormInline>
              </div>
              <Menu class="ml-auto">
                <Menu.Button tag="a" class="block w-5 h-5" href="#">
                  <Lucide
                    icon="MoreHorizontal"
                    class="w-5 h-5 text-slate-500" />
                </Menu.Button>
                <Menu.Items class="w-40">
                  <Menu.Item>
                    <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Add Category
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="Settings" class="w-4 h-4 mr-2" />
                    Settings
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
            <div class="p-5">
              <TableEmployeeReport
                :dataList="employeeData?.report?.task"
                :cols="cols"
                :loading="loading" />
            </div>
          </div>
          <!-- END: Top Categories -->
        </div>
      </Tab.Panel>
    </Tab.Panels>
  </Tab.Group>
</template>
