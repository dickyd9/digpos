<script setup lang="ts">
  import { useRoute, useRouter } from "vue-router"
  import Tippy from "../../base-components/Tippy"
  import Lucide from "../../base-components/Lucide"
  import TopBar from "../../components/TopBar"
  import DarkModeSwitcher from "../../components/DarkModeSwitcher"
  import MainColorSwitcher from "../../components/MainColorSwitcher"
  import MobileMenu from "../../components/MobileMenu"
  import { Menu, Tab, Dialog } from "@/base-components/Headless"
  import { useSideMenuStore } from "../../stores/side-menu"
  import {
    ProvideForceActiveMenu,
    forceActiveMenu,
    Route,
    FormattedMenu,
    nestedMenu,
    linkTo,
    enter,
    leave,
  } from "./side-menu"
  import { watch, reactive, ref, computed, onMounted, provide } from "vue"
  import tippy, {
    PopperElement,
    Props,
    roundArrow,
    animateFill as animateFillPlugin,
  } from "tippy.js"

  import DialogNewOrder from "@/pages/pos/DialogNewOrder.vue"
  import { useAuthStore } from "@/stores/api/auth-store"
  import Button from "@/base-components/Button"
  import { toast } from "vue3-toastify"

  const authStore = useAuthStore()

  const newOrderModal = ref(false)
  const setNewOrderModal = (value: boolean) => {
    newOrderModal.value = value
  }
  const updateNewOrderModal = (value: boolean) => {
    newOrderModal.value = value
  }

  const logoutModal = ref(false)
  const setLogout = (value: boolean) => {
    logoutModal.value = value
  }
  const logoutButtonRef = ref(null)

  const route: Route = useRoute()
  const router = useRouter()
  let formattedMenu = reactive<Array<FormattedMenu | "divider">>([])
  const setFormattedMenu = (
    computedFormattedMenu: Array<FormattedMenu | "divider">
  ) => {
    Object.assign(formattedMenu, computedFormattedMenu)
  }
  const sideMenuStore = useSideMenuStore()
  const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route))
  const windowWidth = ref(window.innerWidth)

  provide<ProvideForceActiveMenu>("forceActiveMenu", (pageName: string) => {
    forceActiveMenu(route, pageName)
    setFormattedMenu(sideMenu.value)
  })

  watch(sideMenu, () => {
    setFormattedMenu(sideMenu.value)
  })

  const userData = ref({
    fullname: "",
    role: "" as string | undefined,
  })

  watch(
    computed(() => route.path),
    () => {
      delete route.forceActiveMenu
    }
  )

  onMounted(() => {
    setFormattedMenu(sideMenu.value)

    setTimeout(() => {
      ;(userData.value.fullname = `${authStore?.authUser?.firstName} ${authStore?.authUser?.lastName}`),
        (userData.value.role = authStore?.authUser?.role)
    }, 200)
  })

  const logout = () => {
    logoutModal.value = false
    toast.success("Logout Berhasil", {
      onClose: () => {
        authStore.logout()
      },
    })
  }
</script>

<template>
  <div class="py-5 md:py-0">
    <!-- <DarkModeSwitcher />
    <MainColorSwitcher /> -->
    <MobileMenu />
    <!-- <TopBar layout="side-menu" /> -->
    <div class="flex overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav
        class="side-nav w-[105px] xl:w-[260px] px-5 pb-16 overflow-x-hidden z-50 pt-12 -mt-4 hidden md:block">
        <ul>
          <li
            class="border border-zinc-400 rounded-lg flex align-center gap-4 items-center font-semibold mb-6 py-2 px-4">
            <div class="grow grid">
              <div class="font-medium text-lg">{{ userData.fullname }}</div>
              <div class="text-xs mt-0.5">{{ userData.role }}</div>
            </div>

            <div class="grow-0 rounded-full shadow-sm p-2">
              <Tippy
                @click="
                  () => {
                    logoutModal = true
                  }
                "
                variant="primary"
                content="Logout">
                <Lucide icon="LogOut" class="w-4 h-4" />
              </Tippy>
            </div>
          </li>

          <li
            @click="setNewOrderModal(true)"
            class="flex gap-4 cursor-pointer shadow-md items-center text-white font-semibold hover:bg-opacity-90 p-4 mb-2 bg-primary rounded-lg">
            <Lucide icon="Plus" />
            <p class="sm:none">New Order</p>
          </li>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <li
              v-if="menu == 'divider'"
              type="li"
              :class="[
                'side-nav__divider my-6',

                // Animation
                `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${
                  (menuKey + 1) * 10
                }`,
              ]"
              :key="'divider-' + menuKey"></li>
            <li v-else :key="menuKey">
              <Tippy
                as="a"
                :content="menu.title"
                :options="{
                  placement: 'right',
                }"
                :disable="windowWidth > 1260"
                :href="
                  menu.subMenu
                    ? '#'
                    : ((pageName: string | undefined) => {
                        try {
                          return router.resolve({
                            name: pageName,
                          }).fullPath;
                        } catch (err) {
                          return '';
                        }
                      })(menu.pageName)
                "
                @click="(event: MouseEvent) => {
                  event.preventDefault();
                  linkTo(menu, router);
                  setFormattedMenu([...formattedMenu]);
                }"
                :class="[
                  menu.active ? 'side-menu side-menu--active' : 'side-menu',

                  // Animation
                  {
                    [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                      (menuKey + 1) * 10
                    }`]: !menu.active,
                  },
                ]">
                <div class="side-menu__icon">
                  <Lucide :icon="menu.icon" />
                </div>
                <div class="side-menu__title">
                  {{ menu.title }}
                  <div
                    v-if="menu.subMenu"
                    :class="[
                      'side-menu__sub-icon',
                      { 'transform rotate-180': menu.activeDropdown },
                    ]">
                    <Lucide icon="ChevronDown" />
                  </div>
                </div>
              </Tippy>
              <Transition @enter="enter" @leave="leave">
                <ul
                  v-if="menu.subMenu && menu.activeDropdown"
                  :class="{ 'side-menu__sub-open': menu.activeDropdown }">
                  <li
                    v-for="(subMenu, subMenuKey) in menu.subMenu"
                    :key="subMenuKey">
                    <Tippy
                      as="a"
                      :content="subMenu.title"
                      :options="{
                        placement: 'right',
                      }"
                      :disable="windowWidth > 1260"
                      :href="
                        subMenu.subMenu
                          ? '#'
                          : ((pageName: string | undefined) => {
                              try {
                                return router.resolve({
                                  name: pageName,
                                }).fullPath;
                              } catch (err) {
                                return '';
                              }
                            })(subMenu.pageName)
                      "
                      :class="[
                        subMenu.active
                          ? 'side-menu side-menu--active'
                          : 'side-menu',

                        // Animation
                        {
                          [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                            (subMenuKey + 1) * 10
                          }`]: !subMenu.active,
                        },
                      ]"
                      @click="(event: MouseEvent) => {
                        event.preventDefault();
                        linkTo(subMenu, router);
                        setFormattedMenu([...formattedMenu]);
                      }">
                      <div class="side-menu__icon">
                        <Lucide :icon="subMenu.icon" />
                      </div>
                      <div class="side-menu__title">
                        {{ subMenu.title }}
                        <div
                          v-if="subMenu.subMenu"
                          :class="[
                            'side-menu__sub-icon',
                            {
                              'transform rotate-180': subMenu.activeDropdown,
                            },
                          ]">
                          <Lucide icon="ChevronDown" />
                        </div>
                      </div>
                    </Tippy>
                    <Transition
                      @enter="enter"
                      @leave="leave"
                      v-if="subMenu.subMenu">
                      <ul
                        v-if="subMenu.subMenu && subMenu.activeDropdown"
                        :class="{
                          'side-menu__sub-open': subMenu.activeDropdown,
                        }">
                        <li
                          v-for="(
                            lastSubMenu, lastSubMenuKey
                          ) in subMenu.subMenu"
                          :key="lastSubMenuKey">
                          <Tippy
                            as="a"
                            :content="lastSubMenu.title"
                            :options="{
                              placement: 'right',
                            }"
                            :disable="windowWidth > 1260"
                            :href="
                              lastSubMenu.subMenu
                                ? '#'
                                : ((pageName: string | undefined) => {
                                    try {
                                      return router.resolve({
                                        name: pageName,
                                      }).fullPath;
                                    } catch (err) {
                                      return '';
                                    }
                                  })(lastSubMenu.pageName)
                            "
                            :class="[
                              lastSubMenu.active
                                ? 'side-menu side-menu--active'
                                : 'side-menu',

                              // Animation
                              {
                                [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                  (lastSubMenuKey + 1) * 10
                                }`]: !lastSubMenu.active,
                              },
                            ]"
                            @click="(event: MouseEvent) => {
                              event.preventDefault();
                              linkTo(lastSubMenu, router);
                              setFormattedMenu([...formattedMenu]);
                            }">
                            <div class="side-menu__icon">
                              <Lucide :icon="lastSubMenu.icon" />
                            </div>
                            <div class="side-menu__title">
                              {{ lastSubMenu.title }}
                            </div>
                          </Tippy>
                        </li>
                      </ul>
                    </Transition>
                  </li>
                </ul>
              </Transition>
            </li>
          </template>
          <!-- END: First Child -->
        </ul>
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div
        :class="[
          'max-h-screen overflow-auto max-w-full md:max-w-none rounded-[30px] md:rounded-none px-4 md:px-[22px] min-w-0 min-h-screen bg-slate-100 flex-1 pb-10 relative dark:bg-darkmode-700',
          'before:content-[\'\'] before:w-full before:h-px before:block',
        ]">
        <RouterView />
      </div>
      <!-- END: Content -->
    </div>

    <DialogNewOrder
      :newOrderModal="newOrderModal"
      @close="updateNewOrderModal" />

    <Dialog
      :open="logoutModal"
      @close="
        () => {
          setLogout(false)
        }
      "
      :initialFocus="logoutButtonRef">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="Info" class="w-16 h-16 mx-auto mt-3 text-warning" />
          <div class="mt-5 text-3xl">Apakah anda yakin ?</div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button
            variant="outline-secondary"
            type="button"
            @click="
              () => {
                setLogout(false)
              }
            "
            class="w-24 mr-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            class="w-24"
            @click="logout"
            ref="logoutButtonRef">
            Logout
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  </div>
</template>
