import Head from 'next/head'
import 'bulma/css/bulma.css'
import styles from '../../styles/Home.module.css'

export default function FirstPost() {
    return (

        <div>
        <Head>
          <title> RoyalRaffle.eth  </title> 
          <meta name="description" content="RoyalRaffle - Ethereum Lottery" />
          <link rel="icon" href="/favicon.ico" />
          <link relation="stylesheet" href="css/styles1.css" />
          <link relation="stylesheet" href="/Home.module.css"/>
          
  
        </Head>
  
        <main className={styles.main}>
        
         <nav className= ' navbar mb-3 is-fixed-top' id='nav'>
         <div className='container'>
          
            <div className='navbar-brand'>
              
              <a className='navbar-item' href="/">
                <img src= '/powered_eth.png'  ></img> 
               </a> 
                <a  role="button" class="navbar-burger " aria-label="menu" aria-expanded="false" data-target="navbarItems">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>  
              
            </div>
            
  
          <div id="navbarItems" class="navbar-menu">
            <div class="navbar-start">
  
      </div>
      </div>
  
            <div className='navbar-end'>
            <a href='/posts/contact' class="navbar-item ">
          Contact
        </a>
  
        <a href='/posts/faq' class="navbar-item">
          FAQ
        </a>
        
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            More Games
          </a>
  
          <div class="navbar-dropdown">
            <a href='#' class="navbar-item">
              Sol Lottery
            </a>
            <a class="navbar-item">
              Bitcoin Lottery
            </a>
            <hr class="navbar-divider"/>
            <a class="navbar-item">
              Report an issue
            </a>
  
          </div>
          </div>
          </div>
          
          </div>    
         </nav>
        
         
        </main>
        </div>
    )
}