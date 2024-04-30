import dayjs from 'dayjs';

export const useFormattedValues = () => {
	const setValue = (value: any, type?: string) => {
		const regexDateTime = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

		switch (true) {
			case type === 'hours':
				return `${Math.floor(value / 3600000)}h ${Math.floor((value % 3600000) / 60000)}m`;

			case regexDateTime.test(value):
				console.log('formatação: ', dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ'));
			default:
				return value;
		}
	};

	return { setValue };
};
