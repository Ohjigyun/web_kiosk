import React, { useState, useEffect } from 'react'
import styles from '../styles/MenuPage.module.css'
import { selectUser } from '../app/slice/userSlice'
import { useAppSelector } from '../app/hooks'
import { useGetMenuQuery } from '../app/slice/apiSlice'
import type { MenuResponse } from '../interfaces'
import AddMenuModal from "./AddMenuModal"

export default function MenuPage(){
  const user = useAppSelector(selectUser)
  const uid = user?.claims.user_id

  const {
    data,
    isLoading,
    isSuccess,
    isFetching,
    isError,
    error 
  } = useGetMenuQuery({ uid })

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [tempMenu, setTempMenu] = useState<MenuResponse | {}>({})
  const [currentCategory, setCurrentCategory] = useState<string>(data?.menu)


  const addMenuClickHandler = () => {
    setModalOpen(true)
  }

  const backgroundClickHandler = () => {
    if(modalOpen) {
      setModalOpen(false)
    }
  }

  const clickToEditModeOn = () => {
    setIsEditMode(true)
  }

  const clickToEditModeOff = () => {
    setIsEditMode(false)
  }

  const modalClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
  }

  const currentCategoryChangeHandler = (category: string) => {
    setCurrentCategory(category)
  }
  
  useEffect(() => {
    if(!isLoading) {
      const menu = { ... data }.menu || {}
      setTempMenu(menu)
    }
  }, [])

  return (
    <div className={styles.container} onClick={backgroundClickHandler}>
      <div className={styles.category}>
        <div className={styles.categoryHeader}>
          {isEditMode ? 
            <div className={styles.editCategory} onClick={clickToEditModeOff}>편집 종료</div>
            :
            <div className={styles.editCategory} onClick={clickToEditModeOn}>편집</div>
          }
        </div>
        <div className={styles.categoryBody}>
          {Object.entries(tempMenu).map(([category, [menu]]) => {
            return (
              <div key={category} onClick={() => currentCategoryChangeHandler(category)}>
                {category}
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.menuContainer}>
        <div className={styles.menuBox}>
          {Object.entries(tempMenu).map(([category, [menu]]) => {
              return (
              <div key={category}>
                <div>{menu.menu_image}</div>
                <div>{menu.menu_name}</div>
                <div>{menu.menu_price}</div>
                <div>{menu.menu_description}</div>
              </div>)
          })}  
        </div> 
        <div className={styles.menuBox} onClick={addMenuClickHandler}>메뉴 추가</div>
      </div>
      {modalOpen ? 
        <div onClick={modalClickHandler} className={styles.modal}>
          <AddMenuModal user_id={uid} category={currentCategory} /> 
        </div>
        : 
        null
      }
    </div>
  )
}
