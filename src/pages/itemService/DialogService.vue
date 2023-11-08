<script setup lang="ts">
  import { ref, defineProps, toRefs, reactive } from "vue"
  import {
    FormLabel,
    FormSwitch,
    FormInput,
    FormSelect,
  } from "@/base-components/Form"
  import { Menu, Dialog } from "@/base-components/Headless"
  import Button from "@/base-components/Button"
  import Lucide from "@/base-components/Lucide"
  import {
    required,
    minLength,
    maxLength,
    email,
    url,
    integer,
    numeric,
    requiredIf,
  } from "@vuelidate/validators"
  import { useVuelidate } from "@vuelidate/core"
  import { IService, IServiceInput } from "@/_helper/types-api"
  import { toast } from "vue3-toastify"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"

  const props = defineProps({
    modalPreview: Boolean,
  })

  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "update"): void
  }>()

  const formData = reactive<IServiceInput>({
    itemName: "",
    itemType: "service",
    itemPrice: 0,
    itemPoint: 0,
    itemStatus: "",
    createdAt: new Date(),
  })

  const initialFormData = { ...formData }

  const rules = {
    itemName: {
      required,
    },
    itemPrice: {
      required,
      numeric,
    },
    itemPoint: {
      integer,
    },
    itemStatus: {
      required,
    },
  }

  const closeModal = () => {
    validate.value.$reset()
    Object.assign(formData, initialFormData)
    emit("close", false)
  }

  const validate = useVuelidate(rules, toRefs(formData))
  const onSubmit = async () => {
    validate.value.$touch()
    if (validate.value.$invalid) {
      toast.error("error")
    } else {
      try {
        const response = await fetchWrapper.post("item", formData)
        toast.success(response.status)
        validate.value.$reset()
        emit("update")
        Object.assign(formData, initialFormData)
      } catch (error: any) {
        toast.error(error.response?.data.message)
      }
    }
  }

  const sendButtonRef = ref(null)
</script>

<template>
  <Dialog
    :open="props.modalPreview"
    @close="closeModal"
    :initialFocus="sendButtonRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Add Service</h2>
      </Dialog.Title>
      <Dialog.Description>
        <form class="validate-form grid gap-4" @submit.prevent="onSubmit">
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Nama Service
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.itemName.$model"
              type="text"
              name="itemName"
              :class="{
                'border-danger': validate.itemName.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.itemName.$error">
              <div
                v-for="(error, index) in validate.itemName.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Harga
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.itemPrice.$model"
              type="number"
              name="itemPrice"
              :class="{
                'border-danger': validate.itemPrice.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.itemPrice.$error">
              <div
                v-for="(error, index) in validate.itemPrice.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Poin
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.itemPoint.$model"
              type="number"
              name="itemPoint"
              :class="{
                'border-danger': validate.itemPoint.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.itemPoint.$error">
              <div
                v-for="(error, index) in validate.itemPoint.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Status
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormSelect
              v-model.trim="validate.itemStatus.$model"
              :class="{
                'border-danger': validate.itemStatus.$error,
              }"
              placeholder="Select ..."
              id="category">
              <option
                v-for="(item, key) in ['', 'open', 'close']"
                :key="key"
                :value="item">
                {{ item }}
              </option>
            </FormSelect>
            <template v-if="validate.itemStatus.$error">
              <div
                v-for="(error, index) in validate.itemStatus.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <Button variant="primary" type="submit" class="mt-5"> Save </Button>
        </form>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
