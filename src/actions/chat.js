import { CLEAR_MESSAGES } from "../constants/internalMessageTypes";

export const clearMessages = () => {
  return {
    type: CLEAR_MESSAGES,
  };
};
