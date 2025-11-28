import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Sign up endpoint
app.post('/make-server-63fa048b/signup', async (c) => {
  try {
    const { name, email, password, phone } = await c.req.json();
    
    if (!name || !email || !password) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    // Check if user already exists
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ success: false, error: 'User already exists' }, 400);
    }

    // Create user (in production, hash the password!)
    const user = {
      name,
      email,
      password, // WARNING: In production, use proper password hashing
      phone,
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${email}`, user);
    
    return c.json({ success: true, user: { name, email } });
  } catch (error) {
    console.error('Sign up error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Login endpoint
app.post('/make-server-63fa048b/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ success: false, error: 'Missing credentials' }, 400);
    }

    const user = await kv.get(`user:${email}`);
    
    if (!user || user.password !== password) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }

    return c.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all problems
app.get('/make-server-63fa048b/problems', async (c) => {
  try {
    const problems = await kv.getByPrefix('problem:');
    
    // Sort by timestamp (newest first)
    const sortedProblems = problems.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    return c.json({ success: true, problems: sortedProblems });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new problem
app.post('/make-server-63fa048b/problems', async (c) => {
  try {
    const body = await c.req.json();
    const { title, description, category, location, imageUrl, reportedBy } = body;
    
    if (!title || !description || !category || !location) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    const id = Date.now().toString();
    const problem = {
      id,
      title,
      description,
      category,
      location,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      timestamp: new Date().toISOString(),
      reportedBy: reportedBy || 'Anonymous User'
    };
    
    await kv.set(`problem:${id}`, problem);
    
    return c.json({ success: true, problem });
  } catch (error) {
    console.error('Error creating problem:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a problem (optional - for admin/user management)
app.delete('/make-server-63fa048b/problems/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`problem:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting problem:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
