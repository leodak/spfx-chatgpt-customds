import * as React from 'react';
import styles from './ChatGpt.module.scss';
import { IChatGPTState, IChatGptProps } from './IChatGptProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { IconButton, TextField, Icon } from 'office-ui-fabric-react';
import { HttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';

export default class Chatgpt extends React.Component<IChatGptProps, IChatGPTState> {

  public constructor(props: IChatGptProps) {
    super(props);
    this.state = { question: "", answer: "" };
  }

  public render(): React.ReactElement<IChatgptProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      wpContext
    } = this.props;

    const URL = "https://prod-31.australiasoutheast.logic.azure.com:443/workflows/93b82558de8e4080826cf493ca4729e1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zSlhhIfDva6O5-ICwpTQsmlTY2ISfDDSNo2LC2027Nc";
    const body: string = JSON.stringify({
      'question': this.state.question,
    });
    const chatContainer = document.getElementsByClassName(styles['chat-container']);

    const requestHeaders: Headers = new Headers();
    requestHeaders.append('Content-type', 'application/json');

    const httpClientOptions: IHttpClientOptions = {
      body: body,
      headers: requestHeaders
    };

    const shareIcon: IIconProps = { iconName: "Send" };
    const sentAvatar: IIconProps = { iconName: "FollowUser" };
    const leaveAvatar: IIconProps = { iconName: "LeaveUser" };
    
    const sendMessage = () => {
      let msgElem = addMessage(false, this.state.question, new Date().toString());
      if(chatContainer && chatContainer.length > 0){
        chatContainer[0].appendChild(msgElem);
      }
      wpContext.httpClient.post(
        URL, HttpClient.configurations.v1, httpClientOptions
      )
        .then((response: HttpClientResponse) => {
          return response.json();
        })
        .then(jsonResponse => {
          if(jsonResponse) {
            let msgElem = addMessage(true, jsonResponse.answer, new Date().toString());
            if(chatContainer && chatContainer.length > 0){
              chatContainer[0].appendChild(msgElem);
            }
          }
          return jsonResponse;
        }) as Promise<any>;
    }

    const saveQuestion = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string) => {
      this.setState({ question: newValue });
    }

    const addMessage = (isSent: boolean, message: string, msgTimestamp: string) => {
      const messageElement = document.createElement('div');
      messageElement.classList.add(styles['chat-message']);
      if (isSent) {
        messageElement.classList.add(styles.sent);
      }
      const avatar = document.createElement('div');
      avatar.classList.add(styles.avatar);
      
      const avatorIcon = Icon({
        iconName: isSent ? "FollowUser" : "LeaveUser"
      });
      //avatar.appendChild(avatorIcon);
      const messageBubble = document.createElement('div');
      messageBubble.classList.add(styles['message-bubble']);
      messageBubble.textContent = message;
      const timestamp = document.createElement('div');
      timestamp.classList.add(styles.timestamp);     
      timestamp.textContent = msgTimestamp;
      messageElement.appendChild(avatar);
      messageElement.appendChild(messageBubble);
      messageElement.appendChild(timestamp);
      return messageElement;
    }

    return (
      <section className={`${styles.chatGpt} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles['chat-container']}>
          <div className={styles['chat-message']}>
            <div className={styles.avatar}>
              <Icon iconName="FollowUser" />
            </div>
            <div className={styles['message-bubble']}>Chat app html and css example with user avatar</div>
            <div className={styles.timestamp}>2:30 PM</div>
          </div>
          <div className={`${styles['chat-message']} ${styles.sent}`}>
            <div className={styles.avatar}>
            <Icon iconName="LeaveUser" />
            </div>
            <div className={styles['message-bubble']}>In this example, each chat message contains an avatar element and a message element. The avatar element contains an image tag with the source set to the user's avatar image, and the message element contains the message content and timestamp. The CSS includes styles for the avatar and message elements, as well as the input field and send button.</div>
            <div className={styles.timestamp}>2:31 PM</div>
          </div>
        </div>
        <div className={styles['chat-input']}>
          <TextField onChange={saveQuestion}>

          </TextField>
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
