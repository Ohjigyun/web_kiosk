import { useState, useEffect } from 'react'
import { useLazyGetOrdersQuery, useLazyGetAssetsPresignedUrlQuery, useLazyGetUuidToDisplayTableQuery } from '../app/slice/apiSlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectUser } from '../app/slice/userSlice'
import { setUuidToDisplayList } from '../app/slice/menuSlice'
import styles from '../styles/OrderPage.module.css'
import type { OrderPageProps } from '../interfaces'

export default function OrderPage({ orders, setOrders }: OrderPageProps){
  const dispatch = useAppDispatch()
  const { uuidToDisplayList } = useAppSelector(state => state.menu)
  const user = useAppSelector(selectUser)
  const uid = user?.claims.user_id

  const [getOrders] = useLazyGetOrdersQuery()
  const [getUuidTable] = useLazyGetUuidToDisplayTableQuery()
  const [GetAssetsPresignedUrl] =  useLazyGetAssetsPresignedUrlQuery()

  const asyncGetOrdersAndUuidTable = async () => {
    const response = await getOrders({ uid }).unwrap()
    setOrders(response)

    const { uuid_table } = await getUuidTable({ user_id: uid }).unwrap()
    dispatch(setUuidToDisplayList(uuid_table))
  }

  const playAudio = async () => {
    const url = await GetAssetsPresignedUrl({ file_name: 'bell-ring', file_type: 'mp3' }).unwrap()
    const audio = new Audio(url.url)
    audio.play()
  }

  useEffect(() => {
    asyncGetOrdersAndUuidTable()
  }, [])

  useEffect(() => {
    if(orders.length > 0){
      playAudio()
    }
  }, [orders])

  return (
    <div className={styles.container}>
      {orders.map(({ table_number, order_list, order_price }) => (
        <div className={styles.orderBox} key={table_number}>
          <div className={styles.orderBoxHeader}>
            테이블 번호: {table_number}
          </div>
          <div className={styles.orderBoxBody}>
            {order_list.map(({ menu_name, menu_quantity}) => (
              <div className={styles.menus} key={menu_name}>{uuidToDisplayList[menu_name]}  {menu_quantity}</div>
            ))}
          </div>
          <div className={styles.orderBoxFooter}>
            <div className={styles.totalPrice}>총 요금: {order_price} 원</div>
          </div>
        </div>
      ))}
    </div>
  )
}
