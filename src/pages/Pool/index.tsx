/** @format */

import { Box, Flex } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { QuestionIcon } from "@chakra-ui/icons";
import Liquidities from "./liquidities";
import { GearIcon, RefreshIcon } from "./Icons";

const Index = () => {
  const allV2PairsWithLiquidity: any[] = [];
  const stakingPairs: any[] = [];
  const v2PairsWithoutStakedAmount: any[] = [];
  const stakingInfosWithBalance: any[] = [];
  const loading = false;
  return (
    <>
      <Flex
        mx={5}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        minHeight="70vh"
        rounded="lg"
        mb={4}
      >
        <Box
          minHeight="50vh"
          w={["100%", "100%", "29.50%", "29.5%"]}
          rounded="lg"
        >
          <Box
            mt={5}
            p={5}
            backgroundColor="#FFFFFF"
            border="1px solid #DEE6ED"
            borderRadius="6px"
          >
            <Flex justifyContent="left" mb={4} flexDirection="column">
              <Flex justifyContent="space-between">
                <Text fontSize="16px" color="rgba(51, 51, 51, 1)">
                  Liquidity
                </Text>
                <Flex>
                  <Box px={2}>
                    <GearIcon />
                  </Box>
                  <Box px={2}>
                    <RefreshIcon />
                  </Box>
                </Flex>
              </Flex>

              <Text fontSize="14px" color="#666666" mt={2} cursor="pointer">
                Join liquidity pools to receive LP tokens
              </Text>
            </Flex>

            <Flex
              justifyContent="space-between"
              flexDirection={["column", "column", "column", "column"]}
            >
              <Button
                d="block"
                w={["100%", "100%", "100%", "100%"]}
                marginTop={["20px", "0px", "20px", "0px"]}
                h="50px"
                my={4}
                border="none"
                fontSize="lg"
                cursor="pointer"
                boxShadow="0px 1px 7px rgba(41, 45, 50, 0.08)"
                fontFamily="Cera Pro"
                lineHeight="24px"
                color="#FFFFFF"
                bg="#319EF6"
                borderRadius="6px"
                _hover={{ background: "rgba(64, 186, 213,0.35)" }}
                _active={{ outline: "#29235E", background: "#29235E" }}
                // onClick={() => props.addLiquidityPage("Add Liquidity", false)}
              >
                Add Liquidity
              </Button>
              <Button
                d="block"
                w={["100%", "100%", "100%", "100%"]}
                marginTop={["20px", "0px", "20px", "0px"]}
                _hover={{ borderColor: "rgba(64, 186, 213,0.35)" }}
                h="50px"
                my={4}
                color="#319EF6"
                fontSize="lg"
                cursor="pointer"
                fontFamily="Cera Pro"
                lineHeight="24px"
                borderRadius="6px"
                bg="transparent"
                border=" 2px solid #319EF6"
                // onClick={() => props.addLiquidityPage("Create a new pair", true)}
              >
                Create a pair
              </Button>
            </Flex>

            <Flex justifyContent="center" mx={5} my={4}>
              <Text fontSize="sm" color="#666666">
                Dont see a pool you joined?
              </Text>
              <Text fontSize="sm" color="blue.300" ml={3} cursor="pointer">
                Import it
              </Text>
            </Flex>
          </Box>
          <Box
            backgroundColor="#FFFFFF"
            border="1px solid #DEE6ED"
            borderRadius="6px"
            my={4}
          >
            <Flex
              mx={5}
              justifyContent="space-between"
              alignItems="center"
              rounded="lg"
              my={4}
            >
              <Text color="#000000" fontSize="md">
                My Liquidity Positions
              </Text>
              <Tooltip
                label="This is a list of Liquidity of several token pairs as provided by you"
                fontSize="md"
                cursor="pointer"
                aria-label="A tooltip"
              >
                <QuestionIcon color="white" />
              </Tooltip>
            </Flex>
            {loading ? (
              <Flex
                color="#fff"
                h="100px"
                mb="10px"
                justifyContent="center"
                alignItems="center"
                px={4}
                mx={5}
                backgroundColor="#F2F5F8"
                border="1px solid #DEE6ED"
                borderRadius="6px"
              >
                <Text fontSize="sm" color="#666666">
                  Loading...
                </Text>
              </Flex>
            ) : allV2PairsWithLiquidity?.length <= 0 ||
              stakingPairs?.length <= 0 ? (
              <Flex
                color="#fff"
                h="100px"
                mb="10px"
                justifyContent="center"
                alignItems="center"
                px={4}
                mx={5}
                backgroundColor="#F2F5F8"
                border="1px solid #DEE6ED"
                borderRadius="6px"
              >
                <Text fontSize="sm" color="#666666">
                  No Liquidity Found.
                </Text>
              </Flex>
            ) : (
              <Box>
                {v2PairsWithoutStakedAmount.map((v2Pair) => (
                  <Liquidities
                    key={v2Pair.liquidityToken.address}
                    pair={v2Pair}
                  />
                ))}
                
                {stakingPairs.map(
                  (stakingPair, i) =>
                    stakingPair[1] && ( // skip pairs that arent loaded
                      <Liquidities
                        key={stakingInfosWithBalance[i].stakingRewardAddress}
                        pair={stakingPair[1]}
                        stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                      />
                    )
                )}
              </Box>
            )}
          </Box>
          {/* LIQUIDITY */}
        </Box>
      </Flex>
    </>
  );
};

export default Index;
