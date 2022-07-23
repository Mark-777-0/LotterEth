# LotterEth
<a href='https://lotter-eth.vercel.app/' rel='noreferrer' target='_blank' >

![LotterETH](https://github.com/Mark-777-0/LotterEth/blob/main/github-assets/logo.png)

</a>


## Want to see the code in action? Check out the [Vercel Demo](https://lotter-eth.vercel.app/)

# Technical/Reflection

LotterETH is a smart contract lottery hosted on the ethereum blockchain that is integrated into a React App on Next.js. The code is not the cleanist and the styling is global. I was not very far along when learning React and Next, and thus the formatting is not optimal, and there are certainly parts of the page that deserve their own functional components but do not have them. Unlike my [Personal Website](https://www.mark-h-daniel.com/) which has many standard functional components with individual style sheets.

I have organized the code using prettier formatting

I learned quite a lot about Solidity, ABIs, and javascript while putting this project together. I worked with Truffle and Infura and it took quite a long time to get every part running in place! 

### Future and Things to Improve
The game is deployed on the Rinkeby Test Network, which is set to go down sometime in 2023. If I get the time I will move the Smart Contract over blockchains and attempt to redeploy.

The number generation is **pseudorandom**, and should use a blockchain oracle service in the future if it were to be a legitimate game.

The admin having to end every game is not the best implementation and a blockchain nudge service could be used to trigger this every 7 days or some other time interval for a more consistent game.


### Rules
<ol>
 <li> 
Participants can buy tickets for .01 ETH
   </li>
     <li>
Admin (the wallet that deployed the Smart Contract) can end the lottery at any time.
     </li>
       <li>
5% of total lottery pot get's sent to the Admin Wallet, 95% is sent to the winner
         </li>
  
</ol>


## Run It Yourself

`git clone`  the repository

`cd` to the dapp

`npm run dev` to intialize the code locally 

`npm start` to intilize the sass and css auto-updating for Bulma


