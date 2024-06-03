import { Table, Tbody, Th, Thead, Tr, Td, TableContainer, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { TermCombination } from '../../api/createPlot';


export const TopicsCombination = ({
    term_combination
}: {
    term_combination: TermCombination
}) => {
    return (
        <Box>
            <Heading
                color={'teal.600'}
                fontWeight={'bold'}
                fontSize={'md'}
            >
                共起回数：
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
                                単語１
                            </Th>
                            <Th
                                color={'white'}
                                textAlign={'center'}
                                fontSize={'md'}
                            >
                                単語２
                            </Th>
                            <Th
                                color={'white'}
                                textAlign={'center'}
                                fontSize={'md'}
                            >
                                共起回数
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {Object.keys(term_combination.col_1).length > 0 ? (
                            Object.keys(term_combination.col_1).map((key, index) => (
                                <Tr key={index} bg={index % 2 === 0 ? 'white' : 'gray.100'}>
                                    <Th textAlign={'center'} fontSize={'nd'} color={'teal.500'}>{index + 1}</Th>
                                    <Td textAlign={'center'} color={'gray.600'}>{term_combination.col_1[key]}</Td>
                                    <Td textAlign={'center'} color={'gray.600'}>{term_combination.col_2[key]}</Td>
                                    <Td textAlign={'center'} color={'gray.600'}>{term_combination.count[key]}回</Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td
                                    colSpan={4}
                                    textAlign={'center'}
                                    color={'gray.600'}
                                >
                                    データがありません。他のグラフをクリックしてください。
                                </Td>
                            </Tr>

                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

