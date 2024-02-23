import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        serverId: string;
        memberId: string;
    },
    searchParams: {
        video?: boolean;
    }
}

const MemberIdPage = async ({
    params,
    searchParams
}: MemberIdPageProps) => {

    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();
    const currentMember = await db.profile.findUnique({
        where: {
            id: profile.id
        },
    })
    if (!currentMember) return redirect("/")

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId)
    if (!conversation) return redirect('/');
    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;

    return <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
            imageUrl={otherMember.imageUrl}
            name={otherMember.name}
            serverId={params.serverId}
            type="conversation"
        />
            <>
                <ChatMessages
                    member={currentMember}
                    name={otherMember.name}
                    chatId={conversation.id}
                    apiUrl="/api/direct-messages"
                    paramKey="conversationId"
                    paramValue={conversation.id}
                    socketUrl="/api/socket/direct-messages"
                    socketQuery={{
                        conversationId: conversation.id
                    }}
                />
                <ChatInput
                    name={otherMember.name}
                    apiUrl="/api/socket/direct-messages"
                    query={{
                        conversationId: conversation.id
                    }}
                />
            </>

    </div>;
};
export default MemberIdPage;
