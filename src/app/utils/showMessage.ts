import { toast } from "@/hooks/use-toast";

export default function showMessage(title: string, description: string, isError: boolean) {
    const variant = isError ? "destructive" : null;

    toast({
        variant: variant,
        title: title,
        description: description,
    })
}