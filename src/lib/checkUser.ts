import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/src/lib/db";

export const checkUser = async () => {
  const user = await currentUser();
  console.log(user);

  //Check for current logged-in clerk user
  if (!user) {
    return null;
  }

  //Check if the user is already in the db
  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  //If the user is already in the db, return the loggedInUser
  if (loggedInUser) {
    return loggedInUser;
  }

  //If not in the db, create the new user and return it
  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
};
