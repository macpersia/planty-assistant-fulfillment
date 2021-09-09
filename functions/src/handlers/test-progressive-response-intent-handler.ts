import { /* DialogflowConversation,  */BasicCard, Suggestions } from 'actions-on-google';

export const testProgressiveResponseIntentHandler = (conv: /* DialogflowConversation */any) => {
    //console.log('agent parameter for getPhoneNoIntent: ', agent);
    conv.ask(`This message is from Dialogflow's Cloud Functions for Agent Proto!`);
    conv.ask(new BasicCard({
        title: `Title: this is a card title`,
        image: {
            url: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
            accessibilityText: "Google Assistant's Badge"
        },
        text: `This is the body text of a card. You can even use line\n breaks and emoji! 💁`,
        buttons: {
            title: 'This is a button',
            openUrlAction: { url: 'https://assistant.google.com/' }
        }
    })
    );
    conv.ask(new Suggestions(`Quick Reply`));
    conv.ask(new Suggestions(`Suggestion`));
    conv.contexts.set('weather', 2, { city: 'Kuala Lumpur' });
};
