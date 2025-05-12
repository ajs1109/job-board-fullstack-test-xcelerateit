import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import sequelize from "@/lib/db";
import { JWT_SECRET } from "@/utils/config";

export async function POST(request: Request) {
  await sequelize.sync();

  try {
    const { email, password } = await request.json();

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.findOne({ where: { name: email } });
      if(!user){
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 400 }
        );
      }
    }

    const isMatch = await bcrypt.compare(password, user.dataValues.password ?? '');
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const { ...userWithoutPassword } = user.toJSON();

    const token = jwt.sign({ id: user.dataValues.id }, JWT_SECRET, { expiresIn: "2days" });
    const response = NextResponse.json(
      {
        user: userWithoutPassword,
        token,
        message: "Login successful",
        success: true,
      },
      { status: 200 }
    );
    response.cookies.set("auth_token", token);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
