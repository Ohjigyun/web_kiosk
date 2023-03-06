import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useGetUserInfoQuery } from '../../app/slice/apiSlice'
import { selectUser } from '../../app/slice/userSlice'
import { useAppSelector } from '../../app/hooks'


export default function AdminPage(){
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

  useEffect(() => {
    if(!user) {
      router.push('/')
      return
    }

    if(!data) {
      router.push('/')
      return
    }
  })

  return (
    <div>
      {isLoading ? "Loading ...." : <div>Admin Page </div>}
    </div>
  )
}
