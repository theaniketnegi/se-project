export interface TaskType {
    id: number;
    task_name: string;
    due_date: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'To Do' | 'Done';
}
