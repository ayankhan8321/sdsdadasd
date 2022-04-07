import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import SmartSwapRouter02 from '../abis/swapAbiForDecoder.json';
import { timeConverter, getTokenSymbol, formatAmount, APIENDPOINT, APIKEY } from "./useAccountHistory";
import { AUTOSWAPV2ADDRESSES, SMARTSWAPROUTER, WNATIVEADDRESSES } from "../addresses";
import { getERC20Token } from '../utilsFunctions';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import { useLocation } from 'react-router-dom';
import { useNativeBalance } from './useBalances';
import { SmartSwapRouter } from '../Contracts';
import { ethers } from 'ethers';


const abiDecoder = require('abi-decoder');

interface DataIncoming {
    inputAmount: string,
    outputAmount: string,
    tokenIn: string,
    tokenOut: string,
    time: string,
    name: string,
    frequency: string,
    id: string,
    transactionHash: string,
    error: [],
    status: number,
    currentToPrice?: string,
    chainID?:string,
    situation?:string,
    expectedUserPrice?:string
}

const useOpenOrders = () => {
    const { account, chainId, library } = useWeb3React();
    const [loadOpenOrders, setloadOpenOrders] = useState(false);
    const [openOrderData, setopenOrderData] = useState({} as any);
    const [stateAccount, setStateAccount] = useState(account)
    const [locationData, setLocationData] = useState("swap")
    const [URL, setURL] = useState("https://rigelprotocol-autoswap.herokuapp.com")
    const [contractAddress, setContractAddress] = useState(SMARTSWAPROUTER[chainId as number])
    const refreshPage = useSelector((state: RootState) => state.transactions.refresh);
    const location = useLocation().pathname;
    const [, Symbol, Name,] = useNativeBalance()
    function decodeInput(input: string, ABI: any) {
        abiDecoder.addABI(ABI);
        let decoder = abiDecoder.decodeMethod(input);
        return decoder
    }
    useEffect(() => {
        if (location === "/auto-time") {
            setLocationData("auto")
            setStateAccount("0x97C982a4033d5fceD06Eedbee1Be10778E811D85")
            setContractAddress(AUTOSWAPV2ADDRESSES[chainId as number])
        } else if (location === "/set-price") {
            setLocationData("price")
            setStateAccount("0x97C982a4033d5fceD06Eedbee1Be10778E811D85")
            setContractAddress(AUTOSWAPV2ADDRESSES[chainId as number])
        } else {
            setLocationData("swap")
            setStateAccount(account)
            setContractAddress(SMARTSWAPROUTER[chainId as number])
        }
    }, [location, chainId])
    useEffect(() => {
        // setURL("http://localhost:7000")
        getMarketData();
    }, [chainId, account, contractAddress,refreshPage,locationData]);

    const tokenList = async (addressName: string) => {
        const token = await getERC20Token(addressName, library);
        const name = token.name();
        const symbol = token.symbol();
        const { address } = token;
        const decimals = token.decimals();
        const standardToken = await Promise.all([name, symbol, address, decimals]);
        const resolveToken = {
            name: standardToken[0],
            symbol: standardToken[1],
            address: standardToken[2],
            decimals: standardToken[3]
        };
        return address !== '0x' ? resolveToken : null;
    };
    
    const getTransactionFromDatabase = async (address: string) => {
        console.log({URL})
        const data = await fetch(`${URL}/auto/data/all/${address}`)
        const transaction = await data.json()
        const transactions = transaction[0].transaction.filter((item:any)=>item.status===2)
        return transactions
    }



        const getMarketData = async () => {
            if ((account && contractAddress && locationData)) {
                setloadOpenOrders(true);
                try {
                    let dataToUse =[]
                    const transaction = await getTransactionFromDatabase(account)
                    console.log({transaction})
                    if (transaction.length > 0) {
                        let result = []
                        if (locationData === "auto") {
                            let data = transaction.filter((data: any) => data.typeOfTransaction === "Auto Time")
                            console.log({data})
                            result = data.filter((item:any)=>item.status===2 && item.errorArray.length===0 && item.transactionHash === "")
                        }else if (locationData === "price") {
                            let data = transaction.filter((data: any) => data.typeOfTransaction === "Set Price")
                            // .sort((a: any, b: any) => new Date(b.time * 1000) - new Date(a.time * 1000))
                            result = data.filter((item:any)=>item.status===2 && item.errorArray.length===0 && item.transactionHash === "")
                        }
                        console.log({result})
                        dataToUse = await Promise.all(result.map(async (data: any) => {
                            
                            return {
                                inputAmount: data.amountToSwap,
                                outputAmount: data.userExpectedPrice,
                                tokenIn: data.swapFromToken,
                                tokenOut: data.swapToToken,
                                time: data.time && timeConverter(parseInt(data.time)),
                                name: data ? data.typeOfTransaction : "",
                                frequency: data ? data.frequency : "--",
                                id: data ? data.id : "",
                                transactionHash: data.transactionHash,
                                error: data.errorArray,
                                status: data.status,
                                currentToPrice: data.typeOfTransaction === "Set Price" ? data.currentToPrice : data.percentageChange,
                                chainID:data.chainID ,
                                rate:`${data.currentNumber} / ${data.totalNumberOfTransaction}`,
                                situation: data.situation,
                                _id:data._id
                            }
                        })
                        )
                    
                }
                console.log({dataToUse})
                const marketSwap = await Promise.all(
                    dataToUse.map(async (data: any) => ({
                        tokenIn: data.tokenIn === "native" ? {
                            name: Name,
                            symbol: Symbol,
                            address: WNATIVEADDRESSES[chainId as number],
                            decimals: 18
                        } : await tokenList(data.tokenIn),
                        tokenOut: data.tokenOut === "native" ? {
                            name: Name,
                            symbol: Symbol,
                            address: WNATIVEADDRESSES[chainId as number],
                            decimals: 18
                        } : await tokenList(data.tokenOut),
                        amountIn: data.inputAmount,
                        amountOut: data.outputAmount,
                        time: data.time,
                        name: data.name,
                        frequency: data.frequency,
                        id: data.id,
                        transactionHash: data.transactionHash,
                        error: data.error,
                        status: data.status,
                        currentToPrice: data.currentToPrice,
                        chainID:data.chainID,
                        rate:data.rate,
                        situation:data.situation,
                        _id:data._id
                    })),
                );
                    const marketHistory = marketSwap.map((data) => ({
                        token1Icon:
                            getTokenSymbol(data.tokenIn.symbol),
                        token2Icon:
                            getTokenSymbol(data.tokenOut.symbol),
                        token1: data.tokenIn,
                        token2: data.tokenOut,
                        amountIn: formatAmount(data.amountIn, data.tokenIn.decimals),
                        amountOut:  parseFloat(data.amountOut).toFixed(4),
        
                        time: data.time,
                        name: data.name,
                        frequency: data.frequency,
                        id: data.id,
                        transactionHash: data.transactionHash,
                        error: data.error,
                        status: data.status,
                        currentToPrice: data.currentToPrice,
                        chainID:data.chainID,
                        rate:data.rate,
                        situation:data.situation,
                        _id:data._id
                    }));

                    setopenOrderData(marketHistory);
                    setloadOpenOrders(false);

                } catch (e) {
                    console.log(e);
                    setopenOrderData({});
                    setloadOpenOrders(false);
                }
            } else {
                console.log('Connect your wallet')
            }

        };
    return { openOrderData, loadOpenOrders };

};

export default useOpenOrders;