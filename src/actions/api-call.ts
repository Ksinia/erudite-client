import superagent from "superagent";
import { url as baseUrl } from "../url";

function getJWT(): string | null {
    return localStorage.getItem("jwt")
}

async function callApi(method: keyof Pick<typeof superagent, 'get' | 'post'>, path: string, body?: object) {
    const jwt = getJWT()
    if (jwt) {
        const response = await superagent[method](`${baseUrl}/${path}`)
            .send(body)
            .set("Authorization", `Bearer ${jwt}`)

        return JSON.parse(response.text);
    } else {
        throw new Error("unauthorzied")
    }
}

export async function saveSubscription(subscription: PushSubscription) {
    return callApi('post', 'subscribe', subscription) // TODO: Check return code
}