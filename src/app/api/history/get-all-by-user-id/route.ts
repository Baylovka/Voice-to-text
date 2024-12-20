import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return Response.json({ error: 'UserId is required' }, { status: 400 });
    }

    const historyRecords = await prisma.history.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json(historyRecords, { status: 200 });
  } catch (error) {
    console.error('Error fetching history:', error);
    return Response.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
