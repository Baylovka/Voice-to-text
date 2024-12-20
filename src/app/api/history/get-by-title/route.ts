import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { userId, title } = await req.json();
    console.log(title)
    if (!userId || !title) {
        return Response.json(
            { error: 'userId and title are required parameters' },
            { status: 400 }
        );
    }

    try {
        const history = await prisma.history.findFirst({
            where: {
                title: title,
                userId: userId,
            },
        });

        if (!history) {
            return Response.json({ error: 'History not found' }, { status: 404 });
        }

        return Response.json(history);
    } catch (error) {
        console.error('Error fetching history data:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
