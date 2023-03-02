import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { auth } from './api/firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth'
import { useAppSelector } from '../app/hooks'
import { selectUser } from '../app/slice/userSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
import styles from '../styles/Signin.module.css'

export default function Signin() {
    const router = useRouter()

    const user = useAppSelector(selectUser)

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                router.push('/')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            })
    }

    const googleLogin = () => {
        const provider = new GoogleAuthProvider()

        signInWithPopup(auth, provider)
            .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            router.push('/')
            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log(error)
            });
    }

    const githubLogin = () => {
        const provider = new GithubAuthProvider()

        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a GitHub Access Token. You can use it to access the GitHub API.
          const credential = GithubAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
      
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          router.push('/')
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GithubAuthProvider.credentialFromError(error);
          // ...
        });
    }

    useEffect(() => {
        if(user) {
            router.push('/')
        }
      }, [user])

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <div className={styles.header}>로그인</div>
                <form onSubmit={submitHandler}>
                    <div className={styles.emailBox}>
                        <div className={styles.emailHeader}>이메일</div>
                        <input
                            className={styles.email}
                            type='text'
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.passwordBox}>
                        <div className={styles.passwordHeader}>비밀번호</div>
                            <input
                                className={styles.password}
                                type='password'
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                    </div>
                    <div className={styles.buttonBox}>
                        <button className={styles.signinButton}>로그인</button>
                    </div>
                </form>
                <div className={styles.line}><span className={styles.lineText}> OR </span></div>
                <div className={styles.socialBox}>
                    <FontAwesomeIcon className={styles.faGoogle} icon={faGoogle} size='2x' onClick={googleLogin}/>
                    <FontAwesomeIcon className={styles.faGithub} icon={faGithub} size='2x' onClick={githubLogin}/>
                </div>
            </div>
        </div>
    )
}
