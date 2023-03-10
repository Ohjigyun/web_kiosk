import firebase from 'firebase/auth'

export type User = firebase.User

export interface UserParams {
  user_email: string,
  user_id: string
}

export interface Product {
  image_key: any
  menu_name: string
  menu_price: number
  menu_description: string
}

export type MenuList = Product[]

export type Entries = [string, Product[]]

export type EntriesList = Entries[]

export interface Menu {
  [key: string]: MenuList
}

export interface MenuResponse {
  user_id: string,
  menu: Menu | {}
}

export interface ModalProps {
  user_id: string,
  category: string
}

export interface UrlResponse {
  data?: string
  error?: any;
}
