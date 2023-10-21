'use client'

import { useAuthSession } from "@/context/UserContext";
import { auth } from "@/firebase/init";
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeaderAccount() {
    const { user, loading, error } = useAuthSession();
    const [status, setStatus] = useState<'authenticated' | 'unauthenticated' | 'loading'>('loading');

    useEffect(() => {
        if (loading) setStatus('loading');
        else if (!user) setStatus('unauthenticated');
        else if (user) setStatus('authenticated');
        else setStatus('unauthenticated');
    }, [user, loading, error]);

    function noAvatar() {
        return (
            <div className='flex items-center'>
                <Link href='/signin'>
                    <Button variant='light' className="font-semibold text-md p-[24px] mr-4 text-gray-500">Log In</Button>
                </Link>
                <Link href='/signup'>
                    <Button className="font-semibold text-md p-[24px] rounded-full text-white" style={{
                        backgroundImage: 'url(/images/designs/signup.png)',
                    }}>Sign Up</Button>
                </Link>
            </div>
        );
    }

    function avatar() {
        return (
            <>
                <Dropdown placement='bottom-end'>
                    <DropdownTrigger>
                        <Avatar name={user?.name || ''} src={user?.picture || ''} icon={null} showFallback className="cursor-pointer" />
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem key='signout' color='danger' onPress={() => {
                            setStatus('unauthenticated');
                            auth.signOut();
                        }}>Sign Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </>
        );
    }

    if (status === 'authenticated') return avatar();
    else if (status === 'unauthenticated') return noAvatar();
    return (<Skeleton className="flex rounded-full w-10 h-10" />);
}