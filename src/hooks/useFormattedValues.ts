export const useFormattedValues = () => {
	const setValue = (value: any, type?: string) => {
		switch (type) {
			case 'hours':
				return `${Math.floor(value / 3600000)}h ${Math.floor((value % 3600000) / 60000)}m`;

			default:
				'value';
				return;
		}
	};

	return { setValue };
};
