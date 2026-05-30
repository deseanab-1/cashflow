import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { FormProps } from 'antd';
import { App, Button, Card, Checkbox, Flex, Form, Input } from 'antd';
import { useAuth0 } from "@auth0/auth0-react";
import './auth.css'

export function LoginPage() {
  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  const { loginWithRedirect } = useAuth0();

  const navigate = useNavigate();
  const { notification } = App.useApp();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    loginWithRedirect();
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
    notification.error({
      message: 'Login Failed',
      description: errorInfo.message,
      placement: 'top',
      duration: 5,
    });
  };

  return (
    <Flex justify="center" align="center" style={{ minHeight: '50vh', background: '#f5f5f5' }}>

    <Card
      title="Create an Account"
      style={{ width: '100%', maxWidth: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    >
      <Form
        className="loginForm"
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="username"
          rules={[{ required: true, message: 'User name is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: 3 }}>
          <Button
            className="authButton"
            type="primary"
            htmlType="submit"
            block>
            Login
          </Button>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="default"
            htmlType="submit"
            onClick={() => navigate('/register')}
            block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </Flex>
  )
}

