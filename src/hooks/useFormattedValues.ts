import dayjs from 'dayjs';

/**
 * A function that sets formatted values based on the provided configuration.
 *
 * @param {any} value - The value to be formatted.
 * @param {IConfig | undefined} config - The configuration object for formatting.
 * @return {any}  The formatted value based on the configuration.
 */

interface IConfig {
	type?: 'datetime' | 'hours';
}

export const useFormattedValues = () => {
	const setValue = (value: any, config?: IConfig) => {
		const regexDateTime = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

		switch (true) {
			case config?.type === 'hours':
				return `${Math.floor(value / 3600000)}h ${Math.floor((value % 3600000) / 60000)}m`;

			case config?.type === 'datetime':
				return dayjs(value).format('DD/MM/YYYY, HH:mm');

			case regexDateTime.test(value):
				return dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ');

			default:
				return value;
		}
	};

	return { setValue };
};
