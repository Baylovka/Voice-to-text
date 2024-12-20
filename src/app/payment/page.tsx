'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import showMessage from "../utils/showMessage";

export default function PaymentPage() {
    const { userId } = useAuth();
    const TOKEN_COUNT = 5;

    const handleClick = async () => {
        showMessage("Оплата в обробці", `Чекайте поки ваш платіж буде оброблено...`, false);
        try {
            const response = await axios.post("/api/payment", { userId });
            const success = response.data.success;
            if (success) {
                showMessage("Успіх", `Було додано ${TOKEN_COUNT} токенів. Скоріше їх використовувати!`, false);
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                showMessage("Невдача", `Нажаль не вдалося провести оплату. Спробуйте через деякий час!`, true);
            }
        } catch (error) {
            console.error("Error payment", error);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="flex w-full">
                    <Button className="w-full">Оплатити</Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ви готові оплатити?</AlertDialogTitle>
                    <AlertDialogDescription>
                        З вашого рахунку буде знято абсолютного нічого, натомість буде отримано {TOKEN_COUNT} токенів "Voice to text".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Відхилити</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClick}>Оплатити</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}