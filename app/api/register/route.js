import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const RegisterSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedFields = RegisterSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}