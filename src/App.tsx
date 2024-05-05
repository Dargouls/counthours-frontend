import { LoginProvider } from './contexts/AuthContext';
import './globalClasses.css';

function App({ children }: any) {
	return (
		<div className='App'>
			<LoginProvider>{children}</LoginProvider>
		</div>
	);
}

export default App;
