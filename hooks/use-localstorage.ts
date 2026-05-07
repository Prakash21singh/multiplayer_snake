import { useCallback } from "react";

export const useLocalStorage = () =>{
    const set = useCallback((key: string, value: any)=>{
        localStorage.setItem(key, JSON.stringify(value))
    },[]);

    const get = useCallback((key:string)=>{
        const value = localStorage.getItem(key)

        if(value) return JSON.parse(value);

        return null;
    },[]);

    return {
        set,
        get
    }
}