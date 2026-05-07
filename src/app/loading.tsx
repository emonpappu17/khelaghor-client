import { Spinner } from '@/components/ui/spinner';

const loading = () => {
    return (
        <div className="flex flex-col items-center gap-4 justify-center min-h-screen">
            <Spinner className='size-10' />
        </div>
    );
};

export default loading;