export interface IService {
	name?: string | undefined;
	user_id: number;
	is_merged: boolean;
	start_date: Date;
	end_date?: Date;
}
