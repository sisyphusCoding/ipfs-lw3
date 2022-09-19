import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Core  from 'web3modal'
import Web3Modal from 'web3modal'

import {Contract, providers, utils} from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import { get } from 'https'
import { abi, NFT_CONTRACT_ADDRESS } from '../constants'


const Home: NextPage = () => {

interface thisProvider extends providers.Web3Provider{
    getAddress() : Promise<string>
  }

interface thisSigner extends providers.JsonRpcSigner{
    getAddress() : Promise<string>
  }

  const [tokensMinted, setTokensMinted] = useState('0')

  const [loading, setLoading] = useState<boolean>(false)

  const [walletConnected, setWalletConnected] = useState<boolean>(false)

  const web3ModalRef = useRef<Web3Modal>()


  const publiceMint =  async() => {
    try{
    console.log('Public Mint')


      setLoading(true)
      const signer = await getProviderOrSigner(true)

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,abi,signer
      )

      const tx = await nftContract.mint({
        value:utils.parseEther('0.001')
      })


      await tx.wait()

      setLoading(false)

      window.alert('You successfully minted a LW3Punk')

}
    catch(err){
      console.log(err)

      setLoading(false)
    }
 
  }

  const getTokensMinted =  async() => {
    try{

      const provider = await getProviderOrSigner()


      
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,abi,provider
      )

      const _tokenIds = await nftContract.tokenIds()

      console.log('tokenIds',_tokenIds)

      setTokensMinted(_tokenIds.toString())

    }
    catch(err){console.log(err)}
  }


  const connectWallet =  async() => {
    try{
      await getProviderOrSigner()
      setWalletConnected(true)
    }
    catch(err){console.log(err)}
  }

  useEffect(() => {
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network:'mumbai',
        providerOptions:{},
        disableInjectedProvider:false
      })     
    }
    connectWallet()
    getTokensMinted()

    setInterval(async function(){
      await getTokensMinted()

    },5*1000)
  }, [walletConnected])


  const getProviderOrSigner = async(needSigner:boolean = false) => {
    const provider = await web3ModalRef.current?.connect()

    const web3Provider = new providers.Web3Provider(provider)

    const {chainId} = await web3Provider.getNetwork()

    if(chainId !== 80001){
      window.alert('Connect to Mumbai')
      throw new Error('Connect to Mumbai')
    }

    if(needSigner){
      const signer  = web3Provider.getSigner()
      return signer as thisSigner
    }

    return web3Provider as thisProvider

  } 

  const renderButton = ( ) => {
    if(!walletConnected){
      return(
      <button 
      className=' 
          bg-sky-700 text-zinc-200
          px-4 py-2 rounded-xl shadow-[0_5px_10px_rgba(0,0,0,.5)]'
       onClick={connectWallet}>
          Connect Wallet
        </button>
      )
    }
   if(loading){
      return <p className='
        animate-spin
      h-12 w-12
      rounded-full 
      border-zinc-700   
      border-r-white border-4

      ' 
        />
    } 

    return(
      <button
        onClick={publiceMint}
       className='
        text-zinc-200 
        px-4 py-2 
        rounded-xl
shadow-[0_5px_10px_rgba(0,0,0,.5)]
        bg-sky-700'
       >
        Public Mint 🚀
      </button>
    )

  }


  return (
    <div 
      className='
        text-zinc-700
        flex items-center justify-center
        min-h-screen bg-zinc-300
      '
    >
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <main
       className='
        p-5
        bg-zinc-200
        shadow-xl
        rounded-2xl
        flex lg:flex-row flex-col items-center justify-center gap-5'
       >
    
        <section
         className='
          flex flex-col gap-4
          items-start
          justify-center
          p-5 w-[40vmin] ' 
          >
          <h1 
          className='font-semibold text-xl md:text-2xl'
           >
            Its and NFT collection for LearnWeb3 Students.
          </h1>
          <h3>
            {tokensMinted} / 10 have been minted
          </h3>

            {renderButton()}
        </section>

        <section 
        className='
          lg:w-[50vmin]
          w-[90vmin]
          shadow-xl
          rounded-3xl
          overflow-hidden
          '>
          <Image 
            layout='responsive'
            width={100} height={50}
            objectFit='cover'
            src={'/learnweb3punks.png'} />
        </section>

      </main>


    </div>
  )
}

export default Home
