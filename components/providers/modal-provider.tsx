"use client"

import DeleteMessageModal from "@/components/modals/delete-message-modal"
import MessageFileModal from "@/components/modals/message-file-modal"
import { useEffect, useState } from "react"
import ChatWidget from "../modals/chat-widget"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, []);

    if (!isMounted) return null
    return (
        <>
            <MessageFileModal />
            <DeleteMessageModal />
            <ChatWidget />
        </>
    )
}