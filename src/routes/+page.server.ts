import { createUser, loginUser } from "$lib/services/DBService";
import type { Actions } from "@sveltejs/kit";

export const actions = {
  register: async ({ request }) => {
    const data = await request.formData();
    const username = data.get("username")?.toString();
    const password = data.get("password")?.toString();

    if (username != undefined && password != undefined) {
      const UUID = createUser(username, password);
    }
  },
  login: async ({ request }) => {
    const data = await request.formData();
    const username = data.get("username")?.toString();
    const password = data.get("password")?.toString();
    
    if (username != undefined && password != undefined) {
      const UUID = loginUser(username, password);
    }
  },
} satisfies Actions;
