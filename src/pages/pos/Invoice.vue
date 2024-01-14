<script lang="ts" setup>
  import { ref } from "vue"

  const props = defineProps({
    recentCart: Array,
  })
</script>
<template>
  <div>
    <!-- <a
      class="intro-x grid items-center gap-3 !box p-3 transition duration-300 ease-in-out bg-white rounded-md cursor-pointer dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400">
      <div class="flex items-center">
        <div
          class="text-slate-500 flex items-center h-10 rounded-lg relative bg-transparent">
          <el-input-number
            v-model="cart.amount"
            :min="action.min"
            :max="action.max"
            :size="action.size" />
        </div>
        <div class="max-w-[50%] truncate ml-4">
          {{ cart.itemName }}
        </div>
        <div class="ml-auto font-medium">
          Rp. {{ formatCurrency(cart.itemPrice) }}
        </div>
        <button class="rounded border ml-2 hover:bg-red-700">
          <Lucide
            @click="clearItem(cart)"
            icon="X"
            class="w-4 h-4 text-slate-500 hover:text-white" />
        </button>
      </div>
    </a> -->
  </div>
</template>
