export interface IRoute {
	path: string;
	element: JSX.Element;
	children?: IRoute[];
}