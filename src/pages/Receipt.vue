<template>
  <body class="body" ref="contentPrint">
    <vue3-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      filename="hee hee"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      ref="html2Pdf">
      <template v-slot:pdf-content>
        <!-- pdf-content-width="800px"
        @progress="onProgress($event)"
        @hasStartedGeneration="hasStartedGeneration()"
        @hasGenerated="hasGenerated($event)" -->
        <div class="ticket">
          <p class="centered">
            RECEIPT EXAMPLE <br />Address line 1 <br />Address line 2
          </p>
          <table>
            <thead>
              <tr>
                <th class="quantity">Q.</th>
                <th class="description">Description</th>
                <th class="price">$$</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="quantity">1.00</td>
                <td class="description">ARDUINO UNO R3</td>
                <td class="price">$25.00</td>
              </tr>
              <tr>
                <td class="quantity">2.00</td>
                <td class="description">JAVASCRIPT BOOK</td>
                <td class="price">$10.00</td>
              </tr>
              <tr>
                <td class="quantity">1.00</td>
                <td class="description">STICKER PACK</td>
                <td class="price">$10.00</td>
              </tr>
              <tr>
                <td class="quantity"></td>
                <td class="description">TOTAL</td>
                <td class="price">$55.00</td>
              </tr>
            </tbody>
          </table>
          <p class="centered">
            Thanks for your purchase! <br />parzibyte.me/blog
          </p>
          <button @click="print()">Print</button>
        </div>
      </template>
    </vue3-html2pdf>
  </body>
</template>

<script lang="ts" setup>
  import { ref } from "vue"

  const contentPrint = ref<HTMLElement | null>(null)

  const print = () => {
    const content = contentPrint.value
    if (content) {
      const printWindow = window.open("", "_blank")

      if (printWindow) {
        const innerHTML = content.innerHTML
        if (innerHTML !== null) {
          printWindow.document.write(innerHTML)
          printWindow.document.close()
          printWindow.print()

          console.log(innerHTML)
        } else {
          console.error("Inner HTML dari konten kosong.")
        }
      }
    } else {
      // Jika jendela pencetakan tidak dapat dibuka
      console.error("Tidak dapat membuka jendela pencetakan.")
    }
  }
</script>

<style>
  .body {
    font-size: 12px;
    font-family: "Times New Roman";
  }

  td,
  th,
  tr,
  table {
    border-top: 1px solid black;
    border-collapse: collapse;
  }

  td.description,
  th.description {
    width: 75px;
    max-width: 75px;
  }

  td.quantity,
  th.quantity {
    width: 40px;
    max-width: 40px;
    word-break: break-all;
  }

  td.price,
  th.price {
    width: 40px;
    max-width: 40px;
    word-break: break-all;
  }

  .centered {
    text-align: center;
    align-content: center;
  }

  .ticket {
    width: 155px;
    max-width: 155px;
  }
  @media print {
    .hidden-print,
    .hidden-print * {
      display: none !important;
    }
  }
</style>
