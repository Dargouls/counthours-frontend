export interface IMergedService {
	id: number;
	name?: string;
	user_id: number;
	total_hours: number;
	start_date: Date;
	end_date?: Date;
}
