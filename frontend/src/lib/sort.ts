import { TaskType } from "@/types";

const swap = (arr: TaskType[], i: number, j: number): void => {
	const temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
};

export const sortTasksByPriority = (tasks: TaskType[]): TaskType[] => {
	let low = 0;
	let normal = 0;
	let high = tasks.length - 1;

	while (normal <= high) {
		switch (tasks[normal].priority) {
			case 'High':
				swap(tasks, low++, normal++);
				break;
			case 'Normal':
				normal++;
				break;
			case 'Low':
				swap(tasks, normal, high--);
				break;
			default:
				break;
		}
	}

	return tasks;
};