import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Flex, Card } from 'antd';
import './register.css'

export function RegisterPage() {
  type FieldType = {
    username?: string;
    password?: string;
    confirmPassword?: string;
    remember?: string;
  };

  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.username, // Auth0 defaults to email for database connections
          password: values.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log('Registration succesful!', data);
      navigate('/login')

    } catch (error) {
      console.error(error);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Flex justify="center" align="center" style={{ minHeight: '50vh', background: '#f5f5f5' }}>

    <Card
      title="Create an Account"
      style={{ width: '100%', maxWidth: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    >
      <Form
        className="registerForm"
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

        <Form.Item<FieldType>
          label="Confirm Password"
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </Flex>
  )
}

