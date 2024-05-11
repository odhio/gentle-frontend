"use client"
import React from 'react';
import { SignUpForm } from '@/feature/routes/login/SignUpForm';
import Layout from '@/app/_component/Layout';

export default function Login() {
    return (
        <Layout>
            <SignUpForm/>
        </Layout>
    );
};