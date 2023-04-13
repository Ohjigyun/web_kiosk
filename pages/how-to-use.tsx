import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { persistor } from '../app/store'
import { auth, signOut } from './api/firebase'
import type { Index } from '../interfaces'
import Signup from '../components/HowToUse/Signup'
import Order from '../components/HowToUse/Order'
import BillPay from '../components/HowToUse/BillPay'
import CustomMenu from '../components/HowToUse/CustomMenu'
import styles from '../styles/HowToUse.module.css'


export default function HowToUse() {
  const router = useRouter()

  const indexList: Index = {
    1: '회원 가입',
    2: '메뉴 커스텀',
    3: '주문하기',
    4: '계산하기',
  }

  const [currentIndex, setCurrentIndex] = useState<string>('1')

  const homeClickHandler = () => {
    router.push('/')
  }

  const indexClickHandler = (index: string) => {
    setCurrentIndex(index)
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerRight}>
          <div className={styles.homeAndSignout}>
            <div className={styles.home} onClick={homeClickHandler}>홈으로</div>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.bodyLeft}>
          <div className={styles.index}>
            {Object.keys(indexList).map(index => (
              <div key={index} className={`${styles.indexItem} ${currentIndex === index ? styles.currentIndexItem : ''}`} onClick={() => indexClickHandler(index)}>{index}. {indexList[index]}</div>
            ))}
          </div>
        </div>
        <div className={styles.bodyRight}>
          {currentIndex === '2' ? <CustomMenu />
          : currentIndex === '3' ? <Order />
          : currentIndex === '4' ? <BillPay />
          : <Signup />}
        </div>
      </div>
    </div>
  )
}
