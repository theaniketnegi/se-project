export interface TaskType {
    _id: string;
    title: string;
    due_date: Date;
    done: boolean;
    priority: string;
    created_by: string;
    createdAt: string;
}

export type UserType = {
    token: string;
    name: string;
    section: string;
    program: string;
    student_id: string;
};

export type AdminType = {
    token: string;
    name: string;
    org: string;
    adminId: string;
};

export interface ProjectType {
    _id: string;
    title: string;
    description: string;
    projectTasks: ProjectTaskType[];
    created_by: string;
}

export interface ProjectTaskType {
    _id: string;
    done: boolean;
    difficulty: string;
    project: string;
    title: string;
}
