import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import { auth, signOut } from '../api/firebase'
import { useGetUserInfoQuery } from '../../app/slice/apiSlice'
import { selectUser } from '../../app/slice/userSlice'
import { persistor } from '../../app/store'
import { useAppSelector } from '../../app/hooks'
import type { Orders } from '../../interfaces'
import MenuPage from '../../components/MenuPage'
import OrderPage from '../../components/OrderPage'
import ManagementPage from '../../components/ManagementPage'
import styles from '../../styles/AdminPage.module.css'


export default function AdminPage(){
  const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL
  const socket = useRef<WebSocket | null>(null)

  const [currentPage, setCurrentPage] = useState<string>('menu')
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [orders, setOrders] = useState<Orders>([])

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
  
  const onSocketOpen = useCallback(() => {
    setIsConnected(true)
    socket.current?.send(JSON.stringify({ action: 'setTableNumber', user_id: uid, table_number: '', isAdmin: true }))
  }, [])

  const onSocketClose = useCallback(() => {
    setIsConnected(false)
  }, [])

  const onOrderStatus = useCallback((dataStr: any) => {
    const data = JSON.parse(dataStr)
    if(data.orders){
      setOrders(data.orders)
    }
  }, [])

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(websocketUrl as string);
      socket.current.addEventListener('open', onSocketOpen);
      socket.current.addEventListener('close', onSocketClose);
      socket.current.addEventListener('message', (event) => {
        onOrderStatus(event.data);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      socket.current?.close();
    };
  }, []);

  const onDisconnect = useCallback(() => {
    if(isConnected) {
      socket.current?.close()
    }
  }, [isConnected])

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

  useEffect(() => {
    if(currentPage === 'order'){
      onConnect()
      setIsConnected(true)
      return
    }
    onDisconnect()
    setIsConnected(false)
  }, [currentPage])

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
          {/* <div className={styles.headerLeft} onClick={managementClickHandler}>매출 관리</div> */}
          <div className={styles.headerRight}>
            <div className={styles.homeAndSignout}>
              <div className={styles.home} onClick={homeClickHandler}>홈으로</div>
              <div className={styles.signout} onClick={signoutClickHandler}>로그아웃</div>
            </div>
          </div>
        </div>
        <div className={styles.body}>
          {currentPage === 'menu' ? <MenuPage />
          : currentPage === 'order' ? 
            <div>
              <OrderPage orders={orders} setOrders={setOrders}/>
              {isConnected ? null : <button onClick={onConnect}>재연결</button>}
            </div>
          : <ManagementPage />
          }
          {currentPage === 'menu' ? <MenuPage />
          : 
          <div>
            <OrderPage orders={orders} setOrders={setOrders}/>
            {isConnected ? null : <button onClick={onConnect}>재연결</button>}
          </div>
          }
        </div>
      </div>
      }
    </div>
  )
}
