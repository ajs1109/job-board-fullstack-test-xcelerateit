import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/middleware/auth';
import Job from '@/models/job';
import sequelize from '@/lib/db';
import { getUserFromToken } from '@/utils/auth';

// Sync models once when the module loads
sequelize.sync().catch(err => console.error('Database sync error:', err));

export async function GET(request: NextRequest) {
  try {
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    const jobs = await Job.findAll({
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('GET /api/jobs error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch jobs', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value ?? '';
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    const { title, description, location, skills } = await request.json();
    const { user } = await getUserFromToken(token);

    if (user?.dataValues.role !== 'employer') {
      return NextResponse.json(
        { message: 'Only employers can create jobs' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!title || !description || !location || !skills) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const job = await Job.create({
      title,
      description,
      location,
      skills: Array.isArray(skills) ? skills : [skills],
      employerId: user.dataValues.id
    });

    // Fetch the created job with employer data
    const createdJob = await Job.findByPk(job.dataValues.id, {
      // include: ['employer']
    });

    return NextResponse.json(createdJob, { status: 201 });
  } catch (error) {
    console.error('POST /api/jobs error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to create job',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}