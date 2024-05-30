import { NextRequest, NextResponse } from "next/server";
import { SkyWayAuthToken, nowInSec, uuidV4 } from "@skyway-sdk/token";

const appId = process.env.NEXT_PUBLIC_SKYWAY_APP_ID as string;
const secretKey = process.env.NEXT_PUBLIC_SKYWAY_SECRET_KEY as string;

export async function setSkywayToken() {
    const token = new SkyWayAuthToken({
        jti: uuidV4(),
        iat: nowInSec(),
        exp: nowInSec() + 60 * 60 * 24,
        scope: {
            app: {
                id: appId,
                turn: true,
                actions: ["read"],
                channels: [
                    {
                        id: "*",
                        name: "*",
                        actions: ["write"],
                        members: [
                            {
                                id: "*",
                                name: "*",
                                actions: ["write"],
                                publication: {
                                    actions: ["write"],
                                },
                                subscription: {
                                    actions: ["write"],
                                },
                            },
                        ],
                        sfuBots: [
                            {
                                actions: ["write"],
                                forwardings: [
                                    {
                                        actions: ["write"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    }).encode(secretKey);

    return token;
}

interface Response {
    token: string | null;
}

// eslint-disable-next-line no-unused-vars
const GET = async (request: NextRequest) => {
    const response: Response = {
        token: null,
    };
    let status = 200;
    try {
        const token = await setSkywayToken();
        response.token = token;
    } catch (error) {
        response.token = null;
        status = 500;
    }
    return NextResponse.json(
        response,
        {
            status: status,
        },
    );
};

export { GET };