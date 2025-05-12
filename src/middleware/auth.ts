import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function authenticate(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { message: 'No token, authorization denied' },
      { status: 401 }
    );
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return null;
  } catch (error) {
    return NextResponse.json(
      { message: 'Token is not valid' },
      { status: 401 }
    );
  }
}

export async function getAuthenticatedUser(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  return jwt.verify(token as string, process.env.JWT_SECRET as string) as {
    id: number;
    role: string;
  };
}