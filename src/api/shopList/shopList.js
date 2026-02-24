import post from "../../http/http";
import { Port } from "../../http/http";

export default function shopListRequset(data){
    return post(Port.defaultPort,data)
}
