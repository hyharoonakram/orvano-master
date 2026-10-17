"use server";

import { revalidatePath } from "next/cache";

export async function revalidateHomepage() {
  try {
    revalidatePath("/", "page");
    revalidatePath("/shop", "page");
    revalidatePath("/watches", "page");
    revalidatePath("/pants", "page");
    return { success: true };
  } catch (error: any) {
    console.error("Revalidation error:", error);
    return { success: false, error: error.message };
  }
}
