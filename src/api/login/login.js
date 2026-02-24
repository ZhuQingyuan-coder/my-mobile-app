import post from "../../http/http";
import { Port } from "../../http/http";

export function orgInfoRequset(data){
    return post(Port.defaultPort,data)
}



export default function loginRequest(data){
    return post(Port.defaultPort,data)
}



