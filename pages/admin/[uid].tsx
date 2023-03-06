import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { auth, signOut } from '../api/firebase'
import { useGetUserInfoQuery } from '../../app/slice/apiSlice'
import { selectUser } from '../../app/slice/userSlice'
import { persistor } from '../../app/store'
import { useAppSelector } from '../../app/hooks'
import MenuPage from '../../components/MenuPage'
import OrderPage from '../../components/OrderPage'
import ManagementPage from '../../components/ManagementPage'
import styles from '../../styles/AdminPage.module.css'


export default function AdminPage(){
  const [currentPage, setCurrentPage] = useState<string>('order')

  const user = useAppSelector(selectUser)
  const uid = user?.claims.user_id
  const router = useRouter()
  
  const {
    data,
    isLoading,
    isSuccess,
    isFetching,
    isError,
    error 
  } = useGetUserInfoQuery({ uid })

  const menuClickHandler = () => {
    setCurrentPage('menu')
  }

  const orderClickHandler = () => {
    setCurrentPage('order')
  }

  const managementClickHandler = () => {
    setCurrentPage('management')
  }

  const homeClickHandler = () => {
    router.push('/')
  }

  const signoutClickHandler = () => {
    signOut(auth)
    persistor.purge()
  }

  useEffect(() => {
    if(!user) {
      router.push('/')
      return
    }

    if(!data) {
      if(isLoading) {
        return
      }
      router.push('/')
      return
    }
  })

  return (
    <div>
      {isLoading ? 
      <div className={styles.loading}>
        Loading .....
      </div> 
      : 
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft} onClick={menuClickHandler}>메뉴 관리</div>
          <div className={styles.headerLeft} onClick={orderClickHandler}>주문 현황</div>
          <div className={styles.headerLeft} onClick={managementClickHandler}>매출 관리</div>
          <div className={styles.headerRight}>
            <div className={styles.homeAndSignout}>
              <div className={styles.home} onClick={homeClickHandler}>홈으로</div>
              <div className={styles.signout} onClick={signoutClickHandler}>로그아웃</div>
            </div>
          </div>
        </div>
        <div className={styles.body}>
          {currentPage === 'menu' ? <MenuPage />
          : currentPage === 'order' ? <OrderPage />
          : <ManagementPage />
          }
        </div>
      </div>
      }
    </div>
  )
}
