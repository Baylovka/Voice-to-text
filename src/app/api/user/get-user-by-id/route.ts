import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId } = body

        if (!userId) {
            return Response.json({ error: 'UserId is required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
        }

        return new Response(JSON.stringify({ user: user }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error getting user:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        return new Response(JSON.stringify({ error: 'Failed to get user' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
