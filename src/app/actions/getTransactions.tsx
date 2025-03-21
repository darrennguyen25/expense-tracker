"use server";
import { db } from "@/src/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Transaction } from "@/src/types/Transaction";

async function getTransactions(): Promise<{
  transactions?: Transaction[];
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  try {
    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { transactions };
  } catch (error) {
    return { error: "Database error" };
  }
}

export default getTransactions;
