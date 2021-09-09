import { /* DialogflowConversation,  */BasicCard } from "actions-on-google";
import { getEmailAddress } from "./assistant-utils";

export const emailAddressIntentHandler = (conv: /* DialogflowConversation */any) => {
    const emailAddress = getEmailAddress(conv);
    const title = emailAddress ?
        'EmailAddress'
        : 'Account Linking Needed!';
    const text = emailAddress ?
        'Your registered email address is ' + emailAddress
        : 'Please sign in, and try again.';
    conv.ask(text);
    conv.ask(new BasicCard({ title: title, text: text }));
};
