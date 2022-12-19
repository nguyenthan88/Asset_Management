import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';
import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/background.jpg';
import { logIn } from '../../axiosAPIs/AuthenticationApi';
import AuthContext from '../../contexts/AuthContext';
import styles from './Login.module.scss';

const Login = () => {
  const { setAuth } = useContext(AuthContext);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [form] = Form.useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values) => {
    const response = await logIn(values);
    navigate('/');

    const accessToken = response?.accessToken;
    const roles = response?.roles?.$values;
    const username = response?.user;

    setAuth({ username, roles, accessToken });

    navigate(from, { replace: true });
    localStorage.setItem('password', values.password);

    console.log('check values', localStorage.getItem('password'));
  };

  return (
    <div
      className={styles.loginPage}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <Card className={styles.loginForm}>
        <div className={styles.header}>
          <h1>Login</h1>
        </div>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFieldsChange={() => setButtonDisabled(form.getFieldsError().some((field) => field.errors.length > 0))}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
              {
                pattern: /^(?=.*[a-z])(?=.*\d)(?=.*[!-\/:-@\[-`{-~])[A-Za-z\d!-\/:-@\[-`{-~]{8,}$/,
                message:
                  'Your password must be at least 8 characters long, contain at least one number and have a mixture of lowercase letters.',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item shouldUpdate className={styles.header}>
            <Button type="primary" htmlType="submit" className="login-form-button" disabled={buttonDisabled}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
