<template>
  <div class="sticky-table">
    <vue3-datatable
      :rows="props.dataList"
      :columns="props.cols"
      :loading="props.loading"
      :stickyFirstColumn="true"
      :stickyHeader="true"
      :height="'200px'"
      :pagination="false"
      firstArrow="First"
      lastArrow="Last"
      previousArrow="Prev"
      nextArrow="Next"
      :showNumbersCount="3"
      class="alt-pagination">
      <template #createdAt="data">
        <strong>{{ formatDate(data.value.createdAt, "DD-MM-YYYY") }}</strong>
      </template>
    </vue3-datatable>
  </div>
</template>
<script setup lang="ts">
  import router from "@/router"
  import { formatCurrency, formatDate } from "@/utils/helper"

  const props = defineProps({
    dataList: Array,
    cols: Array,
    meta: Object,
    params: Object,
    loading: Boolean,
  })

  const emit = defineEmits<{
    (e: "update", value: any): void
  }>()

  const changePagination = (data: any) => {
    emit("update", data)
  }

  const rowClick = (data: any) => {
    // router.push(`/detail-employee/${data.employeeCode}`)
  }
</script>
<style>
  .sticky-table .bh-table-responsive table thead tr th {
    @apply whitespace-nowrap;
  }
  .sticky-table .bh-table-responsive table tbody tr td {
    @apply lg:whitespace-nowrap;
  }

  /* alt-pagination */
  .alt-pagination .bh-pagination .bh-page-item {
    @apply !w-max min-w-[32px] !rounded;
  }

  /* next-prev-pagination */
  .next-prev-pagination .bh-pagination .bh-page-item {
    @apply !w-max min-w-[100px] !rounded;
  }
  .next-prev-pagination .bh-pagination > div:first-child {
    @apply flex-col font-semibold;
  }
  .next-prev-pagination .bh-pagination .bh-pagination-number {
    @apply mx-auto gap-3;
  }
</style>
