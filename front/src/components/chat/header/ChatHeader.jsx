import { useState } from 'react';
import { DropdownMenu } from "../menu/DropdownMenu";

import { chooseAvatar } from '../../../utils';

const ChatHeader = ({ chat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { firstName, lastName, avatar } = chat;
  return <div className="right-header">
    <div className="person-info">
      <img src={chooseAvatar(avatar)} alt={'avatar'} className="person-avatar"/>
      <div className="person-name">{firstName} {lastName}</div>
    </div>
    <div className="ellipsis" onClick={() => {setIsOpen(!isOpen);}}>...</div>
    {isOpen && <DropdownMenu/>}
  </div>;
};

export { ChatHeader };