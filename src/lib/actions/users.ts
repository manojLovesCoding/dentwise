"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export async function syncUser() {
  try {
    const user = await currentUser();
    if (!user) return;

    const email = user.emailAddresses[0]?.emailAddress;

    const dbUser = await prisma.user.upsert({
      where: { email }, // match existing user by email
      update: {
        clerkId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phoneNumbers[0]?.phoneNumber,
      },
      create: {
        clerkId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email,
        phone: user.phoneNumbers[0]?.phoneNumber,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser server action", error);
  }
}
