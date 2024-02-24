"use client"

import { useModal } from "@/hooks/use-modal-store";
import { MessageCircle } from "lucide-react";
import { FC } from "react";

interface ChatPopupProps {

}

const ChatPopup: FC<ChatPopupProps> = () => {

    const { onOpen } = useModal()

    return <div className="fixed z-10 bottom-4 right-4 cursor-pointer">
        <MessageCircle className="w-[45px] h-[45px]" onClick={() => onOpen("chatWidget",
        )} />
    </div>;
}

export default ChatPopup;