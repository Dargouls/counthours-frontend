export interface IService {
	name?: string | undefined;
	user_id: number;
	is_merged: boolean;
	is_principal: boolean;
	total_hours?: number;
	start_date: Date;
	end_date?: Date;
}
