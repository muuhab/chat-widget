"use client"

import { useChatQuery } from '@/hooks/use-chat-query';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { DirectMessage, Profile } from '@prisma/client';
import { format } from 'date-fns';
import { Loader2, ServerCrash } from 'lucide-react';
import { ElementRef, FC, Fragment, useRef } from 'react';
import ChatItem from './chat-item';
import ChatWelcome from './chat-welcome';

const DATE_FORMAT = 'd MMM yyyy, HH:mm'
interface ChatMessagesProps {
    name: string;
    member: Profile;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>
    paramKey:  'conversationId';
    paramValue: string
}
type MessageWithMemberWithProfile = DirectMessage & {
    member: Profile
}
const ChatMessages: FC<ChatMessagesProps> = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
}) => {

    const queryKey = `chat:${chatId}`
    const updateKey = `chat:${chatId}:messages:update`
    const addKey = `chat:${chatId}:messages`

    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
    })
    useChatSocket({
        queryKey,
        updateKey,
        addKey
    })
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0,
    })

    if (status === 'loading')
        return (
            <div className="flex flex-col flex-1 justify-AlignCenter items-center">
                <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>)

    if (status === 'error')
        return (
            <div className="flex flex-col flex-1 justify-AlignCenter items-center">
                <ServerCrash className='h-7 w-7 text-zinc-500  my-4' />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>)

    return <div ref={chatRef} className='flex-1 flex flex-col py-4 overflow-y-auto'>
        {!hasNextPage &&
            <div className='flex-1' />}
        {!hasNextPage &&
            <ChatWelcome
                name={name}
            />
        }
        {hasNextPage && (
            <div className="flex justify-center">
                {isFetchingNextPage ? (
                    <Loader2 className='h-6 w-6 text-zinc-500 animate=spin my-4' />
                ) :
                    (
                        <button
                            onClick={() => fetchNextPage()}
                            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition'>
                            Load previous messages
                        </button>
                    )
                }
            </div>
        )}
        <div className="flex flex-col-reverse mt-auto">
            {data?.pages?.map((group, i) => (
                <Fragment key={i}>
                    {group?.items.map((message: MessageWithMemberWithProfile) => (
                        <ChatItem
                            key={message.id}
                            id={message.id}
                            currentMember={member}
                            member={message.member}
                            content={message.content}
                            deleted={message.deleted}
                            fileUrl={message.fileUrl}
                            timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                            isUpdated={message.updatedAt !== message.createdAt}
                            socketQuery={socketQuery}
                            socketUrl={socketUrl}
                        />
                    ))}
                </Fragment>
            ))}
        </div>
        <div ref={bottomRef} />
    </div>
}

export default ChatMessages