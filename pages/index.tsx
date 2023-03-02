import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { signin, signout, selectUser } from '../app/slice/userSlice'
import { persistor } from '../app/store'
import { useAppSelector } from '../app/hooks';
import { auth, onAuthStateChanged, signOut } from './api/firebase'
import styles from '../styles/Home.module.css'
import LandingPage from '../components/LandingPage'
import HowToUse from '../components/HowToUse'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string>('')

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
    setCurrentPage('howToUse')
  }

  const orderPageClickHandler = () => {
    router.push('/')
  }

  const adminPageClickHandler = () => {
    router.push('/')
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
    <div>
      <div className={styles.header}>
        <span onClick={howToUseClickHandler}>사용법</span>
        <span onClick={orderPageClickHandler}>주문 페이지</span>
        <span onClick={adminPageClickHandler}>관리자 페이지</span>
        {user ? 
          <span onClick={signoutClickHandler}>로그아웃</span> 
          :
          <span>
            <span onClick={signinClickHandler}>로그인</span>
            <span onClick={signupClickHandler}>회원가입</span>
          </span>
        }
      </div>
      {currentPage ? <HowToUse /> : <LandingPage /> }
    </div>
  )
}
