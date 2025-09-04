import {getServerAuthSession} from "~/server/auth";
import AuthErrorContent from "~/app/auth-error/error-content";

export default async function AuthError() {
    const session = await getServerAuthSession()
    return (
        <AuthErrorContent session={session}/>
    )
}

