import { IconContext } from 'react-icons/lib';
import { Button } from './ui/button';
import { MdOutlineAdd } from 'react-icons/md';
const CreateButton = ({
    onClick,
    text,
}: {
    onClick: () => void;
    text: string;
}) => {
    return (
        <Button
            onClick={onClick}
            className='w-full lg:w-32 space-x-4 lg:space-x-2 text-lg lg:text-sm px-8 py-8 lg:py-1 lg:px-2 lg:ml-auto flex lg:justify-center items-center'
        >
            <IconContext.Provider value={{ size: 'auto' }}>
                <div className='w-6 lg:w-4'>
                    <MdOutlineAdd />
                </div>
            </IconContext.Provider>
            <div className='text-xl lg:text-xs'>{text}</div>
        </Button>
    );
};
export default CreateButton;
