import React from 'react';
import { Button, Modal } from 'antd';
const countDown = () => {
  let secondsToGo = 3;
  const modal = Modal.success({
    title: 'Change Password',
    content: `Your password has been changed successfully`,
  });
  
};
const App = () => <Button onClick={countDown}>Open modal to close in 5s</Button>;
export default countDown;
