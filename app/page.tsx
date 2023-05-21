import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/logo2.png"
          alt="Argul Logo"
          width={180}
          height={180}
          priority
        />
      </div>
    </main>
  )
}
