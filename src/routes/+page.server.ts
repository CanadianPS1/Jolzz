import { createUser, loginUser } from "$lib/services/DBService";
import type { Actions } from "@sveltejs/kit";

export const actions = {
  register: async ({ request }) => {
    const data = await request.formData();
    const username = data.get("username")?.toString();
    const password = data.get("password")?.toString();

    if (username && password) {
      try {
        const UUID = await createUser(username, password);
        return { success: true, uuid: UUID };
      } catch (err) {
        return { error: err };
      }
    }
  },

  login: async ({ request }) => {
    const data = await request.formData();
    const username = data.get("username")?.toString();
    const password = data.get("password")?.toString();

    if (username && password) {
      try {
        const UUID = await loginUser(username, password);
        return { success: true, uuid: UUID };
      } catch (err) {
        return { error: err };
      }
    }
  }
} satisfies Actions;

