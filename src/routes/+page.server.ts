import { createUser, loginUser } from "$lib/services/DBService";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  register: async ({ request }) => {
    const data = await request.formData();
    const username = data.get("username")!.toString();
    const password = data.get("password")!.toString();

    let uuid: string;
    try {
      uuid = await createUser(username, password);
      console.info(" REGISTER SUCCESS:", uuid);
    } catch (err: any) {
      console.error(" REGISTER ERROR:", err);
      return { error: err?.message || "Registration failed" };
    }
    
    throw redirect(303, `/board/${username}`);
  },
  
  login: async ({ request }) => {
    const data = await request.formData();
    const username = data.get("username")!.toString();
    const password = data.get("password")!.toString();
    
    let uuid: string;
    try {
      uuid = await loginUser(username, password);
      console.info("LOGIN SUCCESS:", uuid);  
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      return { error: err?.message || "Login failed" };
    }
    
    throw redirect(303, `/board/${username}`);
  }
};
