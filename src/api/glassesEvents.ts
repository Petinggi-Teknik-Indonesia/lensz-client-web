// api/users.js
import axios from "./axios";

export async function webSocketCompleteRegistration(){
    const {data} = await axios.post(`/scanner/complete`);
    return data
}