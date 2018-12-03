import { DialogflowConversation, Response } from 'actions-on-google';
import { getEmailAddress } from '../assistant-utils';
import Stomp = require('stompjs');

const PAYLOAD_TYPE_KEY = "planty.payload.type";

export class AgentSessionHandler /*implements StompSessionHandlerAdapter*/ {

    //protected readonly emailAddress?: string;
    public connectCallback = (frame: Stomp.Frame) => this.afterConnected(frame.headers);
    public messageCallback = (message: Stomp.Message) => this.handleFrame(message.headers, message.body);

    constructor(protected readonly conv: DialogflowConversation,
                protected readonly messageId: string,
                protected readonly responseHandler: (res: Response) => any
    ) {
        //this.emailAddress = getEmailAddress(conv);
    }

    //@Override
    public afterConnected(/*session: StompSession, */connectedHeaders/*: StompHeaders*/): void {
        // super.afterConnected(session, connectedHeaders);
        // console.log('>>>> inside afterConnected, session: ', session);
        console.log('>>>> inside afterConnected, headers: ', connectedHeaders);
    }

    // @Override
    // public getPayloadType(headers/*: StompHeaders*/): /*Type*/any {
    //     const typeName: string = headers.getFirst(PAYLOAD_TYPE_KEY);
    //     if (typeName == null)
    //         return super.getPayloadType(headers);
    //     try {
    //         return Class.forName(typeName);

    //     } catch (e/*: ClassNotFoundException*/) {
    //         console.error(e.getMessage(), e);
    //         return ActionResponse.class;
    //     }
    // }

    // @Override
    public handleFrame(headers/*: StompHeaders*/, payload: any): void {

        console.log('>>>> handling frame...');
        console.log('>>>> headers: ', headers);
        console.log('>>>> payload: ', payload);
        const destination = headers['destination'];

        if (headers['correlation-id'] == this.messageId
            && destination.startsWith('/user/queue/action-responses')
            //&& (!this.emailAddress || destination.endsWith(this.emailAddress))
        ) {
            const response = payload instanceof String ?
                payload as string
                : /*toPrettyJson(payload)*/payload;
            console.info("Here's the action response: " + response);
            const report: string = response == "Pong!" ?
                "Agent pong!"
                : "All right! I'm done!";
            // this.futureResponse.resolve(this.conv.ask(report));
            this.responseHandler(report);
        }
    }

    // // @Override
    // public handleException(session/*: StompSession*/, command/*: StompCommand*/, headers/*: StompHeaders*/,
    //     payload/*: byte[]*/, exception/*: Throwable*/): void {
    //     console.error(exception.toString(), exception);
    // }

    // // @Override
    // public handleTransportError(session/*: StompSession*/, exception/*: Throwable*/): void {
    //     console.error(exception.toString(), exception);
    // }
}
