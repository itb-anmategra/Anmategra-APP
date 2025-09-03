import {getServerAuthSession} from "~/server/auth";
import AuthErrorComp from "~/app/auth-error/error-content";

export default async function AuthError() {
    const session = await getServerAuthSession()
    return (
        <AuthErrorComp session={session}/>
    )
}

