export const handle = async ({ event, resolve }) => {
    try {
        return await resolve(event);
    } catch (err) {
        console.error(" GLOBAL SERVER ERROR:", err);
        throw err;
    }
};
