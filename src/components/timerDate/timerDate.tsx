import { LoadingButton } from '@mui/lab';
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface ITimer {
	date: string | undefined;
	isLoading?: boolean;
}

export const TimerDate = ({ date, isLoading }: ITimer) => {
	const [internalLoading, setLoading] = useState<boolean | undefined>(true);
	const [timer, setTimer] = useState<string>('0:00');

	useEffect(() => {
		if (!date) return;
		const updateTimer = () => {
			const timeDifference = new Date().getTime() - new Date(date).getTime();
			const hours = Math.floor(timeDifference / (1000 * 60 * 60));
			const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
			setTimer(`${hours < 10 ? '' : '0'}${hours}:${minutes.toString().padStart(2, '0')}`);
			setLoading(isLoading);
		};

		const intervalId = setInterval(updateTimer, 1000);
		return () => clearInterval(intervalId);
	}, [date]);

	return (
		<LoadingButton variant='outlined' loading={internalLoading}>
			<Typography variant='h3'>{timer}</Typography>
		</LoadingButton>
	);
};
