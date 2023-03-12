// @deno-types="npm:@types/express"
import express from 'npm:express';
import router from './routes/routes.ts';

export const app = express();
app.use(express.json());
app.use(router)
app.listen(3000);

console.log('listening on http://localhost:3000/');
