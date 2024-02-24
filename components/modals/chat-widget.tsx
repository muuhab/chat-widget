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



const ChatWidget = () => {

    const { isOpen, onClose, type, data } = useModal()

    const isModalOpen = isOpen && type === "chatWidget"

    const router = useRouter();

    const {data:conv,isFetched} = useQuery({
        queryKey: ['fetchConvaa'],
        queryFn: async () => {
              
                const data  = await axios.get('/api/socket/conversations')
                return data
          
        }
    })

    const goToConversation = (id:string) => {
        router.push(`/conversations/${id}`)
        onClose()
    }

    return <Dialog open={isModalOpen} onOpenChange={onClose} modal={false}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden  top-[76%] left-[80%]  " onInteractOutside={(e) => {
            e.preventDefault();
        }}>
            <DialogHeader className="pt-4 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Conversations
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500 flex flex-col gap-2">
                   {isFetched && conv?.data?.map((con:Conversation&{memberOne:Profile,memberTwo:Profile})=>(
                    <div key={con.id} className="flex items-center gap-4 cursor-pointer" onClick={()=>goToConversation(con.memberTwo.id)}>
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
                </DialogDescription>
            </DialogHeader>
            
        </DialogContent>
    </Dialog>;
}

export default ChatWidget;