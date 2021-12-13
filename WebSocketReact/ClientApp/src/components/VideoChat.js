import React, {useCallback, useEffect, useState} from 'react';
import WebCamComponent from "./WebCamComponent";
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const VideoChat = () => {
    //Public API that will echo messages sent to it back to the client
    // eslint-disable-next-line
    const [socketUrl, setSocketUrl] = useState('wss://localhost:7090/ws');
    // eslint-disable-next-line
    const [messageHistory, setMessageHistory] = useState([]);

    const connectTo = useCallback(() => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('wss://localhost:7090/ws');
            }, 2000);
        });
    }, []);
    
    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(connectTo);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory(prev => prev.concat(lastMessage));
        }
    }, [lastMessage, setMessageHistory]);
    
    // eslint-disable-next-line
    const handleClickChangeSocketUrl = useCallback(() =>
        setSocketUrl('wss://localhost:7090/ws'), []);
    
    // eslint-disable-next-line
    const handleClickSendMessage = useCallback(() =>
        // eslint-disable-next-line
        sendMessage('Hello'), []);
        
    // eslint-disable-next-line
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    
        return (
            <div>
                <h1>Web Chat</h1>

                <p>A really barebone .NET/React WebSocket webchat.</p>

                <WebCamComponent/>
                
                <button
                    onClick={handleClickChangeSocketUrl}
                >
                    Click Me to change Socket Url
                </button>

                <button
                    onClick={connectTo}
                >
                    Click To Connect
                </button>
                
                <button
                    onClick={handleClickSendMessage}
                    disabled={readyState !== ReadyState.OPEN}
                >
                    Click Me to send 'Hello'
                </button>
                <span>The WebSocket is currently {connectionStatus}</span>
                {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
                <ul>
                    {messageHistory
                        .map((message, idx) => <span key={idx}>{message ? message.data : null}</span>)}
                </ul>
            </div>
        );
    
}

export default VideoChat;
