import { History } from "history";
import superagent from "superagent";
import React, { useEffect} from "react";
import { backendUrl as baseUrl } from "../runtime";
import TranslationContainer from "./Translation/TranslationContainer";


interface OwnProps {
    history: History;
}

export default function ConfirmEmail(props: OwnProps) {
    const jwtFromUrl = new URL(window.location.href).searchParams.get("jwt");

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                await superagent
                    .get(`${baseUrl}/confirm-email`)
                    .set("Authorization", `Bearer ${jwtFromUrl}`)
                    props.history.push("/");
            } catch (error: any) {
                console.log("error test:", error);
                // TODO: send error and handle it on frontend
            }
        }
        confirmEmail();
    },[jwtFromUrl, props.history])
    return (<TranslationContainer translationKey="loading" />)
}