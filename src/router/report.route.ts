import ServiceReport from "../pages/report/ServiceReport.vue"
import TransactionReport from "../pages/report/transaction/TransactionReport.vue"
import DetailTransaction from "@/pages/report/transaction/DetailTransaction.vue"

export default [
  {
    path: "/service",
    name: "Service",
    component: ServiceReport,
  },
  {
    path: "/service-report",
    name: "Report Service",
    component: ServiceReport,
  },
  {
    path: "/employee-report",
    name: "Report Karyawan",
    component: ServiceReport,
  },
  {
    path: "/transaction-report",
    name: "Report Transaksi",
    component: TransactionReport,
  },
  {
    path: "/transaction-detail",
    name: "Detail Transaksi",
    component: DetailTransaction,
  },
]
