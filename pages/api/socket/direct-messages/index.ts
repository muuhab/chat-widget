import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;
    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is missing" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOneId:profile.id,
          },
          {
            memberTwoId:profile.id,
          },
        ],
      },
      include: {
        memberOne: true,
        memberTwo:true,
      },
    });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member =
      conversation.memberOne.id === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        memberId: member.id,
        conversationID: conversationId as string,
      },
      include: {
        member:true,
      },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
