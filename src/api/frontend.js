import service from "@/utils/request";
export function addUser(data){
    return service.post('/user/add',data)
}