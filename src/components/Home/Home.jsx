import React from 'react'
import styles from './Home.module.css'  
import logo from '../../assets/LaPulga.png'
function Home() {
  return (
    <div className={styles.main}>
    <div className={styles.heading}>
        <img src={logo} alt="logo" className={styles.logo} />
        <h2>Welcome to La Pulga Collectibles</h2>

    </div>
    <div className={styles.content}>
        <p>Welcome to Collectible Mart, your one-stop shop for all your collectible needs.</p>
    </div>
    </div>
  )
}

export default Home