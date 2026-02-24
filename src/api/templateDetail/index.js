import post from "../../http/http";
import { Port } from "../../http/http";

export default function templateDetailRequset(data){
    return post(Port.defaultPort,data)
}