// api/users.js
import type { Glasses, GlassesInput } from "@/types/glasses";
import axios from "./axios";

export async function webSocketCompleteRegistration(){
    const {data} = await axios.post(`/scanner/complete`);
    return data
}