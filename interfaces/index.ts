import firebase from 'firebase/auth'

export type User = firebase.User

export interface UserParams {
  user_email: string,
  user_id: string
}
