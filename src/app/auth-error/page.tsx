import {getServerAuthSession} from "~/server/auth";
import AuthErrorComp from "~/app/auth-error/authComp";

export default async function AuthError() {
    const session = await getServerAuthSession()
    return (
        <AuthErrorComp session={session}/>
    )
}

