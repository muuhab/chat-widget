import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const conversations = await db.conversation.findMany({
      where:{
        OR:[
          {
            memberOneId:profile.id
          },
          {
            memberTwoId:profile.id
          }
        ]
      },
      include:{
        memberOne:true,
        memberTwo:true,
      }
    });
    const conv = conversations.map((c) => {
      if (c.memberOneId === profile.id) {
        return {
          id: c.id,
          memberOne: c.memberOne,
          memberTwo: c.memberTwo,
        };
      } else {
        return {
          id: c.id,
          memberOne: c.memberTwo,
          memberTwo: c.memberOne,
        };
      }
    });
    if (conv?.length===0) {
      return res.status(404).json({ message: "Conversation not found" });
    }


    return res.status(200).json(conv);
  } catch (error) {
    console.log("[CONVERSATIONS_GET]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
