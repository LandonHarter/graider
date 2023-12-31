import Image from 'next/image';
import styles from './header.module.scss';
import HeaderAccount from './account';
import Link from 'next/link';

export default async function Header() {
    return (
        <header className={styles.header}>
            <div className='flex items-center mx-8'>
                <Link href='/' className='flex items-center mr-16 translate-y-[-3px]'>
                    <Image src='/images/icons/logo-big.png' alt='Graider Logo' width={165} height={75} />
                </Link>
                <nav className='flex items-center'>
                    <ul className='flex flex-row items-center'>
                        <Link href='/'><li className='font-semibold text-gray-500 text-xl mx-6'>Home</li></Link>
                        <Link href='/'><li className='font-semibold text-gray-500 text-xl mx-6'>About</li></Link>
                        <Link href='/'><li className='font-semibold text-gray-500 text-xl mx-6'>Transparency</li></Link>
                    </ul>
                </nav>
            </div>

            <HeaderAccount />
        </header>
    );
}