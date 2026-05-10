import { storeHydrationErrorStateFromConsoleArgs } from "next/dist/next-devtools/userspace/pages/hydration-error-state";
import { useEffect, useState } from "react";

export const useUser = () => {
    const [id, setId] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        const storedName = localStorage.getItem("userName");

        if (!storedId) {
            const newId = `user_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("userId", newId);
            setId(newId);
        } else {
            setId(storedId);
        }

        if(storedName){
            setName(storedName);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("userName", name || "");
    }, [name]);

    return {
        id,
        name,
        setName
    };
}
