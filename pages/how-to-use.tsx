import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { persistor } from '../app/store'
import { auth, signOut } from './api/firebase'
import type { Index } from '../interfaces'
import styles from '../styles/HowToUse.module.css'

export default function HowToUse() {
  const router = useRouter()

  const indexList: Index = {
    1: '회원 가입',
    2: '메뉴 커스텀',
    3: '테이블 입력',
    4: '주문하기',
    5: '계산하기',
  }

  const [currentIndex, setCurrentIndex] = useState<string>('1')

  const homeClickHandler = () => {
    router.push('/')
  }

  const signoutClickHandler = () => {
    signOut(auth)
    persistor.purge()
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
            <div className={styles.signout} onClick={signoutClickHandler}>로그아웃</div>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.bodyLeft}>
          <div className={styles.index}>
            {Object.keys(indexList).map(index => (
              <div className={`${styles.indexItem} ${currentIndex === index ? styles.currentIndexItem : ''}`} onClick={() => indexClickHandler(index)}>{index}. {indexList[index]}</div>
            ))}
          </div>
        </div>
        <div className={styles.bodyRight}>
          
        </div>
      </div>
    </div>
  )
}
