import { NextResponse } from 'next/server';
import { authenticate, getAuthenticatedUser } from '@/middleware/auth';
import Job from '@/models/job';
import sequelize from '@/lib/db';

export async function GET(request: Request) {
  await sequelize.sync();
  
  try {
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    const jobs = await Job.findAll();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Force sync the model to ensure schema is up to date
  await sequelize.sync({ force: false });
  
  try {
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    const { title, description, location, skills } = await request.json();
    const user = await getAuthenticatedUser(request);

    if (user.role !== 'employer') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
    }

    // Create job with explicit fields only, letting Sequelize handle the ID
    const job = await Job.create({
      title,
      description,
      location,
      skills,
      employerId: user.id,
    }, {
      // Add this to see more detailed error information
      logging: console.log
    });

    // Log the created job to verify ID is being generated
    console.log("Created job:", job.toJSON());

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    // Enhanced error logging
    console.error("Error creating job:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    
    return NextResponse.json(
      { message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}