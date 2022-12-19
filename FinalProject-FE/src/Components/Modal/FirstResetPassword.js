import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import countDown from './ChangePasswordSuccess';
const FirstResetPassword = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const onFill = () => {
        form.setFieldsValue({
            userName: localStorage.getItem('userName'),
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            oldPassword: localStorage.getItem('password'),
        });
    }, [form])

    const onOk = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                onCreate(values);
                localStorage.removeItem("password");
                localStorage.setItem('password', values.newPassword);
                localStorage.removeItem("isFirstTime");
                onCancel()
                countDown();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
        onFill();
    };

    return (
        <Modal
            open={open}
            title="Change Password"
            okText="Save"
            cancelText="Cancel"
            footer={[
                <Button key="submit" type="primary" disabled={buttonDisabled} onClick={onOk}>
                    Submit
                </Button>,
            ]}
            closable={false}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
                onFieldsChange={() =>
                    setButtonDisabled(
                        form.getFieldsError().some((field) => field.errors.length > 0)
                    )
                }

            >
                <p> This  is the first time you logged in. You have to change your password to continue</p>

                <Form.Item
                    hidden="true"
                    label="Old Password"
                    name="oldPassword"
                >
                    <Input.Password />

                </Form.Item>
                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the New Password',
                        },
                        {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-\/:-@\[-`{-~])[A-Za-z\d!-\/:-@\[-`{-~]{8,}$/,
                            message: 'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.'
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (getFieldValue('oldPassword') === value) {
                                    return Promise.reject(new Error('New password should be different with Old password'));
                                }
                                return Promise.resolve();

                            },
                        }),
                    ]}
                >
                    <Input.Password/>

                </Form.Item>
                <Form.Item name="userName" label="User Name" hidden="true" >
                    <Input type="textarea" />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default FirstResetPassword;
