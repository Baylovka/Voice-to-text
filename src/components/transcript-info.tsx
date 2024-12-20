import { Card, CardContent } from "@/components/ui/card";

interface InfoBlockProps {
    title: string;
    value: string | number;
}

function InfoBlock({ title, value }: InfoBlockProps) {
    return (
        <Card className="p-4">
            <CardContent>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-lg font-bold">{value}</h3>
            </CardContent>
        </Card>
    );
}

interface InfoBlocksProps {
    language: string | null;
    processingTime: string | null;
    wordCount: number | null;
}

export default function InfoBlocks({ language, processingTime, wordCount }: InfoBlocksProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <InfoBlock title="Мова" value={language ?? "N/A"} />
            <InfoBlock title="Час обробки" value={processingTime ?? "N/A"} />
            <InfoBlock title="Кількість слів" value={wordCount ?? "N/A"} />
        </div>
    );
}