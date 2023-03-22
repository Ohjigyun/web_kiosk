import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { useLazyGetPresignedUrlQuery, useAddMenuMutation, useLazyGetMenuQuery, useLazyGetUuidToDisplayTableQuery } from '../app/slice/apiSlice'
import { setMenu, setUuidToDisplayList } from '../app/slice/menuSlice';
import { setAddMenuModalOpen } from '../app/slice/uiSlice';
import { useAppDispatch } from '../app/hooks'
import type { ModalProps, EntriesList, TempMenu } from '../interfaces'
import styles from '../styles/AddMenuModal.module.css'

export default function AddMenuModal( menuInfo: ModalProps ){
  const menuUuid = uuidv4()
  
  const [attachedImage, setAttachedImage] = useState<File>()
  const [tempMenuName, setTempMenuName] = useState<TempMenu>(['', ''])
  const [menuPrice, setMenuPrice] = useState<number>(0)
  const [menuDescription, setMenuDescription] = useState<string>('')

  const dispatch = useAppDispatch()
  const [getUuidTable] = useLazyGetUuidToDisplayTableQuery()
  const [getPresignedUrl] = useLazyGetPresignedUrlQuery()
  const [addMenu, { isLoading }] = useAddMenuMutation()

  const [getMenu] = useLazyGetMenuQuery()

  const uploadImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.currentTarget.files as FileList)[0]

    if(!file) {
      return
    }

    setAttachedImage(file)
  }

  const menuNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempMenuName([menuUuid, e.target.value])
  }

  const menuPriceChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value.replace(/[^0-9]/g,'')

    setMenuPrice(parseInt(price))
  }

  const menuDescriptionChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuDescription(e.target.value)
  }
  
  const uploadToS3 = async (e: React.ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.target);
    
    const file = formData.get('file')

    if(!file) {
      return
    }

    // @ts-ignore
    const fileType = encodeURIComponent(file.type)

    const { user_id, category } = menuInfo
    const menuNameKey = tempMenuName[0]

    const fileInfo = { user_id, category, menu_name: menuNameKey, image_type: fileType }

    const { url } = await getPresignedUrl(fileInfo).unwrap()

    const axiosResponse = await axios.put(url, file)
  } 

  const addMenuHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.target);
    
    const file = formData.get('file')

    if(!file) {
      return
    }

    // @ts-ignore
    const fileType = file.type.split('/')[1]

    const menuNameKey = tempMenuName[0]
    const menuDisplayName = tempMenuName[1]

    const { user_id, category } = menuInfo
    const image_key = `${user_id}/${category}/${menuNameKey}.${fileType}`

    const params = {
      user_id,
      category,
      menu_name: menuNameKey,
      menu_display_name: menuDisplayName,
      menu_price: menuPrice,
      menu_description: menuDescription,
      image_key
    }

    await addMenu(params)
  }

  const getAndSetMenu = async () => {
    const uid = menuInfo.user_id
    const response = await getMenu({ uid }).unwrap()
    const menu: EntriesList = Object.entries(response.menu)
    
    dispatch(setMenu(menu))

    const { uuid_table } = await getUuidTable({ user_id: uid}).unwrap()
    dispatch(setUuidToDisplayList(uuid_table))
  }

  const submitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const menuDisplayName = tempMenuName[1]

    if(!(menuDisplayName && menuPrice && menuDescription)) {
      alert('모든 메뉴 정보를 입력해주세요!')
      return
    }
    
    await uploadToS3(e)
    await addMenuHandler(e)
    await getAndSetMenu()
    dispatch(setAddMenuModalOpen(false))
  }

  return (
    <div className={styles.container}>
      {attachedImage ? 
        <img className={styles.previewImage} src={URL.createObjectURL(attachedImage)}  />
        :
        null
      }
      <form className={styles.formContainer} onSubmit={submitHandler}>
        <label className={styles.label} htmlFor="inputImage">사진 업로드</label><input id="inputImage" className={styles.file} type="file" name="file" accept="image/*" onChange={uploadImageHandler}></input>
        <input className={styles.input} placeholder="메뉴 이름" type="text" value={tempMenuName[1]} onChange={menuNameChangeHandler}></input>
        <input className={styles.input} placeholder="메뉴 가격" type="number" value={menuPrice} onChange={menuPriceChangeHandler}></input>
        <input className={styles.input} placeholder="메뉴 설명" type="text" value={menuDescription} onChange={menuDescriptionChangeHandler}></input>
        <button className={styles.addButton} >메뉴 추가</button>
      </form>
    </div>
  )
}
