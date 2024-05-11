"use client"
import React from 'react';
import { LoginPage } from '@/feature/routes/login/Login';
import Layout from '@/app/component/Layout';

export default function Login() {
    return (
        <Layout>
            <LoginPage/>
        </Layout>
    );
};
