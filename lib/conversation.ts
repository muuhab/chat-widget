import { db } from "@/lib/db";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));
  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }
  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: true,
        memberTwo: true,
      },
    });
  } catch (error) {
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    console.log("Creating new conversation",memberOneId,memberTwoId);
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: true,
        memberTwo: true,
      },
    });
  } catch (error) {
    console.log(error)
    return null;
  }
};
