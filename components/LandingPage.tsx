import { useRouter } from 'next/router'
import styles from '../styles/LandingPage.module.css'

export default function LandingPage(){
  const router = useRouter()

  const howToUseClickHandler = () => {
    router.push('/how-to-use')
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.centerBox}>
        <div className={styles.header}>FREESK</div>
        <div className={styles.body}>
          <div>우리 가게만의 키오스크 시스템을</div>
          <div>구축하고 운영해보세요!</div>
        </div>
        <div className={styles.howToUseButton} onClick={howToUseClickHandler}>사용법 알아보기</div>
      </div>
    </div>
  )
}
