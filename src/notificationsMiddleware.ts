import { AnyAction, Dispatch } from "redux";

import { PUSH_NOTIFICATION } from "../src/constants/incomingMessageTypes";
import { frontEndUrl } from "./url";

type Options = {
  title: string;
  subtitle?: string;
  message?: string;
  duration?: number;
  icon?: string;
  vibrate?: number | number[];
  silent?: boolean;
  onClick?: onClickType;
  requireInteraction?: boolean;
};
type voidFunc = () => void;
type eventFunc = (e: any) => void;
type onClickType = voidFunc | eventFunc | undefined;

const defaultDuration = 3000;

const addNotification = async (options: Options): Promise<void> => {
  const {
    title,
    subtitle,
    message,
    duration,
    icon,
    vibrate,
    silent,
    onClick,
    requireInteraction,
  } = options;
  if (
    Notification.permission === "default" ||
    Notification.permission === "denied"
  ) {
    await Notification.requestPermission();
  }
  if (Notification.permission === "granted") {
    const not: Notification = new Notification(title, {
      body: message,
      data: subtitle,
      icon,
      vibrate,
      silent,
      requireInteraction,
    });
    not.onclick = onClick || null;
    setTimeout(not.close.bind(not), duration || defaultDuration);
  }
};

const notificationsMiddleware = (store: any) => (next: Dispatch) => (
  action: AnyAction
) => {
  if (
    store.getState().notificationsSupported &&
    action.type === PUSH_NOTIFICATION
  ) {
    addNotification({
      title: action.payload.title,
      message: action.payload.message,
      duration: 50000,
      onClick: () => {
        window.open(`${frontEndUrl}/game/${action.payload.gameId}`);
      },
      requireInteraction: true,
    });
  } else {
    next(action);
  }
};

export default notificationsMiddleware;
