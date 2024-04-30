import { GlobalStyles, ThemeProvider } from '@mui/material';
import './globalClasses.css';
import { darkTheme } from './layout/themes/darkmode';

function App({ children }: any) {
	return <div className='App'>{children}</div>;
}

export default App;
