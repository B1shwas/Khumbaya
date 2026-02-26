// invite to the user 
//accept the invitation 
// invitation accept by the user 
import api from "@/src/api/axios";


export const getEventGuest  = async(eventId:number)=>{
    const  responce = await api.get(`/event/guest/${eventId}`);
    console.warn("🚀 [getEventGuest] API Response:", responce.data);
    return responce.data.data.items;
}
export const getInvitation = async(eventId:number)=>{
    const respnonce  = await api.get(`event/invitation/${eventId}`);
    return respnonce.data.data.items;
}
export const acceptInvitation = async(invitationId:number)=>{
    const responce = await api.post(`/event/invitation/accept/${invitationId}`);
    return responce.data.data.items

}