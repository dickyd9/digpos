import CustomerList from "../pages/customer/CustomerList.vue"
import CustomerDetail from "../pages/customer/CustomerDetail.vue"

export default [
  {
    path: "/list-customer",
    name: "Customer List",
    component: CustomerList,
  },
  {
    path: "/customer-detail/:code",
    name: "Customer Detail",
    component: CustomerDetail,
  }
]
