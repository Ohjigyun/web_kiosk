import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../app/hooks';
import { signout, selectUser } from '../../app/slice/userSlice'
import { persistor } from '../../app/store'
import { auth, signOut } from '../api/firebase'
import styles from '../../styles/GuestPage.module.css'


export default function GuestPage(){
  const user = useAppSelector(selectUser)
  const uid = user?.claims.user_id
  const [tableNumber, setTableNumber] = useState<number>(0)
  
  const router = useRouter()
  const dispatch = useDispatch()

  const tableNumberChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value.replace(/[^0-9]/g,'')
    
    setTableNumber(parseInt(price))
  }

  const moveGuestPageClickHandler = () => {
    // prevent customer from try to connect admin page
    signOut(auth)
    dispatch(signout())
    persistor.purge()
    
    router.push(`/guest/${uid}/${tableNumber}`)
  }

  const homeClickHandler = () => {
    router.push('/')
  }

  const signoutClickHandler = () => {
    signOut(auth)
    persistor.purge()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerRight}>
          <div className={styles.homeAndSignout}>
            <div className={styles.home} onClick={homeClickHandler}>홈으로</div>
            <div className={styles.signout} onClick={signoutClickHandler}>로그아웃</div>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.centerBox}>
          <div className={styles.instruction}>
            테이블 번호를 입력해 주세요.
          </div>
          <div className={styles.tableNumber}>
            <input className={styles.inputTableNumber} value={tableNumber} type="number" onChange={tableNumberChangeHandler}></input>
          </div>
          <div>
            <button className={styles.enterButton}onClick={moveGuestPageClickHandler}>입장</button>
          </div>
        </div>
      </div>
    </div>
  )
}
