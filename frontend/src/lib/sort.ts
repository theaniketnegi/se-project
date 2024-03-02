import { TaskType } from "@/types";

export const sortTasksByPriority = (tasks: TaskType[]): TaskType[] => {
    const priorityMap = { 'Low': 0, 'Normal': 1, 'High': 2 };

    const sortByPriority = (taskA: TaskType, taskB: TaskType) => {
        const priorityA = priorityMap[taskA.priority as 'Low'|'Normal'|'High'];
        const priorityB = priorityMap[taskB.priority as 'Low'|'Normal'|'High'];

        if (priorityA !== priorityB) {
            return priorityB - priorityA;
        } else {
            // If priorities are the same, sort by createdAt in descending order
            return new Date(taskB.createdAt).getTime() - new Date(taskA.createdAt).getTime();
        }
    };

    tasks.sort(sortByPriority);
    return tasks;
};
