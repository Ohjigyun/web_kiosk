import React, { useState } from 'react'
import styles from '../styles/MenuPage.module.css'
import AddMenuModal from "./AddMenuModal"

export default function MenuPage(){
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [currentCategory, setCurrentCategory] = useState<string>('')

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
      </div>
      <div className={styles.menuContainer}>
        <div className={styles.menuBox} onClick={addMenuClickHandler}>메뉴 추가</div>
      </div>
      {modalOpen ? 
        <div onClick={modalClickHandler} className={styles.modal}>
          <AddMenuModal /> 
        </div>
        : 
        null
      }
    </div>
  )
}
