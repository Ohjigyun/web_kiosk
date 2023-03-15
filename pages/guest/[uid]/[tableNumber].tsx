import styles from '../../../styles/GuestOrderPage.module.css'

export default function GuestOrderPage(){
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        header
      </div>
      <div className={styles.body}>
        <div className={styles.menu}>menu</div>
        <div className={styles.cart}>cart</div>
      </div>
    </div>
  )
}
