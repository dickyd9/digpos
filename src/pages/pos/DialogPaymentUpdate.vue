<script lang="ts" setup>
  import { onMounted, reactive, ref, watch } from "vue"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import {
    FormInput,
    FormLabel,
    FormSelect,
    FormTextarea,
    InputGroup,
  } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import { Menu, Tab, Dialog } from "@/base-components/Headless"
  import {
    ICreateInvoice,
    ICustomer,
    ICustomerInput,
    IEmployee,
  } from "@/_helper/types-api"
  import TomSelect from "@/base-components/TomSelect"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import Litepicker from "@/base-components/Litepicker"
  import { toast } from "vue3-toastify"
  import {
    WindowScrollController,
    getClippingParents,
  } from "@fullcalendar/vue3"
  import { formatCurrency, formatDate } from "@/utils/helper"
  import DialogInvoice from "./DialogInvoice.vue"
  import Invoice from "./Invoice.vue"
  import { useRoute, useRouter } from "vue-router"

  const router = useRouter()
  const props = defineProps({
    updateModal: Boolean,
    dataPayment: Object,
  })

  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "update"): void
  }>()

  const employeeList = ref<IEmployee[]>([])
  const chooseEmployee = ref([])
  const getData = async () => {
    try {
      const response = await fetchWrapper.get("employee")
      employeeList.value = response?.data as IEmployee[]
    } catch (error) {}
  }

  const createTicketRef = ref(null)

  const setProcessTransaction = () => {
    emit("close", false)
  }

  const invoiceModal = ref(false)
  const setInvoiceModal = (value: boolean) => {
    invoiceModal.value = value
  }

  const confirmModal = ref(false)
  const setConfirmModal = (value: boolean) => {
    confirmModal.value = value
  }

  const paymentMethod = ref("CASH")
  const paymentInput = ref(false)
  const updatePayment = reactive({
    paymentMethod: "",
    paymentPrice: 0,
  })

  const updatePaymentInput = (value: any) => {
    if (value === "CASH") {
      paymentInput.value = false
    } else {
      paymentInput.value = true
    }
  }

  import pdfMake from "pdfmake/build/pdfmake"
  import pdfFonts from "pdfmake/build/vfs_fonts"
  ;(<any>pdfMake).addVirtualFileSystem(pdfFonts)

  const onGenPDF = async (data: any) => {
    try {
      console.log(data)
      const items = data?.items
      const bodyContent: Object[] = []

      if (items && items.length > 0) {
        items.forEach((item: any, index: any) => {
          const { itemName, itemPrice, itemAmount, totalPrice } = item

          const total = itemPrice * itemAmount

          bodyContent.push([
            {
              stack: [
                itemName,
                {
                  text:
                    itemAmount +
                    " x " +
                    (itemPrice ? "Rp. " + formatCurrency(itemPrice) : "Rp. 0"),
                },
              ],
              margin: [6, 2, 0, 3],
            },
            {
              stack: [
                " ",
                {
                  text: "Rp. " + formatCurrency(totalPrice),
                  alignment: "right",
                  margin: [0, 2, 6, 3],
                },
              ],
            },
          ])
        })
      }

      const docDefinition = {
        content: [
          {
            layout: "noBorders",
            table: {
              widths: ["100%"],
              body: [
                [
                  {
                    text: "Nova Beauty Salon & Spa",
                    fontSize: 12,
                    bold: true,
                    alignment: "center",
                    border: [false, false, false, true],
                    margin: [0, 0, 0, -3],
                  },
                ],
              ],
            },
          },
          // Alamat
          {
            stack: [
              {
                text: "Jl. Raya Cangkudu - Cisoka, Cibugel, Kec. Cisoka, Kab. Tangerang, Banten - 15730 ",
                fontSize: 7,
                alignment: "center",
                margin: [3, 1, 3, -1],
              },
              {
                text: "+62 813-8647-0818",
                fontSize: 6,
                alignment: "center",
                margin: [3, 1, 3, 3],
              },
            ],
          },

          // Spacing
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 800,
                y2: 0,
                dash: { length: 2, space: 1 },
                lineWidth: 0.2,
              },
            ],
          },

          // Invoice
          {
            layout: "noBorders",
            fontSize: 8,
            table: {
              widths: ["*", "*"],
              body: [
                [
                  { text: "Nama Pelanggan", bold: true, margin: [6, 0, 0, 0] },
                  {
                    text: data?.customerName,
                    alignment: "right",
                    margin: [0, 0, 6, 0],
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            fontSize: 8,
            table: {
              widths: ["*", "65%"],
              body: [
                [
                  {
                    text: "No. Invoice",
                    bold: true,
                    border: [false, true, false, false],
                    margin: [6, -3, 0, 0],
                  },
                  {
                    text: "#" + data?.invoice,
                    alignment: "right",
                    border: [false, true, false, false],
                    margin: [0, -3, 6, 0],
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            fontSize: 8,
            table: {
              widths: ["*", "65%"],
              body: [
                [
                  { text: "Tanggal", bold: true, margin: [6, -3, 0, 2] },
                  {
                    text: formatDate(data?.paymentDate, "DD MMMM YYYY"),
                    alignment: "right",
                    margin: [0, -3, 6, 0],
                  },
                ],
              ],
            },
          },

          // Spacing
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 800,
                y2: 0,
                dash: { length: 2, space: 1 },
                lineWidth: 0.2,
              },
            ],
          },

          // service
          {
            fontSize: 8,
            layout: "noBorders",
            table: {
              headerRows: 1,
              widths: ["50%", "*"],
              body: [...bodyContent.map((item) => Object.values(item))],
            },
          },

          // Spacing
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 800,
                y2: 0,
                dash: { length: 2, space: 1 },
                lineWidth: 0.2,
              },
            ],
          },

          // Meta Price
          {
            fontSize: 8,
            layout: "noBorders",
            table: {
              headerRows: 1,
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: "Metode :",
                    bold: true,
                    alignment: "left",
                    margin: [6, 0, 0, -2],
                  },
                  {
                    text: data?.paymentMethod,
                    alignment: "right",
                    margin: [0, 0, 6, -2],
                  },
                ],
                [
                  {
                    text: "Total Qty:",
                    bold: true,
                    alignment: "left",
                    margin: [6, 0, 0, -2],
                  },
                  {
                    text: data?.totalAmount,
                    alignment: "right",
                    margin: [0, 0, 6, -2],
                  },
                ],
                [
                  {
                    text: "Sub Total :",
                    bold: true,
                    alignment: "left",
                    margin: [6, 0, 0, -2],
                  },
                  {
                    text: "Rp. " + formatCurrency(data?.totalPrice),
                    alignment: "right",
                    margin: [0, 0, 6, -2],
                  },
                ],
                [
                  {
                    text: "Point :",
                    bold: true,
                    alignment: "left",
                    margin: [6, 0, 0, -2],
                  },
                  {
                    text: data?.totalPoint,
                    alignment: "right",
                    margin: [0, 0, 6, -2],
                  },
                ],
                [
                  {
                    text: "Bayar :",
                    bold: true,
                    alignment: "left",
                    margin: [6, 0, 0, -2],
                  },
                  {
                    text:
                      data?.paymentAmount !== 0
                        ? "Rp. " + formatCurrency(data?.paymentAmount)
                        : "Rp. 0",
                    alignment: "right",
                    margin: [0, 0, 6, -2],
                  },
                ],
                [
                  {
                    text: "Kembali :",
                    bold: true,
                    alignment: "left",
                    margin: [6, 0, 0, -2],
                  },
                  {
                    text:
                      data?.changeAmount !== 0
                        ? "Rp. " + formatCurrency(data?.changeAmount)
                        : "Rp. 0",
                    alignment: "right",
                    margin: [0, 0, 6, 2],
                  },
                ],
              ],
            },
          },

          // Spacing
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 800,
                y2: 0,
                dash: { length: 2, space: 1 },
                lineWidth: 0.2,
              },
            ],
          },
          {
            stack: [
              {
                fontSize: 8,
                text: "Terima Kasih!",
                alignment: "center",
                margin: [0, 2, 0, 0],
              },
            ],
          },
        ],
        pageMargins: [-3, 0, 2, 5],
        pageSize: {
          width: 150,
          // width: '4 932.28346',
          // // height: 725,
          height: "auto",
        },
      }

      const pdf = pdfMake.createPdf(docDefinition)

      pdf.getBlob(async (blob: Blob) => {
        const formData = new FormData()
        formData.append("file", blob, `${data?.invoice}.pdf`)
        try {
          await fetchWrapper.post(
            `transaction/saveInv/${data?.paymentCode}`,
            formData
          )
        } catch (error) {
          console.error("Gagal mengirim file PDF:")
        }
      })

      pdf.open()

      return pdf
    } catch (error) {
      console.error("Terjadi kesalahan:", error)
    }
  }

  const saveData = async () => {
    try {
      if (
        updatePayment.paymentMethod === "DEBIT" &&
        !paymentInput.value &&
        updatePayment.paymentPrice === 0
      ) {
        toast.error("Nominal Tidak Boleh 0")
        confirmModal.value = false
      } else if (
        updatePayment.paymentMethod === "CASH" &&
        updatePayment.paymentPrice < props.dataPayment?.totalPrice
      ) {
        toast.error("Nominal tidak boleh lebih rendah dari total harga!")
        confirmModal.value = false
      } else {
        const response = await fetchWrapper.patch(
          `transaction/updatePaymentStatus/${props?.dataPayment?.paymentCode}`,
          updatePayment
        )
        toast.success(response.message)
        confirmModal.value = false
        emit("close", false)
        await onGenPDF(response.data).then(async (file: any) => {
          const buffer = await file.bufferPromise
          const blob = new Blob([buffer], { type: "application/pdf" })
          const formData = new FormData()
          formData.append("file", blob, `${response.data?.invoice}.pdf`)
          try {
            await fetchWrapper.post(
              `transaction/saveInv/${response.data?.paymentCode}`,
              formData
            )
            setTimeout(async () => {
              window.location.reload()
            }, 2000)
          } catch (error) {
            console.error("Gagal mengirim file PDF:")
          }
        })
      }
    } catch (error: any) {
      toast.error(error.response?.data.message)
    }
  }

  watch(
    () => props.updateModal,
    (newValue) => {
      if (newValue) {
        setTimeout(() => {
          getData()
        }, 20)
      }
    }
  )
</script>

<template>
  <Dialog
    :open="props.updateModal"
    size="md"
    @close="setProcessTransaction"
    :initialFocus="createTicketRef">
    <Dialog.Panel>
      <Dialog.Title class="flex justify-between">
        <div class="grid">
          <h2 style="font-size: 1.2rem" class="mr-auto text-base font-medium">
            Pembayaran
          </h2>
          <p style="font-size: 0.7rem">
            ORDER #{{ props?.dataPayment?.paymentCode }}
          </p>
        </div>
        <Button
          @click="setInvoiceModal(true)"
          type="button"
          variant="primary"
          class="w-fit">
          Ubah Pesanan
        </Button>
      </Dialog.Title>
      <!-- <Dialog.Description class="flex gap-3 max-h-96 overflow-auto"> -->
      <Dialog.Description>
        <div class="grid gap-6">
          <!--  -->
          <div class="grid" ref="contentToPrint">
            <table class="table-auto hover:table-fixed">
              <tr>
                <th class="text-start pb-2 border-b border-gray-200">No</th>
                <th class="text-start pb-2 border-b border-gray-200">Nama</th>
                <th class="text-start pb-2 border-b border-gray-200">Harga</th>
                <th class="text-start pb-2 border-b border-gray-200">Item</th>
                <th class="text-start pb-2 border-b border-gray-200">Total</th>
              </tr>

              <tr v-for="(pay, index) in props?.dataPayment?.items" key="index">
                <td class="text-start py-2 border-b border-gray-200">
                  {{ index + 1 }}
                </td>
                <td class="text-start py-2 border-b border-gray-200">
                  {{ pay.itemName }}
                </td>
                <td class="text-start py-2 border-b border-gray-200">
                  {{ "Rp. " + formatCurrency(pay.itemPrice) }}
                </td>
                <td class="text-center py-2 border-b border-gray-200">
                  {{ pay.itemAmount }}
                </td>
                <td class="text-start py-2 border-b border-gray-200">
                  {{ "Rp. " + formatCurrency(pay.totalPrice) }}
                </td>
              </tr>

              <tr>
                <td class="text-start font-bold py-2 border-b border-gray-200">
                  Jumlah
                </td>
                <td
                  class="text-start font-bold py-2 border-b border-gray-200"></td>
                <td
                  class="text-start font-bold py-2 border-b border-gray-200"></td>
                <td class="text-center font-bold py-2 border-b border-gray-200">
                  {{ props.dataPayment?.totalAmount }}
                </td>
                <td class="text-start font-bold py-2 border-b border-gray-200">
                  {{ "Rp. " + formatCurrency(props.dataPayment?.totalPrice) }}
                </td>
              </tr>
            </table>
          </div>
          <div class="grid gap-3">
            <div class="h-full">
              <FormLabel htmlFor="pos-form-2">Metode Pembayaran</FormLabel>
              <FormSelect
                v-model="updatePayment.paymentMethod"
                @update:modelValue="updatePaymentInput"
                class="mt-3 !box sm:mt-0">
                <option value="CASH">Cash</option>
                <option value="DEBIT">Debit</option>
                <option value="TRANSFER">Transfer</option>
              </FormSelect>
            </div>
            <div class="h-full">
              <FormLabel htmlFor="pos-form-2">Nominal Pembayaran</FormLabel>
              <InputGroup>
                <InputGroup.Text id="input-group-email"> Rp. </InputGroup.Text>
                <FormInput
                  id="regular-form-5"
                  type="number"
                  v-model="updatePayment.paymentPrice"
                  :disabled="paymentInput"
                  class="flex-1 mt-3 sm:mt-0"
                  placeholder="Masukkan Nominal Pembayaran" />
              </InputGroup>
            </div>
          </div>
        </div>
      </Dialog.Description>
      <Dialog.Footer class="text-right">
        <Button
          variant="outline-secondary"
          type="button"
          @click="setProcessTransaction"
          class="w-32 mr-1">
          Batal
        </Button>
        <Button
          @click="(event: MouseEvent) => {
            event.preventDefault();
            confirmModal = true
          }"
          variant="primary"
          type="button"
          class="w-32"
          ref="createTicketRef">
          Lanjutkan
        </Button>
      </Dialog.Footer>
      <!-- BEGIN: Invoice -->
      <DialogInvoice
        :invoiceModal="invoiceModal"
        :dataPayment="props.dataPayment"
        @close="invoiceModal = false" />
      <!-- END: Invoice -->

      <!-- BEGIN: Confirm -->
      <Dialog
        :open="confirmModal"
        @close="
          () => {
            setConfirmModal(false)
          }
        ">
        <Dialog.Panel>
          <div class="p-5 text-center">
            <Lucide icon="Info" class="w-16 h-16 mx-auto mt-3 text-warning" />
            <div class="mt-5 text-3xl">Apakah Data Sudah Benar ?</div>
          </div>
          <div class="px-5 pb-8 text-center">
            <Button
              type="button"
              variant="outline-secondary"
              @click="
                () => {
                  setConfirmModal(false)
                }
              "
              class="w-24 mr-1">
              Batal
            </Button>
            <Button
              @click="saveData"
              type="button"
              variant="primary"
              class="w-24"
              ref="{deleteButtonRef}">
              Yakin
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      <!-- END: Confirm -->
    </Dialog.Panel>
  </Dialog>
</template>
