"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Conversation, Profile } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserAvatar from "../user-avatar";
import { ScrollArea } from "../ui/scroll-area";



const ChatWidget = () => {

    const { isOpen, onClose, type, data } = useModal()

    const isModalOpen = isOpen && type === "chatWidget"

    const router = useRouter();

    const { data: conv, isFetched } = useQuery({
        queryKey: ['fetchConvaa'],
        queryFn: async () => {

            const data = await axios.get('/api/socket/conversations')
            return data

        }
    })

    const goToConversation = (id: string) => {
        router.push(`/conversations/${id}`)
        onClose()
    }

    return <Dialog open={isModalOpen} onOpenChange={onClose} modal={false}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden  top-[74%] left-[79.5%]   " onInteractOutside={(e) => {
            e.preventDefault();
        }}>
            <DialogHeader className="pt-4 px-6">
                <DialogTitle className="text-2xl text-center font-bold h-[40px]">
                    Conversations
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500 h-full ">
                    <ScrollArea className=" h-[200px] pr-8">
                        <div className="flex flex-col gap-4">


                        {isFetched && conv?.data?.map((con: Conversation & { memberOne: Profile, memberTwo: Profile }) => (
                            <div key={con.id} className="flex items-center gap-4 cursor-pointer border border-zinc-200 p-2 rounded-lg" onClick={() => goToConversation(con.memberTwo.id)}>
                                <UserAvatar
                                    src={con.memberTwo?.imageUrl}
                                    className="w-10 h-10"
                                />
                                <div>
                                    <p>
                                        {con.memberTwo.name}
                                    </p>
                                </div>

                            </div>
                        ))}
                       
                        </div>

                    </ScrollArea>
                    
                </DialogDescription>
            </DialogHeader>

        </DialogContent>
    </Dialog>;
}

export default ChatWidget;