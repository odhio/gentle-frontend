import { Table, Tbody, Th, Thead, Tr, Td, TableContainer, Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';


export const TopicsSummary = ({
    countup,
    tfidf
}: {
    countup: { [key: string]: number},
    tfidf: { [key: string]: number }
}) => {
    return (
        <Flex w={'100%'} gap={'2.5%'} margin={'auto'} justifyContent={'center'}>
            <Box w={'50%'}>
            <Heading
                color={'teal.600'}
                fontWeight={'bold'}
                fontSize={'md'}
            >
                    頻出ワード：
            </Heading>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead
                            bg={'teal.500'}
                            boxSizing={'border-box'}
                        >
                            <Tr>
                            <Th
                                    color={'white'}
                                    textAlign={'center'}
                                    fontSize={'md'}
                                >
                                    順位
                                </Th>
                                <Th
                                    color={'white'}
                                    textAlign={'center'}
                                    fontSize={'md'}
                                >
                                    頻出ワード
                                </Th>
                                <Th
                                    color={'white'}
                                    textAlign={'center'}
                                    fontSize={'md'}
                                >
                                    出現回数
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {Object.entries(countup).map(([key, value], index) => (
                                <Tr key={index} bg={index % 2 == 0 ? 'white' : 'gray.100'}>
                                    <Th textAlign={'center'} fontSize={'nd'} color={'teal.500'} >{index + 1}</Th>
                                    <Td textAlign={'center'} color={'gray.600'}>{key}</Td>
                                    <Td textAlign={'center'} color={'gray.600'}>{value}回</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <Box w={'50%'}>
            <Heading
                color={'teal.600'}
                fontWeight={'bold'}
                fontSize={'md'}
            >
                    重要性指標（TF-IDF）：
            </Heading>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead
                            bg={'teal.500'}
                            boxSizing={'border-box'}
                        >
                            <Tr>
                                <Th
                                    color={'white'}
                                    textAlign={'center'}
                                    fontSize={'md'}
                                >
                                    順位
                                </Th>
                                <Th
                                    color={'white'}
                                    textAlign={'center'}
                                    fontSize={'md'}
                                >
                                    頻出ワード
                                </Th>
                                <Th
                                    color={'white'}
                                    textAlign={'center'}
                                    fontSize={'md'}
                                >
                                    出現回数
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {Object.entries(tfidf).map(([key, value], index) => (
                                <Tr key={index} bg={index % 2 == 0 ? 'white' : 'gray.100'}>
                                    <Th textAlign={'center'} fontSize={'nd'} color={'teal.500'}>{index + 1}</Th>
                                    <Td textAlign={'center'} color={'gray.600'}>{key}</Td>
                                    <Td textAlign={'center'} color={'gray.600'}>{Math.floor(value*1000)/1000}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Flex>
    )
}