'use client'
import { useForm } from 'react-hook-form';
import React from 'react';
import { Box, Button, Flex, Text, FormControl, FormErrorMessage, FormLabel, Input, Textarea, useToast } from '@chakra-ui/react';
import { insertCalendar } from './api/insert-calendar';
import { CalendarEvent } from '@/types/types';
import Link from 'next/link';
import { CheckCircleIcon } from '@chakra-ui/icons';

interface Event {
    googleSchedule: CalendarEvent;
    toggle: () => void;
}

export const GoogleCalendarForm = (props: Event) => {
    const { googleSchedule } = props;
    const defaultValues = {
        start: googleSchedule.start.dateTime,
        end: googleSchedule.end.dateTime,
        summary: googleSchedule.summary,
        location: googleSchedule.location,
        description: googleSchedule.description,
    };

    const {
        register,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        defaultValues
    });

    const toast = useToast();

    const onClose = () => {
        props.toggle();
    };


    return (
        <form
            action={async (data) => {
                const res = await insertCalendar(data)
                if (res === null) {
                    toast({
                        title: 'エラーが発生しました。',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    });
                    return
                } else {
                    toast({
                        title: ``,
                        render: () => {
                            return (
                                <>
                                    {res && (
                                        <Flex alignItems={'center'} px={5} mx={6} color="white" p={3} bg={'#319795bd'} borderRadius={10} borderTop={1} gap={4}>
                                            <Box><CheckCircleIcon w={'25px'} h={'25px'} /></Box>
                                            <Box>
                                                <Text mx={2} mb={1}>予定登録が完了しました。確認しにいきましょう</Text>
                                                <Text color="white" >
                                                    <Link href={res}>{res}</Link>
                                                </Text>
                                            </Box>
                                        </Flex>
                                    )}
                                </>
                            )
                        },
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    });
                    onClose()
                }
            }}>
            <FormControl isInvalid={!!errors.summary}>
                <Box>
                    <FormLabel htmlFor='タイトル'>タイトル</FormLabel>
                    <Input
                        placeholder='タイトル'
                        type='text'
                        size='md'
                        {...register('summary', {
                            required: 'タイトルは必須です。',
                        })}
                    />
                </Box>
                {typeof errors.message?.message === 'string' && (
                    <FormErrorMessage>{errors.message.message}</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={!!errors.location}>
                <Box>
                    <FormLabel htmlFor='場所'>場所</FormLabel>
                    <Input
                        placeholder='場所'
                        type='text'
                        size='md'
                        {...register('location', {
                        })}
                    />
                    {typeof errors.location?.message === 'string' && (
                        <FormErrorMessage>{errors.location.message}</FormErrorMessage>
                    )}
                </Box>
            </FormControl>
            <FormControl isInvalid={!!errors.description}>
                <Box>
                    <FormLabel htmlFor='詳細'>詳細</FormLabel>
                    <Textarea
                        placeholder='詳細'
                        size='md'
                        {...register('description', {
                        })}
                    />
                    {typeof errors.description?.message === 'string' && (
                        <FormErrorMessage>{errors.description.message}</FormErrorMessage>
                    )}
                </Box>
            </FormControl>
            <FormControl isInvalid={!!errors.Start}>
                <Box>
                    <FormLabel htmlFor='開始日時'>開始</FormLabel>
                    <Input
                        placeholder='Start'
                        size='md'
                        type='datetime-local'
                        {...register('start.dateTime', {
                            required: '開始日時を入力してください',
                            validate: (value) => new Date(value) > new Date() || '開始日時が過去に設定されています。',
                        })}
                    />
                    {typeof errors.Start?.message === 'string' && (
                        <FormErrorMessage>{errors.Start.message}</FormErrorMessage>
                    )}
                </Box>
            </FormControl>
            <FormControl isInvalid={!!errors.end}>
                <Box>
                    <FormLabel htmlFor='終了日時'>終了</FormLabel>
                    <Input
                        placeholder='End'
                        size='md'
                        type='datetime-local'
                        {...register('end.dateTime', {
                            required: '終了日時は必須です。',
                            validate: (value) => new Date(value) > new Date(googleSchedule.start.dateTime) || '終了日時が開始日時より早く設定されています。',
                        })}
                    />
                    {typeof errors.end?.message === 'string' && (
                        <FormErrorMessage>{errors.end.message}</FormErrorMessage>
                    )}
                </Box>
            </FormControl>
            <Button
                onClick={onClose}
                mt={4}
                colorScheme='gray'>
                キャンセル
            </Button>
            <Button
                mt={4}
                colorScheme='teal'
                isLoading={isSubmitting}
                type='submit'>
                登録
            </Button>
        </form>
    );
};
