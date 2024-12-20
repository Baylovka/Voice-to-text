import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
    apiKey: process.env.MY_ASSEMBLYAI_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            return new Response(JSON.stringify({ error: 'No valid file uploaded' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const transcript = await client.transcripts.transcribe({
            audio: file,
            language_detection: true
        });

        return new Response(JSON.stringify({ transcript }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing file:', error);
        return new Response(JSON.stringify({ error: 'Error processing file' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}