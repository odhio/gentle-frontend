'use client'
import { RoomDetailModal } from "@/features/lounge/component/room-detail-modal";
import { Room } from "@/types/types";
import { RepeatClockIcon } from "@chakra-ui/icons";
import { Button, Card, CardBody, CardFooter, CardHeader, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import Link from 'next/link';
import { useState } from "react";

export const RoomCard = ({ room }:{room:Room}) => {
    const[roomUuid, setRoomUuid] = useState<string>("");

    return (
        <>
            <Card
                border={room?.closedAt ? '' : '1px solid #E2E8F0'}
                bg={room?.closedAt ? 'gray.100' : 'white'}
                p={4}
                borderRadius="md"
                transition="background 0.3s, opacity 0.3s"
                key={room.uuid} >
                <CardHeader>
                    <Heading size='md' mb={3} display={'inline-block'}>
                        {room.name ? room.name : "No Name"}
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                        {room.closedAt}
                    </Text>
                </CardHeader>
                <CardBody>
                </CardBody>
                <CardFooter>
                    {room.closedAt ? (
                        <>
                        <HStack
                            maxW={'100%'}
                            spacing={4}
                            ml={'auto'}
                        >
                        <Button
                            h={10}
                            rounded="3xl"
                            colorScheme="teal"
                            px={8}
                            onClick={()=>setRoomUuid(room.uuid)}
                            >
                            会議内容
                            <RepeatClockIcon ml={3}/>
                            </Button>
                        </HStack>
                        </>
                    ) : (
                        <VStack
                            spacing={4}
                            ml={'auto'}
                        >
                            <Text
                                fontSize="sm"
                                color="gray.500"
                            >今日の会議を始めましょう
                            </Text>
                            <Link
                                style={{marginLeft: 'auto', width: '60%'}}
                                href={`/room/${room?.uuid}`}
                                passHref
                                >
                                <Button
                                    h={10}
                                    w={'100%'}
                                    rounded="3xl"
                                    colorScheme="red"
                                >
                                    参加
                                </Button>
                            </Link>
                        </VStack>
                    )}
                </CardFooter>
            </Card>
            <RoomDetailModal
                isOpen={roomUuid !== ""}
                onClose={()=>setRoomUuid("")}
                roomUuid={roomUuid}
            />
        </>
    )
};