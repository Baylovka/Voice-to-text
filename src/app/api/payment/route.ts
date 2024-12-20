import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return new Response(JSON.stringify({ error: 'UserId is required', success: false }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found', success: false }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await prisma.user.update({
            where: {
                clerkUserId: userId,
            },
            data: {
                freeTries: user.freeTries + 5,
            },
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating user:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        return new Response(JSON.stringify({ error: 'Failed to update user' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
