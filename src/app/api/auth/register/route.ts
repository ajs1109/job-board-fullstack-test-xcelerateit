import { NextRequest, NextResponse } from "next/server";
import sequelize from "@/lib/db";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/utils/config";

export async function POST(request: NextRequest) {
  await sequelize.sync();
  try {
    const { name, email, password, role } = await request.json();

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Return user without password
    const { ...userWithoutPassword } = user.toJSON();

    const token = jwt.sign({ id: user.dataValues.id }, JWT_SECRET, { expiresIn: "2days" });
    const response = NextResponse.json(
      {
        user: userWithoutPassword,
        token,
        message: "Signup successful",
        success: true,
      },
      { status: 201 }
    );
    response.cookies.set("auth_token", token);

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
