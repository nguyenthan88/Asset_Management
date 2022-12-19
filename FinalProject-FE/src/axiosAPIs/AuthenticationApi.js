import axios from 'axios';
import { message } from 'antd';
import { BASE_URL, TOKEN_KEY } from '../constants';

export async function logIn(loginInfo) {
  const url = `${BASE_URL}/user-management/login`;

  let response = undefined;

  await axios
    .post(url, loginInfo)
    .then((result) => {
      response = result.data;
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem('userName', response.user);
      localStorage.setItem('roles', response.roles.$value);
      localStorage.setItem('isFirstTime', response.isFirstTime);
      localStorage.setItem('location', response.location);
      localStorage.setItem('userId', response.id);
      console.log(response)
    })
    .catch((error) => {
      console.log({ error });
      message.error('Wrong Password or UserName, Please try again');
    });

  return response;
}
