import { DialogflowConversation, Response } from "actions-on-google";
import { AgentSessionHandler } from "./agent-session-handler";
import uuid = require('uuid');
import requestPromise = require('request-promise-native');
import SockJS = require('sockjs-client');
import Stomp = require('stompjs');
import { getEmailAddress } from '../assistant-utils';
import { EventEmitter } from 'events';
import { PAYLOAD_TYPE_KEY, ORIGIN_EMAIL_KEY } from 'planty-assistant-model/constants';

export class AgentClient {
    private readonly baseUrl = process.env["PLANTY_ASSISTANT_LOGIN_URL"] || 'undefined_url';
    private readonly username = process.env["PLANTY_ASSISTANT_ACCESS_ID"] || 'undefined_username';
    private readonly password = process.env["PLANTY_ASSISTANT_ACCESS_KEY"] || 'undefined_password';

    protected createStompClient(url: string): Stomp.Client {
        const sockJsClient = new SockJS(url.replace(/^ws/, 'http'));
        const stompClient = Stomp.over(sockJsClient);
        // stompClient.setMessageConverter(
        //         new CompositeMessageConverter(
        //                 asList(jacksonMessageConverter, new StringMessageConverter())));
        return stompClient;
    }

    protected async login(baseUrl: string, username: string, password: string): Promise<string> /*throws AuthenticationException*/ {
        const req = {
            username: username,
            password: password
        };
        // const response/*: ResponseEntity<String>*/ = /*new RestTemplate()
        //       .postForEntity(baseUrl, request, String.class)*/
        console.log('>>>> inside login, before requestPromise.post');
        const response = await requestPromise({
            uri: baseUrl,
            method: 'POST',
            json: req
        }, (err, res, body) => {
            if (err)
                console.error('>>>> inside login request.post', err);
            // console.log('>>>> inside login request.post, res.headers: ',  res.headers);
            // console.log('>>>> inside login request.post, body: ',  body);
        });
        console.log('>>>> inside login, after requestPromise.post', response);
        if (!response || !response['id_token']) {
            const msg = "No 'Authorization token found!";
            console.error(`${msg} : `, response);
            throw new /*AuthenticationException*/Error(msg);
        }
        return response['id_token'];
    }

    protected getPayloadType = () => 'be.planty.models.assistant.ActionRequest';

    public async messageAgent(conv: DialogflowConversation, payload: any): Promise<Response> {

        const emitter = new EventEmitter();
        const eventName = 'response-available';
        const futureResponse = new Promise<Response>((resolve, reject) => emitter.on(eventName, resolve));
        const responseHandler = (res: Response) => emitter.emit(eventName, res);

        const accessToken = await this.login(this.baseUrl, this.username, this.password);
        const wsUrl = process.env["PLANTY_ASSISTANT_WS_URL"];
        const url = wsUrl + "/action?access_token=" + accessToken;
        const stompClient = this.createStompClient(url);
        const messageId: string = uuid.v4();
        const handler = this.createSessionHandler(conv, responseHandler, messageId);

        console.log("Connecting to: " + url + " ...");
        const connectAsync = (headers?: any) => new Promise<Stomp.Frame>((resolve, reject) => { 
            stompClient.connect(headers, resolve as any, reject); 
        });
        // const futureSession = connectAsync({})
        connectAsync({})
            .then((frame) => {
                console.info('Connected!');
                console.log('>>>> inside connectAsync: ', frame);
                const emailAddress = getEmailAddress(conv);
                const resDest = "/user/queue/action-responses/" + (emailAddress || null);
                stompClient.subscribe(resDest, handler.messageCallback, {});
                const reqDest = "/topic/action-requests/" + (emailAddress || null);
                const headers: /*StompHeaders*/any = /*new StompHeaders()*/{};
                headers['message-id'] = messageId;
                if (emailAddress)
                    headers[ORIGIN_EMAIL_KEY] = emailAddress;
                if (typeof payload == 'string') {
                    headers['content-type'] = 'text/plain';
                    console.info("Sending a string payload to '" + reqDest + "' : " + payload);
                    stompClient.send(reqDest, headers, payload);
                } else {
                    headers['content-type'] = 'application/json';
                    // headers[PAYLOAD_TYPE_KEY] = payload.getClass().getTypeName();
                    headers[PAYLOAD_TYPE_KEY] = this.getPayloadType();
                    const stringifiedPayload = JSON.stringify(payload);
                    console.info("Sending an object payload to '" + reqDest + "' : ", stringifiedPayload);
                    stompClient.send(reqDest, headers, stringifiedPayload);
                }
            }).catch((err) => {
                console.error(err);
            });
        // console.log('>>>> session: ', await futureSession);
        return futureResponse;
    }

    protected createSessionHandler/*: AgentSessionHandler*/(
        conv: DialogflowConversation, responseHandler: (res: Response) => any,
        messageId: string
    ) {
        return new AgentSessionHandler(conv, messageId, responseHandler);
    }
}
