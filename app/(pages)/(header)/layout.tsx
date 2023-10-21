import basicMetadata from '@/util/metadata';
import Header from '@components/header/header';

export const metadata = basicMetadata();
export default function HeaderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}