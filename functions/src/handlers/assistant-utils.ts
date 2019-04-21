import { DialogflowConversation } from "actions-on-google";

export const getEmailAddress = (conv: DialogflowConversation) => {
    // // console.log('>>>> all contexts: ', conv.contexts);
    // const ctx = conv.contexts.get('my-session');
    // console.log('>>>> ctx: ', ctx);    
    // if (!ctx || !ctx.parameters)
    //     return null;
    // const email = ctx.parameters.email;
    const email = (conv.data as any)['email'];
    console.log('>>>> email: ', email);
    return email as string;
};