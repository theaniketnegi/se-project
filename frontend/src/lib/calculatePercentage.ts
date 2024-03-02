import { ProjectTaskType } from '@/types';

export const calcPercentage = (projectTasks: ProjectTaskType[]) => {
    const weights = { Easy: 1, Medium: 2, Hard: 3 };
    let totalWeighted = 0;

    const totalComplete = projectTasks.reduce((total, task) => {
        let weight = 0;
        totalWeighted += weights[task.difficulty as 'Easy' | 'Medium' | 'Hard'];
        if (task.done) {
            weight = weights[task.difficulty as 'Easy' | 'Medium' | 'Hard'];
        }
        return total + weight;
    }, 0);

    return Math.round((totalComplete / totalWeighted) * 100);
};
