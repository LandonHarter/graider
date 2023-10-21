'use client'

import { Button, Input } from '@nextui-org/react';
import styles from './page.module.scss';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInWithProvider, signUpWithEmail } from '../../../firebase/auth';

export default function SignUpForm() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signIn(provider: 'google' | 'microsoft') {
        try {
            await signInWithProvider(provider);
            toast.success('Successfully logged in!');
            router.push('/grader');
        } catch (e: any) {
            toast.error(e.message);
        }
    }

    async function signUp() {
        try {
            await signUpWithEmail(email, password, firstName + ' ' + lastName);
            toast.success('Successfully signed up!');
            router.push('/grader');
        } catch (e: any) {
            toast.error(e.message);
        }
    }

    return (
        <>
            <h1 className='text-5xl font-semibold mb-4'>Welcome to Graider!</h1>
            <p className='text-lg font-normal mb-8 text-gray-500'>Please enter your details</p>
            <div className={`flex h-12 mb-8 ${styles.form_item}`}>
                <Button className={`h-full font-medium text-base text-gray-800 mr-1 ${styles.form_item}`} variant='bordered' startContent={(
                    <Image src='/images/providers/google.png' alt='google' width={50} height={50} className='w-6 h-6' />
                )} onClick={async () => {
                    setLoading(true);
                    await signIn('google');
                    setLoading(false);
                }} disabled={loading}>Login with Google</Button>
                <Button className={`h-full font-medium text-base text-gray-800 ml-1 ${styles.form_item}`} variant='bordered' startContent={(
                    <Image src='/images/providers/microsoft.png' alt='google' width={50} height={50} className='w-6 h-6' />
                )} onClick={async () => {
                    setLoading(true);
                    await signIn('microsoft');
                    setLoading(false);
                }} disabled={loading}>Login with Microsoft</Button>
            </div>
            <div className={`flex justify-between items-center mb-8 ${styles.form_item}`}>
                <div className='w-5/12 h-0.5 rounded-full bg-gray-400' />
                <p className='w-1/12 text-lg font-medium text-center text-gray-400'>or</p>
                <div className='w-5/12 h-0.5 rounded-full bg-gray-400' />
            </div>
            <form className='w-full flex flex-col items-center' onSubmit={(e) => {
                e.preventDefault();
            }}>
                <div className={`flex ${styles.form_item}`}>
                    <Input type='text' variant='underlined' label='First Name' className='w-1/2 font-medium text-lg mr-2 mb-4' value={firstName} onChange={(e) => {
                        setFirstName(e.target.value);
                    }} />
                    <Input type='text' variant='underlined' label='Last Name' className='w-1/2 font-medium text-lg ml-2 mb-4' value={lastName} onChange={(e) => {
                        setLastName(e.target.value);
                    }} />
                </div>
                <Input type='email' variant='underlined' label='Email' className={`font-medium text-lg mb-4 ${styles.form_item}`} value={email} onChange={(e) => {
                    setEmail(e.target.value);
                }} />
                <Input type='password' variant='underlined' label='Password' className={`font-medium text-lg mb-10 ${styles.form_item}`} value={password} onChange={(e) => {
                    setPassword(e.target.value);
                }} />
                <Button className={`h-12 font-semibold text-lg mb-4 ${styles.form_item}`} variant='shadow' isLoading={loading} onClick={async () => {
                    setLoading(true);
                    await signUp();
                    setLoading(false);
                }}>Sign Up</Button>
                <p className='font-medium'>Already have an account? <Link href='/signin' className='text-pink-600'>Sign In</Link></p>
            </form>
        </>
    );
}