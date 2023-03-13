import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLazyGetPresignedUrlQuery, useAddMenuMutation, useLazyGetMenuQuery } from '../app/slice/apiSlice'
import { setMenu } from '../app/slice/menuSlice';
import { setAddMenuModalOpen } from '../app/slice/uiSlice';
import { useAppDispatch } from '../app/hooks'
import type { ModalProps, EntriesList } from '../interfaces'
import styles from '../styles/AddMenuModal.module.css'

export default function AddMenuModal( menuInfo: ModalProps ){
  const [attachedImage, setAttachedImage] = useState<File>()
  const [menuName, setMenuName] = useState<string>('')
  const [menuPrice, setMenuPrice] = useState<number>(0)
  const [menuDescription, setMenuDescription] = useState<string>('')

  const dispatch = useAppDispatch()
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
    setMenuName(e.target.value)
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

    const fileInfo = { user_id, category, menu_name: menuName, image_type: fileType }

    const { url } = await getPresignedUrl(fileInfo).unwrap()

    console.log("url:", url)

    // const axiosResponse = await axios.put(url, file)
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

    const { user_id, category } = menuInfo
    const image_key = `${user_id}/${category}/${menuName}.${fileType}`

    const params = {
      user_id,
      category,
      menu_name: menuName,
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
  }

  const submitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(!(menuName && menuPrice && menuDescription)) {
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
        <input type="text" value={menuName} onChange={menuNameChangeHandler}></input>
        <input type="number" value={menuPrice} onChange={menuPriceChangeHandler}></input>
        <input type="text" value={menuDescription} onChange={menuDescriptionChangeHandler}></input>
        <button>추가하기</button>
      </form>
    </div>
  )
}
