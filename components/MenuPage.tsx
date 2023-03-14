import React, { useState, useEffect } from 'react'
import styles from '../styles/MenuPage.module.css'
import { selectUser } from '../app/slice/userSlice'
import { setMenu } from '../app/slice/menuSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useLazyGetMenuQuery } from '../app/slice/apiSlice'
import { setAddMenuModalOpen } from '../app/slice/uiSlice';
import type { EntriesList, TempCategories } from '../interfaces'
import AddMenuModal from "./AddMenuModal"


export default function MenuPage(){
  const dispatch = useAppDispatch()
  const menu = useAppSelector(state => state.menu.menu)
  const user = useAppSelector(selectUser)
  const addMenuModalOpen = useAppSelector(state => state.ui.addMenuModalOpen)
  const uid = user?.claims.user_id

  const [getMenu] = useLazyGetMenuQuery()

  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [tempCategories, setTempCategories] = useState<TempCategories>({})

  const addMenuClickHandler = () => {
    dispatch(setAddMenuModalOpen(true))
  }

  const backgroundClickHandler = () => {
    if(addMenuModalOpen) {
      dispatch(setAddMenuModalOpen(false))
    }
  }

  const categoryChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const copiedObject = { ...tempCategories }
    copiedObject[key] = e.target.value
    
    setTempCategories(copiedObject)
  }

  const addCategoryClickHandler = () => {
    const copiedObject = { ...tempCategories }
    const lengthOfCategories = Object.keys(copiedObject).length
    copiedObject[`new_category${lengthOfCategories}`] = ''

    setTempCategories(copiedObject)
  }

  const clickToEditModeOn = () => {
    setIsEditMode(true)
  }

  const clickToEditModeOff = () => {
    const tempCategoryList = Object.entries(tempCategories)
    for (const [newCategoryKey, newCategoryValue] of tempCategoryList){
      for (const [category, menus] of menu){
        if(category === newCategoryValue) {
          alert('이미 존재하는 카테고리입니다.')
          return
        }
      }
    }
    
    setTempCategories({})
    setIsEditMode(false)
  }

  const modalClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
  }

  const currentCategoryChangeHandler = (category: string) => {
    setCurrentCategory(category)
  }

  useEffect(() => {
    const asyncGetMenu = async () => {
      const response = await getMenu({ uid }).unwrap()
      const menu: EntriesList = Object.entries(response.menu)
      const initialCategory = menu[0][0]
      dispatch(setMenu(menu))
      setCurrentCategory(initialCategory)
    }
    
    asyncGetMenu()
  }, [])

  console.log(tempCategories)

  return (
    <div className={styles.container} onClick={backgroundClickHandler}>
      <div className={styles.category}>
        <div className={styles.categoryHeader}>
          {isEditMode ? 
            <div>
              <div onClick={addCategoryClickHandler} >카테고리 추가</div>
              <div className={styles.editCategory} onClick={clickToEditModeOff}>편집 종료</div>
            </div>
            :
            <div className={styles.editCategory} onClick={clickToEditModeOn}>편집</div>
          }
        </div>
        <div className={styles.categoryBody}>
          {menu.map(([category, menuList]) => {
            const tempCategoryList = Object.entries(tempCategories)
            console.log(tempCategoryList)

            return (
              <div>
                {tempCategoryList.map(([tempCategoryKey, tempCategory]) => (
                  <input type="text" key={tempCategoryKey} value={tempCategories[tempCategoryKey]} onChange={(e) => categoryChangeHandler(e, tempCategoryKey)}/>
                ))}
                <div key={category} onClick={() => currentCategoryChangeHandler(category)}>
                  {category}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.menuContainer}>
        {menu.map(([category, menuList]) => (
            menuList.map(menu => {
              return (
                currentCategory === category ? 
                  <div key={menu.menu_name} className={styles.menuBox}>
                    <img className={styles.menuImage} src={menu.image_url}></img>
                    <div>{menu.menu_name}</div>
                    <div>{menu.menu_price}</div>
                    <div>{menu.menu_description}</div>
                  </div>
                  :
                  null
            )})
        ))}  
        <div className={styles.menuBox} onClick={addMenuClickHandler}>메뉴 추가</div>
      </div>
      {addMenuModalOpen ? 
        <div onClick={modalClickHandler} className={styles.modal}>
          <AddMenuModal user_id={uid} category={currentCategory} /> 
        </div>
        : 
        null
      }
    </div>
  )
}
