import { ChatMessage } from '@/types/types';
import { Box, Text } from '@chakra-ui/react'
import { LocalP2PRoomMember } from '@skyway-sdk/room';

type Props = {
  chatTexts: ChatMessage[];
  me: LocalP2PRoomMember;
};

export const ChatSpace = (props: Props) => {
  const { chatTexts, me } = props;
  
  if(!chatTexts || chatTexts.length === 0) {
    return (<Text size="sm" color="gray.500">メッセージがありません</Text>);
  }
  return (
    <>
      {chatTexts.length > 0 &&
        (chatTexts.map((text, i) =>
          text.memberId === me?.id ? (
            <Box key={i}>
              <Text size="sm" color="blue.500">
                [自分]：{text.message}
              </Text>
            </Box>
          ) : (
            <Text size="sm" key={i} color="gray.700">
              [{text.memberName ?? '名無し'}さん] ：{text.message}
            </Text>
          ),
        )
      )}
    </>
  )
}
