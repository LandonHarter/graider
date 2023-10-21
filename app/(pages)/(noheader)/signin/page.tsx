import Image from 'next/image';
import SignInForm from './form';
import Link from 'next/link';
import styles from './page.module.scss';
import NoAuth from '@components/auth/noauth';

export default function SigninPage() {
    return (
        <NoAuth redirectUrl='/'>
            <Link href='/' className='absolute left-6 top-6 flex items-center'>
                <Image src='/images/icons/logo-big.png' alt='icon' width={200} height={75} />
            </Link>
            <div className='w-screen h-screen flex'>
                <div className={`h-screen flex flex-col justify-center items-center ${styles.form_container}`}>
                    <SignInForm />
                </div>
                <div className={`h-screen ${styles.right}`} />
            </div>
        </NoAuth>
    );
}