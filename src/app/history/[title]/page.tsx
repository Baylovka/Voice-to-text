'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import InfoBlocks from "@/components/transcript-info";
import ResultBlock from "@/components/transcript-result";

interface IHistory {
    id: number
    title: string
    language: string
    processingTime: string
    wordCount: number
    transcript: string
    userId: string
}

export default function HistoryPage() {
    const { userId } = useAuth();
    const { title } = useParams();
    const [historyData, setHistoryData] = useState<IHistory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (title && userId) {
            const fetchHistoryData = async () => {
                try {
                    const response = await axios.post("/api/history/get-by-title", {
                        userId,
                        title: decodeURIComponent(title as string),
                    });
                    setHistoryData(response.data);
                } catch (error) {
                    console.error("Error fetching history data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchHistoryData();
        }
    }, [title, userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!historyData) {
        return <div>History not found</div>;
    }

    return (
        <>
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                {historyData.title}
            </h1>

            <InfoBlocks
                language={historyData.language}
                processingTime={historyData.processingTime}
                wordCount={historyData.wordCount}
            />
            <br />

            <ResultBlock transcript={historyData.transcript} />
        </>
    );
}
