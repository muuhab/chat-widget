import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) return redirectToSignIn();

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) return profile;
  
const randFirstName = Math.random().toString(36).substring(7);
const randLastName = Math.random().toString(36).substring(7);

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName || randFirstName} ${user.lastName || randLastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
