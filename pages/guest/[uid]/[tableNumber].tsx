import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faSquareXmark } from '@fortawesome/free-solid-svg-icons'
import styles from '../../../styles/GuestOrderPage.module.css'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import type { EntriesList, UuidTable, CartList, Product } from '../../../interfaces'
import { useLazyGetMenuQuery, useLazyGetUuidToDisplayTableQuery,useLazyGetIsOrderAdditionalQuery , useSendOrderMutation } from '../../../app/slice/apiSlice'

export default function GuestOrderPage(){
  const router = useRouter()
  const { uid, tableNumber} = router.query

  const [getMenu] = useLazyGetMenuQuery()
  const [getUuidTable] = useLazyGetUuidToDisplayTableQuery()
  const [getIsOrderAddtional] = useLazyGetIsOrderAdditionalQuery()
  const [sendOrder] = useSendOrderMutation()

  const [menu, setMenu] = useState<EntriesList>([])
  const [uuidToDisplayList, setUuidToDisplayList] = useState<UuidTable>({})
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [cartList, setCartList] = useState<CartList>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)

  console.log(cartList)

  const asyncGetMenuAndUuidTable = async () => {
    const response = await getMenu({ uid }).unwrap()
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

  const menuClickHandler = (e: React.MouseEvent<HTMLDivElement>, menuItem: Product) => {
    const { menu_name, menu_price } = menuItem
    
    const item = {
      menu_name,
      menu_price,
      menu_quantity: 1,
      option_list: [],
      option_price: 0
    }

    for (const { menu_name } of cartList) {
      if (menu_name === item.menu_name) {
        return
      }
    }

    setCartList([...cartList, item])
  }

  const subQuantityHandler = (e: React.MouseEvent<SVGSVGElement>, menuName: string) => {
    const copiedCartList = cartList.slice()
    
    for (let i = 0; i < copiedCartList.length ; i += 1) {
      const menu_name = copiedCartList[i].menu_name
      const menu_quantity = copiedCartList[i].menu_quantity
      if (menu_quantity === 1) {
        return
      }

      if (menu_name === menuName && menu_quantity > 1) {
        copiedCartList[i].menu_quantity -= 1
      }
    }

    setCartList(copiedCartList)
  }

  const addQuantityHandler = (e: React.MouseEvent<SVGSVGElement>, menuName: string) => {
    const copiedCartList = cartList.slice()
    
    for (let i = 0; i < copiedCartList.length ; i += 1) {
      const menu_name = copiedCartList[i].menu_name
      if (menu_name === menuName) {
        copiedCartList[i].menu_quantity += 1
      }
    }

    setCartList(copiedCartList)
  }

  const deleteCartItemClickHandler = (e: React.MouseEvent<SVGSVGElement>, menuName: string) => {
    const filteredCartList = cartList.filter(({ menu_name }) => menu_name !== menuName)

    setCartList(filteredCartList)
  }

  const sendOrderHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    const isAdditional = await getIsOrderAddtional({ uid }).unwrap()
    
    if(isAdditional){
      const additionalOrder = {
        user_id: uid,
        table_number: parseInt(tableNumber as string),
        order_list: [],
        additional_order: cartList,
        order_price: totalPrice
      }
      console.log('Order is addtional')
      return
    }

    const order = {
      user_id: uid,
      table_number: parseInt(tableNumber as string),
      order_list: cartList,
      additional_order: [],
      order_price: totalPrice
    }

    await sendOrder(order)
    setCartList([])
  }

  useEffect(() => {
    if (!router.isReady) return;

    asyncGetMenuAndUuidTable()
  }, [router.isReady])

  useEffect(() => {
    let currentTotalPrice = 0

    for(const { menu_price, menu_quantity } of cartList ) {
      currentTotalPrice += menu_price * menu_quantity
    }
    
    setTotalPrice(currentTotalPrice)
  }, [cartList])

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
        <div className={styles.menu}>
          {menu.map(([category, menuList]) => (
            menuList.map(menu => {
              return (
                currentCategory === category ? 
                  <div key={menu.menu_name} className={styles.menuBox} onClick={(e) => menuClickHandler(e, menu)}>
                    <img className={styles.menuImage} src={menu.image_url}></img>
                    <div>{uuidToDisplayList[menu.menu_name]}</div>
                    <div>{menu.menu_price}</div>
                    <div>{menu.menu_description}</div>
                  </div>
                  :
                  null
              )
            })
          ))}  
        </div>
        <div className={styles.cart}>
          <div className={styles.cartContent}>
            {cartList.map(({ menu_name, menu_price, menu_quantity }) => {
              return (
                <div key={menu_name}>
                  <div>{uuidToDisplayList[menu_name]}</div>
                  <div>
                    <FontAwesomeIcon className={styles.faMinus} icon={faMinus} onClick={(e) => subQuantityHandler(e, menu_name)}/>
                    {menu_quantity}
                    <FontAwesomeIcon className={styles.faPlus} icon={faPlus} onClick={(e) => addQuantityHandler(e, menu_name)}/>
                  </div>
                  <div>{menu_price}</div>
                  <div>
                    <FontAwesomeIcon className={styles.faSquareXmark} icon={faSquareXmark} onClick={(e) => deleteCartItemClickHandler(e, menu_name)}/>
                  </div>
                </div>
              )
            })}
          </div>
          <div className={styles.cartPriceInfo}>
            <div>총 주문 금액: {totalPrice}</div>
            <div onClick={sendOrderHandler}>주문 전송</div>
          </div>
        </div>
      </div>
    </div>
  )
}
