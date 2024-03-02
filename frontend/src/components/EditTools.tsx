import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import { IconContext } from 'react-icons/lib';
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';

const EditTools = ({
    edit,
    onClickUpdate,
    onClickDelete,
    toggleEdit,
}: {
    edit: boolean;
    onClickUpdate: () => void;
    onClickDelete: () => void;
    toggleEdit: () => void;
}) => {
    return (
        <IconContext.Provider value={{ color: 'auto', size: '20' }}>
            <div className='flex space-x-6'>
                {!edit ? (
                    <div
                        className='group relative hover:-translate-y-[2px] transition duration-100'
                        onClick={toggleEdit}
                    >
                        <MdOutlineEdit className='cursor-pointer' />
                        <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                    </div>
                ) : (
                    <div className='flex space-x-4'>
                        <div
                            className='group relative hover:-translate-y-[2px] transition duration-100'
                            onClick={onClickUpdate}
                        >
                            <IoMdCheckmark className='cursor-pointer' />
                            <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                        </div>
                        <div
                            className='group relative hover:-translate-y-[2px] transition duration-100'
                            onClick={toggleEdit}
                        >
                            <IoMdClose className='cursor-pointer' />
                            <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                        </div>
                    </div>
                )}

                <div
                    className='group relative hover:-translate-y-[2px] transition duration-100'
                    onClick={onClickDelete}
                >
                    <MdOutlineDelete className='cursor-pointer' />
                    <div className='absolute w-full bottom-0 group-hover:border-b-2 group-hover:border-black'></div>
                </div>
            </div>
        </IconContext.Provider>
    );
};
export default EditTools;
