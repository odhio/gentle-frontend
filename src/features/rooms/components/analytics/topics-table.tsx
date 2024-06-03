import { Table, Tbody, Text, Th, Thead, Tr, Td, TableContainer } from '@chakra-ui/react';
import React from 'react';


export const TopicTable = ({
    topics,
    segment
}: {
    topics: { [key: string]: number},
    segment: string
}) => {
    const column_1 = Object.entries(topics).slice(0, 5).map(entry => ({ key: entry[0], value: entry[1] }));
    const column_2 = Object.entries(topics).slice(5, 10).map(entry => ({ key: entry[0], value: entry[1] }));
    console.log(segment);

    // 最長の列に基づいて行を作成
    const rows = [];
    for (let i = 0; i < Math.max(column_1.length, column_2.length); i++) {
        const firstItem = column_1[i] || { key: '-', value: '-' };
        const secondItem = column_2[i] || { key: '-', value: '-' };
        rows.push(
            <Tr key={i} bg={i % 2 == 0 ? 'white' : 'gray.100'}>
                <Th textAlign={'center'}>{firstItem.key}</Th>
                <Td color={'gray.600'} borderRight={'1px'} borderStyle={'dotted'} borderRightColor={'teal.400'}>{firstItem.value}回</Td>
                <Th textAlign={'center'}>{secondItem.key}</Th>
                <Td color={'gray.600'}>{secondItem.value}回</Td>
            </Tr>
        );
    }

    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead
                    bg={'teal.500'}
                    boxSizing={'border-box'}
                >
                    <Tr>
                        <Th
                            color={'white'}
                            colSpan={4}
                            textAlign={'center'}
                            fontSize={'md'}
                        >頻出ワード
                            <Text fontSize={'sm'}>{segment}</Text>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {rows.length > 0 ? (
                        rows
                    ):(
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
    );
};
