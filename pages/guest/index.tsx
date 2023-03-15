import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../app/hooks';
import { signout, selectUser } from '../../app/slice/userSlice'
import { persistor } from '../../app/store'
import { auth, signOut } from '../api/firebase'


export default function GuestPage(){
  const user = useAppSelector(selectUser)
  
  const router = useRouter()
  const dispatch = useDispatch()
  
  const [tableNumber, setTableNumber] = useState<number>(0)

  const tableNumberChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value.replace(/[^0-9]/g,'')
    
    setTableNumber(parseInt(price))
  }

  const moveGuestPageClickHandler = () => {
    // prevent customer from try to connect admin page
    signOut(auth)
    dispatch(signout())
    persistor.purge()
    
    router.push(`/guest/${user?.claims.user_id}/${tableNumber}`)
  }

  return (
    <div>
      <div>테이블 번호를 입력해 주세요.</div>
      <input value={tableNumber} type="number" onChange={tableNumberChangeHandler}></input>
      <button onClick={moveGuestPageClickHandler}>입장</button>
    </div>
  )
}
