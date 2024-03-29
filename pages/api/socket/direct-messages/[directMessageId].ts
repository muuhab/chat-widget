import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;
    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is missing" });
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
        memberTwo: true,
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

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationID: conversationId as string,
      },
      include: {
        member: true,
      },
    });
    if (!message || message.deleted) {
      return res.status(404).json({ message: "Message not found" });
    }
    const isMessageOwner = message.member.id === profile.id;
    const canModify = isMessageOwner;
    if (!canModify) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          deleted: true,
          content: "This message has been deleted",
        },
        include: {
          member: true,
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner)
        return res.status(401).json({ message: "Unauthorized" });
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: true,
        },
      });
    }
    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
