<script lang="ts" setup>
  import { ref } from "vue"

  const props = defineProps({
    dataInvoice: Boolean,
  })

  const emit = defineEmits<{
    (e: "print", value: any): void
  }>()

  const receipt = ref<HTMLDivElement | null>(null)
  const printDoc = () => {
    emit("print", receipt)
  }

  const contentToPrint = ref<HTMLDivElement | null>(null)

  const printDocument = () => {
    if (contentToPrint.value) {
      const printWindow = window.open("", "popup", "width=600,height=600")
      if (printWindow) {
        const content = `
        <style>
              body {
                  font-size: 10px;
                  font-family:Calibri;
              }
              
              table {
                  font-size: 10px;
                  font-family:Calibri;
              }
                                  
          </style>
                                  
          <table style="width:100%">
                  
              <tr>
                  <td align ="left">SALE ORDER NO</td>
                  <td align ="right">S01</td>
              </tr>
              <tr>
                  <td align ="left">SALE ORDER D/TIME</td>
                  <td align ="right">2009/01/01</td>
              </tr>
      
              <tr>
                  <td align ="left">CUSTOMER</td>
                  <td align ="right">JOHN DOE</td>
              </tr>
                      
          </table>`

        printWindow.document.write("<html><head><title>Receipt</title>")
        /*optional stylesheet*/ //printWindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
        printWindow.document.write(
          '<style type="text/css"> *, html {margin:0;padding:0;} </style>'
        )
        printWindow.document.write("</head><body>")
        printWindow.document.write(content)
        printWindow.document.write("</body></html>")
        printWindow.document.close()
      }
    }
  }
</script>
<template>
  <div class="body" ref="receipt">
    <button @click="printDocument">Print</button>
    <div class="invoice" ref="contentToPrint">
      <div class="header">
        <h1>Nova Beauty Salon & Spa</h1>
        <p>
          Jl. Raya Cangkudu - Cisoka, Cibugel, Kec. Cisoka, Kab. Tangerang,
          Banten - 15730
        </p>
        <p>+62 813-8647-0818</p>
      </div>

      <hr />

      <div class="invoice-details">
        <p>
          <strong>Nama Pelanggan:</strong>
          <span class="customer-name">Nama Pelanggan</span>
        </p>
        <p>
          <strong>No. Invoice:</strong>
          <span class="invoice-number">#12345</span>
        </p>
        <p>
          <strong>Tanggal:</strong>
          <span class="invoice-date">31 Desember 2023</span>
        </p>
      </div>

      <!-- Isi item dan informasi harga akan ditambahkan di sini -->

      <hr />

      <div class="footer">
        <p>Terima Kasih!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  .invoice {
    width: 58mm;
    margin: 20px auto;
    border: 1px solid #ccc;
    padding: 20px;
  }

  .header {
    text-align: center;
    margin-bottom: 20px;
  }

  .header h1 {
    margin: 5px 0;
  }

  .invoice-details {
    margin-bottom: 20px;
  }

  .invoice-details p {
    margin: 5px 0;
  }

  .footer {
    text-align: center;
    margin-top: 20px;
  }
  @media print {
    .body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }

    body *:not(#contentToPrint) {
      display: none;
    }

    .invoice {
      width: 58mm;
      margin: 20px auto;
      border: 1px solid #ccc;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 5px 0;
    }

    .invoice-details {
      margin-bottom: 20px;
    }

    .invoice-details p {
      margin: 5px 0;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
