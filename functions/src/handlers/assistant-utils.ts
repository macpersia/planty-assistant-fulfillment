import { DialogflowConversation } from "actions-on-google";

export const getEmailAddress = (conv: DialogflowConversation): string | null => {
    // // console.log('>>>> all contexts: ', conv.contexts);
    // const ctx = conv.contexts.get('my-session');
    // console.log('>>>> ctx: ', ctx);    
    // if (!ctx || !ctx.parameters)
    //     return null;
    // const email = ctx.parameters.email;
    const email = conv.data['email'];
    console.log('>>>> email: ', email);
    return email as string;
};