import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Received data from client:", body);

        const { userId, title, language, processingTime, wordCount, transcript } = body;

        if (!userId || !transcript) {
            return new Response(JSON.stringify({ error: 'UserId and transcript are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (user.freeTries <= 0) {
            return new Response(JSON.stringify({ error: 'No tries left' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const newHistory = await prisma.history.create({
            data: {
                title: title,
                language: language,
                processingTime: processingTime,
                wordCount: wordCount,
                transcript,
                user: { connect: { clerkUserId: userId } },
            },
        });

        await prisma.user.update({
            where: { clerkUserId: userId },
            data: {
                freeTries: {
                    decrement: 1,
                },
            },
        });

        return new Response(JSON.stringify({ history: newHistory }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error saving transcript:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        return new Response(JSON.stringify({ error: 'Failed to save transcript' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
