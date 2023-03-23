import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareMinus } from '@fortawesome/free-regular-svg-icons'
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/MenuPage.module.css'
import { selectUser } from '../app/slice/userSlice'
import { setMenu, setUuidToDisplayList } from '../app/slice/menuSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useLazyGetMenuQuery, useLazyGetUuidToDisplayTableQuery, useAddCategoryMutation, useDeleteMenuMutation, useDeleteCategoryMutation } from '../app/slice/apiSlice'
import { setAddMenuModalOpen } from '../app/slice/uiSlice';
import type { EntriesList, TempCategories } from '../interfaces'
import AddMenuModal from "./AddMenuModal"


export default function MenuPage(){
  const dispatch = useAppDispatch()
  const { menu, uuidToDisplayList } = useAppSelector(state => state.menu)
  const user = useAppSelector(selectUser)
  const addMenuModalOpen = useAppSelector(state => state.ui.addMenuModalOpen)
  const uid = user?.claims.user_id

  const [getMenu] = useLazyGetMenuQuery()
  const [getUuidTable] = useLazyGetUuidToDisplayTableQuery()
  const [addCategory] = useAddCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [deleteMenu] = useDeleteMenuMutation()

  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [tempCategories, setTempCategories] = useState<TempCategories>({})
  const [currentCategory, setCurrentCategory] = useState<string>('')

  const asyncGetMenuAndUuidTable = async () => {
    const response = await getMenu({ uid }).unwrap()
    console.log(response)
    const menu: EntriesList = Object.entries(response.menu)
    dispatch(setMenu(menu))

    if(menu.length > 0) {
      const initialCategory = menu[0][0]
      setCurrentCategory(initialCategory)
    }

    const { uuid_table } = await getUuidTable({ user_id: uid }).unwrap()
    dispatch(setUuidToDisplayList(uuid_table))
  }

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
    copiedObject[`${uuidv4()}`] = ''

    setTempCategories(copiedObject)
  }

  const deleteTempCategoryClickHandler = async (e: React.MouseEvent<SVGSVGElement>, targetCategoryKey: string) => {
    const copiedObject = { ...tempCategories }
    delete copiedObject[targetCategoryKey]
    setTempCategories(copiedObject)
  }

  const deleteCategoryClickHandler = async (e: React.MouseEvent<SVGSVGElement>, targetCategory: string) => {
    const categoryInfo = { user_id: uid, category: targetCategory }
    await deleteCategory(categoryInfo)
    // re-fetch
    asyncGetMenuAndUuidTable()
    // TODO: uuid 테이블에서도 삭제하기
  }

  const deleteMenuClickHandler = async (e: React.MouseEvent<SVGSVGElement>, category: string, menuName: string) => {
    await deleteMenu({ user_id: uid, category, menu_name: menuName})
    asyncGetMenuAndUuidTable()
    // TODO: uuid 테이블에서도 삭제하기
  }

  const clickToEditModeOn = () => {
    setIsEditMode(true)
  }

  const clickToEditModeOff = async () => {
    const tempCategoryList = Object.entries(tempCategories)
    for (const [newCategoryKey, newCategoryValue] of tempCategoryList){
      for (const [category, menus] of menu){
        if(category === newCategoryValue) {
          alert('이미 존재하는 카테고리입니다.')
          return
        }
      }
    }
    for (const [newCategoryKey, newCategoryValue] of tempCategoryList){
      if(newCategoryValue !== ''){
        const categoryInfo = { user_id: uid, category: newCategoryKey, category_display_name: newCategoryValue }
        await addCategory(categoryInfo)
      }
    }

    setTempCategories({})
    setIsEditMode(false)
    asyncGetMenuAndUuidTable()
  }

  const modalClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
  }

  const currentCategoryChangeHandler = (category: string) => {
    setCurrentCategory(category)
  }

  useEffect(() => {
    asyncGetMenuAndUuidTable()
  }, [])

  return (
    <div className={styles.container} onClick={backgroundClickHandler}>
      <div className={styles.category}>
        <div className={styles.categoryHeader}>
          {isEditMode ? 
            <div className={styles.categoryInEdit}>
              <div className={styles.addCategory} onClick={addCategoryClickHandler} >카테고리 추가</div>
              <div className={styles.exitEdit} onClick={clickToEditModeOff}>편집 종료</div>
            </div>
            :
            <div className={styles.editCategory} onClick={clickToEditModeOn}>카테고리 편집</div>
          }
        </div>
        <div className={styles.categoryBody}>
          {Object.entries(tempCategories).map(([tempCategoryKey, tempCategory]) => (
            <div className={styles.tempCategory} key={tempCategoryKey}>
              <input className={styles.tempCategoryInput} type="text" key={tempCategoryKey} value={tempCategories[tempCategoryKey]} onChange={(e) => categoryChangeHandler(e, tempCategoryKey)}/>
              <FontAwesomeIcon className={styles.faSquareMinus} icon={faSquareMinus} onClick={(e) => deleteTempCategoryClickHandler(e, tempCategoryKey)}/>
            </div>
          ))}
          {menu.map(([category, menuList]) => {
            return (
              <div className={`${styles.categoryNames} ${currentCategory === category && !isEditMode ? `${styles.currentCategory}` : ''}`} key={category} onClick={() => currentCategoryChangeHandler(category)}>
                <div>{uuidToDisplayList[category]}</div>
                {isEditMode && uuidToDisplayList[category] !== '' ? 
                  <FontAwesomeIcon className={styles.faSquareMinus} icon={faSquareMinus} onClick={(e) => deleteCategoryClickHandler(e, category)}/>
                  :
                  null
                }
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.menuContainer}>
        <div className={styles.menuHeader}>
          <div className={styles.addMenu} onClick={addMenuClickHandler}> + 메뉴 추가</div>
        </div>
        <div className={styles.menuBody}>
          {menu.map(([category, menuList]) => (
              menuList.map(menu => {
                return (
                  currentCategory === category ? 
                    <div key={menu.menu_name} className={styles.menuBox}>
                      <div className={styles.deleteMenuButton}><FontAwesomeIcon icon={faSquareMinus} onClick={(e) => deleteMenuClickHandler(e, category, menu.menu_name)}/></div>
                      <img className={styles.menuImage} src={menu.image_url}></img>
                      <div className={styles.menuName}>{uuidToDisplayList[menu.menu_name]}</div>
                      <div className={styles.menuPrice}>{menu.menu_price} 원</div>
                      <div className={styles.menuDescription}>{menu.menu_description}</div>
                    </div>
                    :
                    null
              )})
          ))}  
        </div>
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
