import React, { useState } from "react"
import {
    Button,
    Center,
    Flex,
    Image,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import ComfirmPurchase from "../../Modals/ComfirmPurchase";
import { Link } from "react-router-dom";
import {useNft, useNftName} from "../../../../hooks/useNFT";

type NftProps = {
    nftName?: string,
    image?: string
    isFeatured?: boolean,
    id: number,
    priceUSD?: number,
    priceRGP?: number,
    number?: string

}
export const FeaturedNft = function ({ nftName, image, number, id, priceUSD, priceRGP, isFeatured = false }: NftProps) {

    const [ purchaseModal,setOpenPerchaseModal] = useState(false);

  const textColor = useColorModeValue("#333333", "#F1F5F8");
  const lightTextColor = useColorModeValue("#666666", "grey");

    const { firstToken, secondToken ,prices, unsoldItems , nftId} = useNft(id, purchaseModal);

    const {name, nftImage} = useNftName(id);

    return (
        <>
        <Text color={textColor} fontWeight={700} py={10} fontSize={24}>
            Featured NFT
          </Text>
            <Center py={8}>
                <Stack
                    borderRadius="lg"
                    w={{ sm: '100%', md: '540px', lg: '900px' }}
                    // height={{ sm: '476px', md: '20rem', lg: '900px' }}
                    // maxWidth={900}
                    direction={{ base: 'column', md: 'row' }}
                    bg={useColorModeValue('white', 'gray.900')}
                    p={2}
                    
                >
                    <Flex flex={1}>
                        <Image
                            objectFit="cover"
                            boxSize="100%"
                            borderRadius={6}
                            src={nftImage}
                        />
                    </Flex>
                    <Stack
                        flex={1}
                        pl={10}
                    >
                        <Text fontWeight={700} color={textColor}  fontSize={38} pt={'25%'}>
                            {name}
                        </Text>
                        <Text align={'left'} pt={10} textColor={lightTextColor}>
                            Price
                        </Text>

                        <Text color={textColor}  fontWeight={700} fontSize={28}>
                            {prices.secondTokenPrice} USD
                        </Text>

                        <Text align={'left'}  textColor={lightTextColor}>
                            {(100.54 * parseFloat(prices.firstTokenPrice)).toFixed(2)} RGP
                        </Text>

                        <Flex  pt={20} alignContent="center" >
                            <Button  onClick={()=>setOpenPerchaseModal(true) } width={'45%'} variant={'brand'}>Buy NFT</Button>
                            <Button
                                ml={5}
                                textColor={'#319EF6'}
                                borderRadius="6px"
                                borderColor={'#319EF6'}
                                variant='outline'
                                width={'45%'}
                            >
                                <Link to={`/nfts/${id}`}>View NFT</Link>
                                </Button>
                        </Flex>

                    </Stack>
                </Stack>
            </Center>
            <ComfirmPurchase isOpen={purchaseModal} close={()=>setOpenPerchaseModal(false)} id={1} image={nftImage} />
        </>
    )
};
export default FeaturedNft

