import React, {
  useState,
  useEffect,
  updateState,
  Component,
  createRef,
} from "react";
import Head from "next/head";
import Web3 from "web3";
import lotteryContract from "../blockchain/lottery";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [web3, setWeb3] = useState();
  const [address, setAddress] = useState();
  const [lcContract, setLcContract] = useState();
  const [lotteryPot, setLotteryPot] = useState();
  const [lotteryPlayers, setPlayers] = useState([]);
  const [lotteryHistory, setLotteryHistory] = useState([]);
  const [lotteryId, setLotteryId] = useState();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [modal, setModal] = useState(false);
  const [menu, setMenu] = useState(true)

  const modalHandler = () => {
    setModal(!modal);
  };

  //update state should happen upon any page changes, so user is updated to game
  useEffect(() => {
    updateState();
  }, [lcContract]);

  const updateState = () => {
    if (lcContract) getPot();
    if (lcContract) getPlayers();
    if (lcContract) getLotteryId();
  };

  const getPot = async () => {
    const pot = await lcContract.methods.getBalance().call();
    setLotteryPot(web3.utils.fromWei(pot, "ether"));
  };

  const getPlayers = async () => {
    const players = await lcContract.methods.getPlayers().call(); ///fetch players from sc then set players variable
    setPlayers(players);
  };

  const getHistory = async (id) => {
    setLotteryHistory([]);
    for (let i = parseInt(id); i > 0; i--) {
      const winnerAddress = await lcContract.methods.lotteryHistory(i).call();
      const historyObj = {};
      historyObj.id = i;
      historyObj.address = winnerAddress;
      setLotteryHistory((lotteryHistory) => [...lotteryHistory, historyObj]);
    }
  };

  const getLotteryId = async () => {
    const history = await lcContract.methods.lotteryId().call();
    setLotteryId(history);
    await getHistory(lotteryId);
  };
  const enterLotteryHandler = async () => {
    setSuccessMsg("");
    try {
      await lcContract.methods.enter().send({
        from: address,
        value: 11000000000000000, ///web3.utils.toWei('0.01', 'ether'),
        gas: 300000,
        gasPrice: null,
      }); ///catch errors
      updateState();
    } catch (err) {
      setError(err.message);
    }
  };

  const pickWinnerHandler = async () => {
    setError("");
    try {
      await lcContract.methods.pickWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      }); ///catch errors
      const winnerAddress = await lcContract.methods
        .lotteryHistory(lotteryId)
        .call();
      setSuccessMsg(`The Winner is ${winnerAddress}`);
      updateState();
    } catch (err) {
      setError(err.message);
    }
  };

  const connectWalletHandler = async () => {
    setError("");
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      /// check if Metamask installed and we are in a browser environment
      try {
        ///request wallet
        await window.ethereum.request({ method: "eth_requestAccounts" });

        ///create web3 instancce and set to state
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);

        /// get list of accounts
        const accounts = await web3.eth.getAccounts();

        ///account 1 to react state
        setAddress(accounts[0]);

        ///creating local contract copy
        const lc = lotteryContract(web3);
        setLcContract(lc);

        window.ethereum.on("accountsChanged", async () => {
          const accounts = await web3.eth.getAccounts();
          console.log(accounts[0]);
          /* set account 1 to React state */
          setAddress(accounts[0]);
        });
      } catch (err) {
        setError(err.message);
      }
    } else {
      /// If they don't have a wallet
      console.log("Please Install MetaMask");
    }
  };

  const menuHandler = () => {
    setMenu(!menu)
  };

  return (
    <div>
      <Head>
        <title> LotterEth </title>
        <meta name="description" content="RoyalRaffle - Ethereum Lottery" />
        <link rel="icon" href="/favicon.ico" />
        <link relation="stylesheet" href="css/styles1.css" />
        <link relation="stylesheet" href="/Home.module.css" />
      </Head>

      <main className={styles.main}>
        <nav className={`${styles.nav_main} navbar mb-2 is-fixed-top`} id="nav">
          <div className="container" id='menus'>
            <div className="navbar-brand">
              <a className="logo" href="next/">
                <picture>
                  {" "}
                  <img src="/eth.png"></img>{" "}
                </picture>
              </a>
              <div className='mini-menu'>
              <a
                onClick={menuHandler}
                role="button"
                className="navbar-burger "
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarItems"
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>
              </div>
            </div>

            <div id="navbarItems" className='navbar-menu'>
              <div className="navbar-start"></div>
            </div>

            <div className={` ${menu && 'gone' } navbar-end`}>

              <a href="https://github.com/Mark-777-0/LotterEth" className="navbar-item">
                Fork On Github
              </a>

              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">More Things!</a>

                <div className="navbar-dropdown">
                  <a href="#" className="navbar-item">
                    Functionality Coming Soon
                  </a>
                  <a href="https://www.getmonero.org/" className="navbar-item">
                    Monero Lottery
                  </a>
                  <hr className="navbar-divider" />
                  <a className="navbar-item">Report an issue</a>
                </div>
              </div>
              <button
                id="wallet"
                onClick={connectWalletHandler}
                className={`${styles.wallet_button} button is-link`}
              >
                {" "}
                {address !== undefined
                  ? address.slice(0, 7) + "..." + address.slice(-3)
                  : "Connect Wallet"}{" "}
              </button>
            </div>
          </div>
        </nav>

        <section id="jumbotron" className="hero is-link has-text-centered">
          <div className="hero-body">
            <p className="title">
              <span className="stroke">Take a Spin at the LotterETH!</span>
            </p>
            <br></br>
            {/* I CHANGED THIS PART THE MENU AND THE FONT */}
            <p className={`${address !== undefined && "active"} subtitle`}>
              Have fun playing this test-network lottery!
            </p>
            <p className={`${address !== undefined && "active"} subtitle`}>
              Current game pot <b> {lotteryPot} ETH </b> with{" "}
              <b> {lotteryPlayers.length} </b> players.
            </p>
            <p
              className={`${
                address !== undefined && "active"
              } subtitle-updated`}
            >
              {" "}
              Connect Your Wallet to See The Game Stats!
            </p>
          </div>
          <div className="hero-footer">
            <div className="container has-text-centered">
              <div id="modal" className={`${modal && "is-active"} modal`}>
                <div onClick={modalHandler} className="modal-background"></div>
                <div className="modal-card">
                  <header className="modal-card-head">
                    <p className="modal-card-title">
                      {" "}
                      <span> How To Enter the LotterETH</span>
                    </p>
                    <button
                      onClick={modalHandler}
                      className="delete"
                      aria-label="close"
                    ></button>
                  </header>
                  <section className="modal-card-body">
                    <ol>
                      <li className="modal-li">
                        <span> Get Some Test-net ETH</span> -{" "}
                        <a href="https://rinkebyfaucet.com/">
                          {" "}
                          Rinkeby Faucet Here
                        </a>{" "}
                        and an <a href="https://metamask.io/"> ETH wallet</a> if
                        you don&apos;t have one!
                      </li>
                      <li className="modal-li">
                        <span>Buy A Ticket</span> - Each ticket costs .11 ETH,
                        and some gas. Buy as many as you like.
                      </li>
                      <li className="modal-li">
                        <span>E-mail Me</span> - The contract owner must end the
                        game by pressing the &quot;End Game&quot; button! E-mail
                        me if you&apos;d like me to demonstrate!
                      </li>
                    </ol>
                    <p id="email">
                      {" "}
                      <span>Need More Help?</span> - Contact me and I&apos;ll
                      explain any part of the code!
                    </p>
                  </section>

                  <footer className="modal-card-foot">
                    <button
                      onClick={modalHandler}
                      className="  button is-primary"
                    >
                      {" "}
                      Let&apos;s Go!
                    </button>
                  </footer>
                </div>
              </div>

              <button
                onClick={modalHandler}
                className=" js-modal-trigger is-primary button font-weight-bold"
                data-target="modal"
              >
                {" "}
                <picture>
                  {" "}
                  <img id="cog" src="../images/cog.svg"></img>{" "}
                </picture>{" "}
                Rules!{" "}
              </button>
            </div>
          </div>
        </section>

        <div className="container">
          <section className="mt-5">
            <div className="box_in">
              <div className="columns">
                <div className="column is-two-thirds ">
                  <section className="mt-5">
                    <p className="plain">
                      {" "}
                      <b> Enter the lottery by sending 0.01 Ether </b>
                    </p>
                    <button
                      onClick={enterLotteryHandler}
                      className="button is-link is-large is-primary mt-3"
                    >
                      Play Now
                    </button>
                  </section>
                  <section className="mt-6">
                    <p className="plain">
                      {" "}
                      <b> Admin Only </b>{" "}
                    </p>
                    <button
                      onClick={pickWinnerHandler}
                      className="button is-primary is-large is-light mt-3"
                    >
                      {" "}
                      End Game
                    </button>
                  </section>
                  <section>
                    <div className="container mt-6 notification is-success">
                      <p className="plain"> Winner: </p>
                      <p> {successMsg} </p>
                    </div>
                  </section>
                  <section>
                    <div className="container mt-6 notification is-danger">
                      <p className="plain"> Errors: </p>
                      <p> {error} </p>
                    </div>
                  </section>
                </div>
                <div className={`${styles.lotteryinfo} column is-one-third`}>
                  <section className="mt-5">
                    <div className="card">
                      <div className="card-content">
                        <div className="content">
                          <h2> Players ({lotteryPlayers.length}) </h2>
                          <div className="history-entry">
                            <div>
                              {" "}
                              <ul className="ml-0">
                                {
                                  ///check if it exists, if there are more than 0 as well
                                  lotteryPlayers &&
                                    lotteryPlayers.length > 0 &&
                                    lotteryPlayers.map((player, index) => {
                                      return (
                                        <li key={`${player}-${index}`}>
                                          {" "}
                                          <a
                                            href={`https://etherscan.io/address/${lotteryPlayers}`}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            {player.slice(0, 5) +
                                              "....." +
                                              player.slice(32)}{" "}
                                          </a>
                                        </li>
                                      );
                                    })
                                }
                              </ul>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="mt-5">
                    <div className="card">
                      <div className="card-content">
                        <div className="content">
                          <h2> Stake </h2>
                          <p> {lotteryPot} Ether</p>
                        </div>
                      </div>
                      <br />
                    </div>
                  </section>
                </div>
              </div>

              <section></section>
            </div>
          </section>

          <section className="mt-5">
            <div className="card">
              <div className="card-content">
                <div className="content">
                  <h2> Lottery History</h2>
                  {lotteryHistory &&
                    lotteryHistory.length > 0 &&
                    lotteryHistory.map((item) => {
                      //if not current lottery display
                      if (lotteryId != item.id) {
                        return (
                          <div className="history-entry mt-2" key={item.id}>
                            <div>
                              {" "}
                              Lottery #{item.id} winner:
                              <div>
                                <a
                                  href={`https://etherscan.io/address/${item.address}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {item.address}
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 

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
                    rel="noreferrer"
                    aria-label="Facebook"
                  >
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a
                    className="social__icon--link"
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    className="social__icon--link"
                    href="//www.youtube.com/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Youtube"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a
                    className="social__icon--link"
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Twitter"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>


                </div>
              </div>
            </section>
          </div>
      </footer> */}
    </div>
  );
}
