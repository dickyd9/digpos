export interface IUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  gender: string
}

// Service Interface
export interface IService {
  _id: string
  itemCode: string
  itemName: string
  itemType: string
  itemPrice: number
  itemCategory: string
  itemPoint: number
  itemStatus: string
  itemItem: string
  deletedAt: Date
  createdAt: Date
}

export interface IServiceInput {
  itemName: string
  itemPrice: number
  itemType: string
  itemPoint: number
  itemStatus: string
  createdAt: Date
}

export interface ITask {
  _id: string
  employeeCode: string
  transactionRef: string
  serviceCode: string
  createdAt: Date
}

interface IEmployeeTask {
  taskFinished: string
  task: ITask[]
}

// Employee Interface
export interface IEmployee {
  _id: string
  employeeCode: string
  employeeName: string
  employeeAddress: string
  employeeContact: number
  employeeGender: string
  employeeTask: string[]
  report: IEmployeeTask | undefined
  createdAt: Date
}

export interface IEmployeeInput {
  employeeName: string
  employeeAddress: string
  employeeContact: number
  employeeGender: string
  createdAt: Date
}

// Transaction Interface
export interface ICreateInvoice {
  customerCode: string
}

export interface ICreateTransaction {
  itemCode: string
  amount: number
}

export interface ITransaction {
  _id: string
  userId: string
  paymentCode: string
  customerCode: string
  item: object[]
  totalPoint: number
  totalAmount: number
  totalPrice: number
  createdAt: Date
}

export interface ILastTransaction {
  invoice: string
  paymentCode: string
  customerName: string
  totalPrice: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  paymentDate: string
  item: object[]
}

// Customer Interface
export interface ICustomer {
  _id: string
  customerCode: string
  customerName: string
  customerAddress: string
  customerEmail: string
  customerDOB: Date
  customerContact: number
  customerGender: string
  createdAt: Date
}

export interface ICustomerInput {
  customerName: string
  customerAddress: string
  customerEmail: string
  customerDOB: Date
  customerContact: number
  customerGender: string
}

// Auth Interface
export interface ILoginInput {
  username: string | undefined
  password: string | undefined
}

export interface GenericResponse {
  statusCode: string
  message: string
  error: string
}

export interface ISignUpInput {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export interface ILoginResponse {
  status: string
  access_token: string
}

export interface ISignUpResponse {
  status: string
  message: string
}

export interface IUserResponse {
  status: string
  data: {
    user: IUser
  }
}

export interface IPaginate {
  totalItems: number
  totalPages: number
  itemsPerPage: number
  currentPage: number
}

export interface ICart {
  itemCode: string
  itemName: string
  itemType: string
  itemPrice: number
  itemPoint: number
  employeeCode: string | undefined | null
  amount: number
}

export interface IConfirmCart {
  data: object[]
}
