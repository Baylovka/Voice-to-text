import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId } = body

        // Перевірка наявності обов'язкових полів
        if (!userId) {
            return Response.json({ error: 'UserId is required' }, { status: 400 })
        }

        // Перевірка чи існує користувач
        const existingUser = await prisma.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({ message: 'User already exists', user: existingUser }),
                { status: 200 }
            );
        }

        // Створення користувача у базі даних
        const newUser = await prisma.user.create({
            data: {
                clerkUserId: userId
            },
        })

        return new Response(JSON.stringify({ user: newUser }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating user:', error.message);  // Покажемо лише повідомлення про помилку
        } else {
            console.error('Unexpected error:', error);  // Якщо помилка не є об'єктом
        }
        return new Response(JSON.stringify({ error: 'Failed to create user' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
