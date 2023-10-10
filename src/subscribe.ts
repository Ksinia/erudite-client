import { storeSubscription } from './actions/api-call';
import store from './store';

function urlBase64ToUint8Array(base64String: String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function syncSubscription(
  registration: ServiceWorkerRegistration
) {
  let subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    // Technically we subscribed, but we could also verify correctness with the server
  } else if (process.env.REACT_APP_VAPI_PK) {
    const convertedVapidKey = urlBase64ToUint8Array(
      process.env.REACT_APP_VAPI_PK
    );
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
  }
  if (subscription) {
    await store.dispatch(storeSubscription(subscription));
  }
}
