import { useState } from 'react';
import { Button } from './components/ui/button';
import { TaskType } from './types';
import { ScrollArea } from './components/ui/scroll-area';
import { Modal } from './components/Modal';

const DUMMY_TASKS: TaskType[] = [
    {
        id: 1,
        task_name:
            'odio condimentum id luctus nec molestie sed justo pellentesque viverra pede',
        due_date: '2022-05-19',
        priority: 'Medium',
        status: 'To Do',
    },
    {
        id: 2,
        task_name:
            'mattis odio donec vitae nisi nam ultrices libero non mattis pulvinar nulla pede ullamcorper augue a suscipit',
        due_date: '2022-12-04',
        priority: 'Low',
        status: 'To Do',
    },
    {
        id: 3,
        task_name:
            'pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed tristique in',
        due_date: '2022-07-03',
        priority: 'High',
        status: 'To Do',
    },
    {
        id: 4,
        task_name:
            'venenatis turpis enim blandit mi in porttitor pede justo eu massa donec dapibus duis',
        due_date: '2022-12-25',
        priority: 'Low',
        status: 'To Do',
    },
    {
        id: 5,
        task_name:
            'primis in faucibus orci luctus et ultrices posuere cubilia curae mauris viverra diam vitae quam suspendisse potenti nullam porttitor',
        due_date: '2022-05-15',
        priority: 'Medium',
        status: 'To Do',
    },
    {
        id: 6,
        task_name:
            'semper porta volutpat quam pede lobortis ligula sit amet eleifend pede libero quis orci nullam molestie nibh in lectus',
        due_date: '2022-09-29',
        priority: 'Medium',
        status: 'To Do',
    },
    {
        id: 7,
        task_name:
            'magnis dis parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent',
        due_date: '2022-12-13',
        priority: 'Low',
        status: 'To Do',
    },
    {
        id: 8,
        task_name:
            'pretium iaculis justo in hac habitasse platea dictumst etiam faucibus cursus urna ut tellus nulla ut erat id mauris vulputate',
        due_date: '2022-11-09',
        priority: 'Low',
        status: 'To Do',
    },
    {
        id: 9,
        task_name:
            'dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem',
        due_date: '2022-10-03',
        priority: 'Low',
        status: 'To Do',
    },
    {
        id: 10,
        task_name:
            'vel est donec odio justo sollicitudin ut suscipit a feugiat et eros vestibulum ac est',
        due_date: '2022-09-24',
        priority: 'Low',
        status: 'Done',
    },
];

const App = () => {
    const [tasks, setTasks] = useState<TaskType[]>(DUMMY_TASKS);
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAddTask = (
        title: string,
        priority: Pick<TaskType, 'priority'>,
        due_date: string,
    ) => {
        const newTask:TaskType = {
            id: Date.now(),
            title,
            priority,
            due_date,
            status: 'To Do',
        };

        setTasks(tasks.concat(newTask));
        console.log(title, priority, due_date);
    };

    return (
        <>
            {showModal && (
                <Modal
                    onCloseModal={handleCloseModal}
                    onAddTask={handleAddTask}
                />
            )}

            <main className='w-[1536px] p-8 space-y-8 mx-auto'>
                <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                    To do app
                </h2>
                <Button onClick={() => setShowModal(true)}>Add a task</Button>
                <ScrollArea className='h-[600px] p-4 border-2 rounded-md'>
                    <div className='space-y-4'>
                        {tasks.map((task) => (
                            <div
                                className={`border-l-8  p-4 border-2 rounded-lg shadow-sm ${
                                    task.priority === 'Low'
                                        ? 'border-green-300'
                                        : task.priority == 'Medium'
                                        ? 'border-yellow-300'
                                        : 'border-red-300'
                                }
									flex justify-between
								`}
                                key={task.id}
                            >
                                <div>{task.task_name}</div>
                                <div>{task.due_date}</div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </main>
        </>
    );
};
export default App;
