import * as React from 'react';
import styles from './Chatgpt.module.scss';
import { IChatGPTState, IChatgptProps } from './IChatgptProps';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { IconButton, TextField } from 'office-ui-fabric-react';
import { HttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';

export default class Chatgpt extends React.Component<IChatgptProps, IChatGPTState> {

  public constructor(props: IChatgptProps) {
    super(props);
    this.state = { question: "", answer: "" };
  }

  public render(): React.ReactElement<IChatgptProps> {
    const {
      hasTeamsContext,
      wpContext
    } = this.props;

    //const URL = this.props.apiURL;
    const body: string = JSON.stringify({
      'q': this.state.question,
      'rows': 1
    });
    const chatContainer = document.getElementsByClassName(styles.chatContainer);

    const requestHeaders: Headers = new Headers();
    requestHeaders.append('Content-type', 'application/json');

    const httpClientOptions: IHttpClientOptions = {
      body: body,
      headers: requestHeaders,
      mode: 'no-cors'
    };

    const shareIcon: IIconProps = { iconName: "Send" };

    const saveQuestion = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void => {
      this.setState({ question: newValue });
    }

    const addMessage = (isSent: boolean, message: string, msgTimestamp: string): HTMLDivElement => {
      const messageElement = document.createElement('div');
      messageElement.classList.add(styles.chatMessage);
      if (isSent) {
        messageElement.classList.add(styles.sent);
      }
      const avatar = document.createElement('div');
      avatar.classList.add(styles.avatar);

      // const avatorIcon = Icon({
      //   iconName: isSent ? "FollowUser" : "LeaveUser"
      // });
      //avatar.appendChild(avatorIcon);
      const messageBubble = document.createElement('div');
      messageBubble.classList.add(styles.messageBubble);
      messageBubble.textContent = message;
      const timestamp = document.createElement('div');
      timestamp.classList.add(styles.timestamp);
      timestamp.textContent = msgTimestamp;
      messageElement.appendChild(avatar);
      messageElement.appendChild(messageBubble);
      messageElement.appendChild(timestamp);
      return messageElement;
    }

    const sendMessage = (): void => {
      const msgElem = addMessage(false, this.state.question, new Date().toString());
      if (chatContainer && chatContainer.length > 0) {
        chatContainer[0].appendChild(msgElem);
      }
      wpContext.httpClient.post(
        this.props.apiURL, HttpClient.configurations.v1, httpClientOptions
      )
        .then((response: HttpClientResponse) => {
          return response.json();
        })
        .then(jsonResponse => {
          if (jsonResponse) {
            const msgElem = addMessage(true, jsonResponse.answer, new Date().toString());
            if (chatContainer && chatContainer.length > 0) {
              chatContainer[0].appendChild(msgElem);
            }
          }
          return jsonResponse;
        }) as Promise<any>;
    }

    return (
      <section className={`${styles.chatgpt} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.chatContainer}>
        
        </div>
        <div className={styles.chatInput}>
          <TextField onChange={saveQuestion} />
          <IconButton
            iconProps={shareIcon}
            style={{ backgroundColor: "whitesmoke", color: "black" }}
            width={50}
            height={50}
            aria-label="share"
            onClick={sendMessage} />
        </div>
      </section>
    );
  }
}
