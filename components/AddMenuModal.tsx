import styles from '../styles/AddMenuModal.module.css'

export default function AddMenuModal(){
  return (
    <div className={styles.container}>
      <div>이미지 추가</div>
      <input placeholder="제품 이름"></input>
      <input placeholder="제품 가격"></input>
      <input placeholder="제품 설명"></input>
      <button>추가하기</button>
    </div>
  )
}
