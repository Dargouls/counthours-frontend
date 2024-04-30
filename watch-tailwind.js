import chokidar from 'chokidar';
import { exec } from 'child_process';

// Configuração do Chokidar para ignorar arquivos temporários
const watcher = chokidar.watch('src/**/*.{html,ts,tsx,jsx,js,css}', {
	ignored: /D:\\DumpStack\.log\.tmp$/, // Ignora arquivos começando com ponto (por exemplo, arquivos ocultos)
	ignoreInitial: true,
	persistent: true,
});

// Função para processar o Tailwind CSS
function buildTailwind() {
	exec(
		'npx tailwindcss -i ./src/build-tailwind.css -o ./src/tailwind.css',
		(error, stdout, stderr) => {
			if (error) {
				console.error(`Erro: ${error.message}`);
				return;
			}
			if (stderr) {
				console.error(`Erro (stderr): ${stderr}`);
				return;
			}
			console.log(stdout);
		}
	);
}

// Chama a função buildTailwind quando arquivos são modificados
watcher.on('change', (path) => {
	buildTailwind();
	console.clear();
	console.log(`Arquivo ${path} foi modificado. Reconstruindo...`);
});

console.clear();
console.log('Assistindo mudanças nos arquivos...');
