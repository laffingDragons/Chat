// definition of the interface 

export interface ChatMessage {
    chatId?: string,
    message: string,
    createdOn: Date,
    receiverId: string,
    receiverName:string,
    senderId: string,
    senderName: string
    
}