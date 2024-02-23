import { FC } from 'react';

interface ChatWelcomeProps {
    name: string;
}

const ChatWelcome: FC<ChatWelcomeProps> = ({
    name
}) => {
    return <div className='space-y-2 px-4 mb-4'>
        <p className="text-xl md:text-3xl font-bold">
            {""}{name}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            {`This is the start of your conversation with ${name}`}
        </p>
    </div>
}

export default ChatWelcome