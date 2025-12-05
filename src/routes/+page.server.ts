import { createUser, loginUser } from "$lib/services/DBService";
import type { Actions } from "@sveltejs/kit";


console.log(" +page.server.ts loaded");


export const actions: Actions = {
  register: async ({ request }) => {
    console.log(" register() called");
    try {
      const data = await request.formData();
      const username = data.get("username")?.toString();
      const password = data.get("password")?.toString();

      console.log("username:", username);
      console.log("password:", password);

      const uuid = await createUser(username!, password!);
      console.log(" REGISTER SUCCESS:", uuid);
      return { success: true, uuid };

    } catch (err: any) {
      console.error(" REGISTER ERROR:", err);
      return { error: err?.message || "Registration failed" };
    }
  },

  login: async ({ request }) => {
    console.log(" login() called");
    try {
      const data = await request.formData();
      const username = data.get("username")?.toString();
      const password = data.get("password")?.toString();

      console.log("username:", username);
      console.log("password:", password);

      const uuid = await loginUser(username!, password!);
      console.log("LOGIN SUCCESS:", uuid);
      return { success: true, uuid };

    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      return { error: err?.message || "Login failed" };
    }
  }
};
