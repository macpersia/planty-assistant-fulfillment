import { AgentClient } from './agent-client';
import { mocked } from 'ts-jest/utils';
import { DialogflowConversation } from 'actions-on-google';
import { ActionRequest } from 'planty-assistant-model';

jest.setTimeout(10000);

describe('AgentClient', () => {
    let instance: AgentClient;

    beforeEach(() => {
        instance = new AgentClient();
    });

    it('should get a response for requesting an action with string input', async () => {
        expect(instance).toBeInstanceOf(AgentClient);
        const mockConv = mocked(new DialogflowConversation()) as DialogflowConversation;
        mockConv.data['email'] = 'agent.prototyper@localhost';        
        const message = "Ping!";
        const response = await instance.messageAgent(mockConv, message);
        expect(response).toBeDefined();
        expect(response).toBe("Agent pong!");
    });

    it('should get a response for requesting an action with object input', async () => {
        expect(instance).toBeInstanceOf(AgentClient);
        const mockConv = mocked(new DialogflowConversation()) as DialogflowConversation;
        mockConv.data['email'] = 'agent.prototyper@localhost';        
        const message = new ActionRequest("Ping!");
        const response = await instance.messageAgent(mockConv, message);
        expect(response).toBeDefined();
        expect(response).toBe("All right! I'm done!");
    });

    it('should get a response from a shared agent for requesting an action with string input', async () => {
        expect(instance).toBeInstanceOf(AgentClient);
        const mockConv = mocked(new DialogflowConversation()) as DialogflowConversation;
        const message = "Ping!";
        const response = await instance.messageAgent(mockConv, message);
        expect(response).toBeDefined();
        expect(response).toBe("Agent pong!");
    });
});