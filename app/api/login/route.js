import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validatedFields.data;

    // Get user from database
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Create a simple session (in production, use proper session management)
    const response = NextResponse.json(
      { message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } },
      { status: 200 }
    );

    // Set a simple auth cookie (in production, use proper JWT or session tokens)
    response.cookies.set('auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}