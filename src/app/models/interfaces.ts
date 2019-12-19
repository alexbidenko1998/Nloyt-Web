export interface ResponseModel<T> {
  data: T;
  success: boolean;
  error?: {
    code: number,
    message: string
  };
}
export interface Order {
  id: number;
  devicePin: number;
  serviceId: number;
  status: number;
  type: string;
  timeStart: number;
  duration: number;
  isStarted: boolean;
  files: OrderFile[];
  conclusions: OrderConclusion[];
  created_at: string;
  updated_at: string;
}
export interface Device {
  id: number;
  ownerId: number;
  owner?: User;
  pin: string;
  make: string;
  model: string;
  type: string;
  modification: string;
  fullYear?: number;
  order?: Order;
  date: number;
  data?: Telemetry;
  created_at: string;
  updated_at: string;
}
export interface User {
  id: number;
  phone: string;
  email: string;
  token: string;
  isConfirm: boolean;
  created_at: string;
  updated_at: string;
  firstName: string;
  lastName: string;
  avatar: string;
  paymentMethod: string;
  ordersCount?: number;
}
export interface Telemetry {
  id: number;
  created_at: string;
  updated_at: string;
  TP: number;
  CL: number;
  OL: number;
  FL: number;
  BV: number;
  miliage: number;
  latitude: number;
  longitude: number;
}
export interface OrderFile {
  id: number;
  serviceId: number;
  orderId: number;
  timestamp: number;
  filename: string;
}
export interface OrderConclusion {
  id: number;
  serviceId: number;
  orderId: number;
  timestamp: number;
  text: string;
  risk: number;
}
