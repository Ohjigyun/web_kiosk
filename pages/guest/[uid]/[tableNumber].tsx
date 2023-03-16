import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareMinus } from '@fortawesome/free-regular-svg-icons'
import styles from '../../../styles/GuestOrderPage.module.css'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import type { EntriesList, UuidTable } from '../../../interfaces'
import { useLazyGetMenuQuery, useLazyGetUuidToDisplayTableQuery } from '../../../app/slice/apiSlice'

export default function GuestOrderPage(){
  const router = useRouter()
  const { uid, tableNumber} = router.query

  const [getMenu] = useLazyGetMenuQuery()
  const [getUuidTable] = useLazyGetUuidToDisplayTableQuery()

  const [menu, setMenu] = useState<EntriesList>([])
  const [uuidToDisplayList, setUuidToDisplayList] = useState<UuidTable>({})
  const [currentCategory, setCurrentCategory] = useState<string>('')

  const asyncGetMenuAndUuidTable = async () => {
    const response = await getMenu({ uid }).unwrap()
    console.log(response)
    const menu: EntriesList = Object.entries(response.menu)
    setMenu(menu)

    if(menu.length > 0) {
      const initialCategory = menu[0][0]
      setCurrentCategory(initialCategory)
    }

    const { uuid_table } = await getUuidTable({ user_id: uid }).unwrap()
    setUuidToDisplayList(uuid_table)
  }

  const currentCategoryChangeHandler = (category: string) => {
    setCurrentCategory(category)
  }

  useEffect(() => {
    asyncGetMenuAndUuidTable()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {menu.map(([category, menuList]) => {
          return (
            <div key={category} onClick={() => currentCategoryChangeHandler(category)}>
              <div>{uuidToDisplayList[category]}</div>
            </div>
          )
        })}
      </div>
      <div className={styles.body}>
        <div className={styles.menu}>menu</div>
        <div className={styles.cart}>cart</div>
      </div>
    </div>
  )
}
