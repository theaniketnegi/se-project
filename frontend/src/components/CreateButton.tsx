import { Button } from './ui/button';
import { MdOutlineAdd } from "react-icons/md";
const CreateButton = ({
    onClick,
    text,
    className,
}: {
    onClick: () => void;
    text: string;
    className: string;
}) => {
    return (
            <Button onClick={onClick} className={className}>
				<MdOutlineAdd size={15} />
                <div className='text-md'>{text}</div>
            </Button>
    );
};
export default CreateButton;
