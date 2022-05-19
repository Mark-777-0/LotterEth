import { useState, useEffect } from 'react'
import Head from 'next/head'
import Web3 from 'web3'
import lotteryContract from '../blockchain/lottery'
import styles from '../styles/Home.module.css'



export default function Home() {
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState()
  const [lcContract, setLcContract] = useState()
  const [lotteryPot, setLotteryPot] = useState()
  const [lotteryPlayers, setPlayers] = useState([])
  const [lotteryHistory, setLotteryHistory] = useState([])
  const [lotteryId, setLotteryId] = useState()
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')


  useEffect(() => {
    
    updateState()
    }, [lcContract])
  


  const updateState = () => {
    if (lcContract) getPot() 
    if (lcContract) getPlayers()
    if (lcContract) getLotteryId()
  }

  const getPot= async () => {
    const pot = await lcContract.methods.getBalance().call()
    setLotteryPot(web3.utils.fromWei(pot,'ether'))
    
  }
  const getPlayers= async () => {
    const players = await lcContract.methods.getPlayers().call() ///fetch players from sc then set players variable
    setPlayers(players)
    
  }


  const getHistory = async (id) => {

    setLotteryHistory([])
    for (let i = parseInt(id); i>0; i--) {
      const winnerAddress = await lcContract.methods.lotteryHistory(i).call()
      const historyObj ={}
      historyObj.id = i
      historyObj.address = winnerAddress
      setLotteryHistory(lotteryHistory => [...lotteryHistory, historyObj])

    }
     

  
  }

  const getLotteryId = async () => {
    const history = await lcContract.methods.lotteryId().call()
    setLotteryId(history)
    await getHistory(lotteryId)
  }
  const enterLotteryHandler  = async() => {
    setSuccessMsg('')
    try{
      await lcContract.methods.enter().send({
        from: address,
        value: 11000000000000000, ///web3.utils.toWei('0.01', 'ether'),
        gas: 300000,
        gasPrice: null
    }) ///catch errors
    updateState()
    } catch(err) {
      setError(err.message)
    }
    }

  const pickWinnerHandler  = async() => {
    setError('')
    try{
      await lcContract.methods.pickWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null
    }) ///catch errors
    const winnerAddress= await lcContract.methods.lotteryHistory(lotteryId).call()
    setSuccessMsg(`The Winner is ${winnerAddress}`)
    updateState()
    } catch(err) {
      setError(err.message)
    }
    }

  

  const connectWalletHandler = async() =>{
    setError('')
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
        /// check if Metamask installed and we are in a browser environment
        try{
          ///request wallet
          await window.ethereum.request({ method: 'eth_requestAccounts'})
          
          ///create web3 instancce and set to state
          const web3 = new Web3(window.ethereum)
          setWeb3(web3)

          /// get list of accounts
          const accounts = await web3.eth.getAccounts();
          
          ///account 1 to react state
          setAddress(accounts[0])

          ///creating local contract copy
          const lc = lotteryContract(web3)
          setLcContract(lc)

          window.ethereum.on('accountsChanged', async () => {
            const accounts = await web3.eth.getAccounts()
            console.log(accounts[0])
            /* set account 1 to React state */
            setAddress(accounts[0])
          })

        } catch(err){
          setError(err.message)
        }
      } else {
        /// If they don't have a wallet
        console.log("Please Install MetaMask")
      }
  }

  const menuHandler =() => {

  }

  return (
    <div >
      <Head>
        <title> LotterEth  </title> 
        <meta name="description" content="RoyalRaffle - Ethereum Lottery" />
        <link rel="icon" href="/favicon.ico" />
        <link relation="stylesheet" href="css/styles1.css" />
        <link relation="stylesheet" href="/Home.module.css"/>
        

      </Head>

      <main className={styles.main}>
      
       <nav className= {`${styles.nav_main} navbar mb-3 is-fixed-top`} id='nav'>
       <div className='container'>
        
          <div className='navbar-brand'>
            
            <a className='navbar-item' href="/">
              <img src= '/powered_eth.png'  ></img> 
             </a> 
              <a onClick={menuHandler} role="button" class="navbar-burger " aria-label="menu" aria-expanded="false" data-target="navbarItems">
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

      <a href='/posts/FAQ' class="navbar-item">
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
      <button id="wallet" onClick={connectWalletHandler} className={`${styles.wallet_button} button is-link`}> Connect Wallet </button>
          </div>
          </div>
       </nav>
      







       <div className='container'>
         <section className='mt-5'>
           <div className='box_in'> 
           <div className='columns'> 
           <div className='column is-two-thirds '>
             
             <section className='mt-5'>
               <p className='plain'> <b> Enter the lottery by sending 0.01 Ether  </b></p>
               <button onClick={enterLotteryHandler} className='button is-link is-large is-light mt-3'>Play Now</button>
             </section>
             <section className='mt-6'>
               <p className='plain'> <b> Admin Only </b> </p>
               <button onClick={pickWinnerHandler} className='button is-primary is-large is-light mt-3'> End Game</button>
             </section>
             <section>

               <div className='container mt-6 notification is-success'>
                 <p className='plain'> <b> Winners  </b></p>
                   <p> {successMsg} </p>
                 
                 </div>
               </section>
             <section>
               <div className='container mt-6 notification is-danger'>
               <p className='plain'> <b> Errors </b></p>
                 <p> {error} </p>
               </div>
             </section>

             </div>
           <div className={`${styles.lotteryinfo} column is-one-third` } >
             <section className='mt-5'>
               <div className='card'>
                 <div className='card-content'>
                  <div className='content'>
                    <h2> Players ({lotteryPlayers.length}) </h2>
                    <div className='history-entry'>
                      
                      <div> <ul className='ml-0'> 
                      { ///check if it exists, if there are more than 0 as well
                        (lotteryPlayers && lotteryPlayers.length >0) && lotteryPlayers.map((player, index) => {
                        return <li key={`${player}-${index}`}> <a href={`https://etherscan.io/address/${lotteryPlayers}`} target='_blank' > 
                        {player.slice(0,5) +'.....' +player.slice(32,)} </a> 
                        </li> 
                        })
                        }
                        </ul> </div>
                     

                    </div>
                  
                  </div>
                 </div>
               </div>
             </section>
             <section className='mt-5'>
               <div className='card'>
                 <div className='card-content'>
                  <div className='content'>
                    <h2> Stake </h2>
                    <p> {lotteryPot} Ether</p>

                   
                  
                  </div>
                 </div>
                 <br/>

               </div>
             </section>
             
             
             </div>
             </div>
            
             <section> 
          <div className='card'>
          <div className='card-content'>
          <div className='content'>
        <div class="buttons has-addons is-centered">

        <button class="button is-link is-selected">0</button>
        <button class="button ">1</button>
        <button class="button ">2</button>
        <button class="button ">3</button>
        <button class="button ">4</button>
        <button class="button ">5</button>
        <button class="button ">6</button>
        <button class="button ">7</button>
        <button class="button ">8</button>
        <button class="button ">9</button>
        <button class="button is-link">a</button>
        <button class="button is-link">b</button>
        <button class="button is-link">c</button>
        <button class="button is-link">d</button>
        <button class="button is-link">e</button>
        </div>
        </div>
        </div>
        </div>
        </section>

             </div>
              
         </section>
          
          
         <section className='mt-5' >
               <div className='card'>
                 <div className='card-content'>
                  <div className='content'>
                    <h2> Lottery History</h2>
                    {
                      (lotteryHistory && lotteryHistory.length >0) && lotteryHistory.map(item => {
                        //if not current lottery display
                      if (lotteryId != item.id){
                        return <div className='history-entry mt-2' key={item.id}>
                        <div> Lottery #{item.id} winner: 
                        <div>
                          <a href= {`https://etherscan.io/address/${item.address}`} target='_blank' >
                              {item.address}
                          </a> 
                        </div>
                        </div>
                        </div> }
                      })
                    }
          
                  
                  </div>
                 </div>
               </div>
             </section>
       </div>
      </main>






      <footer className='footer footer-background-color'>
      <div className="footer__container">
            <div className="footer__links">
              <div className="footer__link--wrapper">
                <div className="footer__link--items">
                  <h2>About Us</h2>
                  <a href="/sign__up">How it works</a> <a href="/">Testimonials</a>
                  <a href="/">Careers</a> <a href="/">Investments</a>
                  <a href="/">Terms of Service</a>
                </div>
                <div className="footer__link--items">
                  <h2>Contact Us</h2>
                  <a href="/">Contact</a> <a href="/">Support</a>
                  <a href="/">Destinations</a> <a href="/">Sponsorships</a>
                </div>
              </div>
              <div className="footer__link--wrapper">
                <div className="footer__link--items">
                  <h2>Videos</h2>
                  <a href="/">Submit Video</a> <a href="/">Ambassadors</a>
                  <a href="/">Agency</a> <a href="/">Influencer</a>
                </div>
                <div className="footer__link--items">
                  <h2>Social Media</h2>
                  <a href="/">Instagram</a> <a href="/">Facebook</a>
                  <a href="/">Youtube</a> <a href="/">Twitter</a>
                </div>
              </div>
            </div>
            <section className="social__media">
              <div className="social__media--wrap">
                <div className="footer__logo">
                  <a href="/" id="footer__logo">  </a>
                </div>
                <p className="website__rights">&copy; LotterEth 2022. All rights reserved</p>
                <div className="social__icons">
                  <a
                    className="social__icon--link"
                    href="/"
                    target="_blank"
                    aria-label="Facebook"
                  >
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a
                    className="social__icon--link"
                    href="/"
                    target="_blank"
                    aria-label="Instagram"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    className="social__icon--link"
                    href="//www.youtube.com/"
                    target="_blank"
                    aria-label="Youtube"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a
                    className="social__icon--link"
                    href="/"
                    target="_blank"
                    aria-label="Twitter"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    className="social__icon--link"
                    href="https://www.linkedin.com/company/clever-nutrition-llc/"
                    target="_blank"
                    aria-label="LinkedIn"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>

                </div>
              </div>
            </section>
          </div>
      </footer>
    </div>
  )
}