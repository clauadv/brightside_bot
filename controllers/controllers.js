import { handle_ban } from "./ban.js";
import { handle_verify } from "./verify.js";

export const controllers = {
    handle: (message) => {
        handle_ban(message);
        handle_verify(message);
    }
}