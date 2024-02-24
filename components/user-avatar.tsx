import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

import { FC } from 'react'

interface UserAvatarProps {
    src?: string
    className?: string
}

const UserAvatar: FC<UserAvatarProps> = ({ className, src }) => {
    return <div className="relative">
        <Avatar className={cn(
            'h-7 w-7 md:h-10 md:w-10',
            className
        )}>
            <AvatarImage src={src} />
        </Avatar>
        {/* <span
            className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-1 w-1 md:h-1 md:w-1"
        /> */}
    </div>
}

export default UserAvatar