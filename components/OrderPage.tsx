import { useState, useEffect } from 'react'
import { useLazyGetOrdersQuery, useLazyGetUuidToDisplayTableQuery } from '../app/slice/apiSlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectUser } from '../app/slice/userSlice'
import { setUuidToDisplayList } from '../app/slice/menuSlice'
import styles from '../styles/OrderPage.module.css'
import type { Orders } from '../interfaces'

export default function OrderPage(){
  const dispatch = useAppDispatch()
  const { uuidToDisplayList } = useAppSelector(state => state.menu)
  const user = useAppSelector(selectUser)
  const uid = user?.claims.user_id

  const [getOrders] = useLazyGetOrdersQuery()
  const [getUuidTable] = useLazyGetUuidToDisplayTableQuery()

  const [orders, setOrders] = useState<Orders>([])

  const asyncGetOrdersAndUuidTable = async () => {
    const response = await getOrders({ uid }).unwrap()
    setOrders(response)

    const { uuid_table } = await getUuidTable({ user_id: uid }).unwrap()
    dispatch(setUuidToDisplayList(uuid_table))
  }

  useEffect(() => {
    asyncGetOrdersAndUuidTable()
  }, [])

  return (
    <div>
      {orders.map(({ table_number, order_list, order_price }) => (
        <div className={styles.orderBox} key={table_number}>
          <div>table number: {table_number}</div>
          {order_list.map(({ menu_name, menu_quantity}) => (
            <div key={menu_name}>{uuidToDisplayList[menu_name]}  {menu_quantity}</div>
          ))}
          <div>total price: {order_price}</div>
        </div>
      ))}
    </div>
  )
}
