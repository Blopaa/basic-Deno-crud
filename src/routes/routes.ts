import { Router, Request, Response } from 'npm:express';
import { User } from '../entity/user.ts';

const router = Router();

async function readUsers(): Promise<User[]> {
  return JSON.parse(await Deno.readTextFile('./users.json'));
}

async function writeUsers(users: User[]): Promise<void> {
  await Deno.writeTextFile('./users.json', JSON.stringify(users, null, 4));
}

router.get('/', async (_req: Request, res: Response) => {
  return res.json(await readUsers());
});

router.post('/', async (req: Request, res: Response) => {
  const users: User[] = await readUsers();
  const user: User = req.body;
  user.id = users.length + 1;
  users.push(user);
  await writeUsers(users);
  res.json(users);
});

router.put('/:id', async (req: Request, res: Response) => {
  const users: User[] = await readUsers();
  const receivedUser: User = req.body;
  const id = parseInt(req.params.id);
  const user = users[id - 1];
  user
    ? (receivedUser.id = id)
    : res.status(404).json({ message: 'User not found' });
  users[id - 1] = receivedUser;
  await writeUsers(users);
  res.json(users);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const users: User[] = await readUsers();
    if(!users[id - 1]) return res.status(404).json({ message: 'User not found' });
    users.splice(id - 1, 1);
    await writeUsers(users);
    res.json(users);
});

export default router;
