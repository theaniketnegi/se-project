export interface TaskType {
	_id: string;
    title: string;
    due_date: Date;
    done: boolean;
    priority: string;
    created_by: string;
}

export type UserType = {
    token: string;
    name: string;
    section: string;
    program: string;
    student_id: string;
};
