import sequelize from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/auth";

export async function POST(req: NextRequest) {
    await sequelize.sync();
  console.log('into post verify');
  const reqBody = await req.json();
  const token = reqBody?.token;
  console.log('cookeies:', req.headers);

  if (!token) {
    return NextResponse.json({ message: "Token does not exist" }, { status: 403 });
  }

  const { message, user, status } = await getUserFromToken(token ?? "");
  if (!user) {
    return NextResponse.json({ message, success: false }, { status });
  }
  return NextResponse.json({ user });
}