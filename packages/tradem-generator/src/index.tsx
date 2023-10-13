import './index.css'

import { render } from 'solid-js/web'

import App from './App'
import AppHead from './AppHead';

render(() => <AppHead />, document.head);

let root = document.getElementById('root');

if (!root) {
    root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
}

render(() => <App />, root);
