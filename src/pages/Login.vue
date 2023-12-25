<script setup lang="ts">
  import DarkModeSwitcher from "@/components/DarkModeSwitcher"
  import MainColorSwitcher from "@/components/MainColorSwitcher"
  import logoUrl from "@/assets/images/logo.svg"
  import illustrationUrl from "@/assets/images/illustration.svg"
  import { FormInput, FormPassword, FormCheck } from "@/base-components/Form"
  import Button from "@/base-components/Button"
  import { useAuthStore } from "@/stores/api/auth-store"
  import { ILoginInput } from "@/_helper/types-api"
  import Toastify from "toastify-js"
  import { toast } from "vue3-toastify"
  import { Menu, Tab } from "@/base-components/Headless"
  import LoadingIcon from "@/base-components/LoadingIcon"
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
  import { reactive, ref, toRefs } from "vue"

  const authStore = useAuthStore()

  const formData = reactive<ILoginInput>({
    username: "",
    password: "",
  })

  const initialFormData = { ...formData }

  const rules = {
    username: {
      required,
    },
    password: {
      required,
    },
  }
  const loading = ref(false)
  const validate = useVuelidate(rules, toRefs(formData))
  const loginAct = async () => {
    loading.value = true
    validate.value.$touch()
    if (validate.value.$invalid) {
      setTimeout(() => {
        loading.value = false
      }, 50)
      await toast.error("Terjadi Kesalahan")
    } else {
      try {
        await authStore.login(formData)
        loading.value = false
      } catch (error) {}
    }
  }
</script>

<template>
  <div class="h-screen">
    <!-- <DarkModeSwitcher />
    <MainColorSwitcher /> -->
    <div class="container w-1/4 flex h-full justify-center">
      <div class="self-center p-4 !box my-6">
        <form
          @submit.prevent="loginAct"
          class="validate-form w-full px-5 py-8 mx-auto bg-white rounded-md shadow-md dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-10 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-max">
          <h2
            class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
            Sign In
          </h2>
          <div class="mt-8 intro-x">
            <div class="input-form mb-4">
              <FormInput
                v-model.trim="validate.username.$model"
                type="text"
                class="block px-4 pt-3 intro-x login__input min-w-full xl:min-w-[350px]"
                name="username"
                :class="{
                  'border-danger': validate.username.$error,
                }"
                placeholder="Username" />
              <template v-if="validate.username.$error">
                <div
                  v-for="(error, index) in validate.username.$errors"
                  :key="index"
                  class="mt-1 text-danger">
                  {{ error.$message }}
                </div>
              </template>
            </div>
            <div class="input-form">
              <FormInput
                v-model.trim="validate.password.$model"
                type="password"
                class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Password"
                name="password"
                :class="{
                  'border-danger': validate.password.$error,
                }" />
              <template v-if="validate.password.$error">
                <div
                  v-for="(error, index) in validate.password.$errors"
                  :key="index"
                  class="mt-1 text-danger">
                  {{ error.$message }}
                </div>
              </template>
            </div>
          </div>
          <!-- <div
            class="flex justify-end mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
            <a href="">Forgot Password?</a>
          </div> -->
          <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
            <Button
              variant="primary"
              class="w-full px-4 py-3 align-top xl:w-full xl:mr-3">
              {{ loading ? "" : "Login" }}
              <LoadingIcon
                v-if="loading"
                icon="puff"
                color="white"
                class="w-4 h-4 ml-2" />
            </Button>
          </div>
          <!-- <div
            class="mt-10 text-center intro-x xl:mt-10 text-slate-600 dark:text-slate-500 xl:text-left">
            By signin up, you agree to our
            <a class="text-primary dark:text-slate-200" href="">
              Terms and Conditions
            </a>
            &
            <a class="text-primary dark:text-slate-200" href="">
              Privacy Policy
            </a>
          </div> -->
        </form>
        <!-- BEGIN: Login Form -->
        <!-- <div class="!box flex h-screen py-5 my-5 xl:h-auto xl:py-0 xl:my-5">
          <div
            class="w-full px-5 py-8 mx-auto bg-white rounded-md shadow-md dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-10 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-max">
            <h2
              class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
              Sign In
            </h2>
            <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">
              A few more clicks to sign in to your account. Manage all your
              e-commerce accounts in one place
            </div>
            <div class="mt-8 intro-x">
              <FormInput
                v-model="formData.username"
                type="text"
                class="block px-4 py-3 mb-4 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Username" />
              <FormInput
                v-model="formData.password"
                type="password"
                class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Password" />
            </div>
            <div
              class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
              <div class="flex items-center mr-auto">
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  class="mr-2 border" />
                <label class="cursor-pointer select-none" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <a href="">Forgot Password?</a>
            </div>
            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <Button
                @click="loginAct"
                variant="primary"
                class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                Login
              </Button>
              <Button
                variant="outline-secondary"
                class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0">
                Register
              </Button>
            </div>
            <div
              class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
              By signin up, you agree to our
              <a class="text-primary dark:text-slate-200" href="">
                Terms and Conditions
              </a>
              &
              <a class="text-primary dark:text-slate-200" href="">
                Privacy Policy
              </a>
            </div>
          </div>
        </div> -->
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>
