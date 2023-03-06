import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { signin, signout, selectUser } from '../app/slice/userSlice'
import { persistor } from '../app/store'
import { useAppSelector } from '../app/hooks';
import { auth, onAuthStateChanged, signOut } from './api/firebase'
import styles from '../styles/Home.module.css'
import LandingPage from '../components/LandingPage'

export default function Home() {
  const user = useAppSelector(selectUser)

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdTokenResult(false).then((idTokenResult) => {
          dispatch(signin(idTokenResult))
        })
        return
      }

      dispatch(signout())
    })
  },[])

  const howToUseClickHandler = () => {
    router.push('/how-to-use')
  }

  const orderPageClickHandler = () => {
    router.push('/')
  }

  const adminPageClickHandler = () => {
    if(!user) {
      return
    }
    
    router.push(`/admin/${user?.claims.user_id}`)
  }

  const signoutClickHandler = () => {
    signOut(auth)
    persistor.purge()
  }

  const signinClickHandler = () => {
    router.push('/signin')
  }

  const signupClickHandler = () => {
    router.push('/signup')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft} onClick={howToUseClickHandler}>사용법</div>
        <div className={styles.headerLeft} onClick={orderPageClickHandler}>주문 페이지</div>
        <div className={styles.headerLeft} onClick={adminPageClickHandler}>관리자 페이지</div>
        <div className={styles.headerRight}>
          {user ? 
            <div className={styles.headerSignout} onClick={signoutClickHandler}>로그아웃</div> 
            :
            <div className={styles.signinAndSignout}>
              <div className={styles.signin} onClick={signinClickHandler}>로그인</div>
              <div className={styles.signup} onClick={signupClickHandler}>회원가입</div>
            </div>
          }
        </div>
      </div>
      <div className={styles.body}>
        <LandingPage />
      </div>
    </div>
  )
}
