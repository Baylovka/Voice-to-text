import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResultBlockProps {
    transcript: string | null;
}

export default function ResultBlock({ transcript }: ResultBlockProps) {
    const handleDownload = () => {
        if (!transcript) return;
        const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'transcript.txt';
        link.click();
    };

    return (
        <Card className="p-4">
            <CardHeader>
                <h2 className="text-lg font-semibold">Результат</h2>
            </CardHeader>
            <CardContent>
                <pre className="p-4 bg-gray-100 rounded-md max-h-[10em] whitespace-pre-wrap overflow-x-auto">
                    {transcript}
                </pre>
                <Button className="mt-4" onClick={handleDownload}>
                    Завантажити текст
                </Button>
            </CardContent>
        </Card>
    );
}