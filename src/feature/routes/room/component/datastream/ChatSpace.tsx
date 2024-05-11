import { Avatar, Box, Text } from '@chakra-ui/react';

export const ChatSpace = ({ outputTextChat, me }) => {
  return (
    <>
      {outputTextChat.length > 0 ? (
        outputTextChat.map((text, i) => (
          text.memberId === me?.id ? (
           <Box key={i}>
                <Avatar src={me?.metadata?.image ?? '/asset/userassets/icon001.jpg'} />
                <Text size="sm" color="blue.500">
                自分　：　{text.message}
                </Text>
            </Box>
          ) : (
            <Text size="sm" key={i} color="gray.700">
              {text.memberName??"名無し"}さん　：　{text.message}
            </Text>
          )
        ))
      ) : (
        <Text size="sm" color="gray.500">
          メッセージがありません
        </Text>
      )}
    </>
  );
};

