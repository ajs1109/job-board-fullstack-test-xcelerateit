import { NextRequest, NextResponse } from 'next/server';
import { authenticate, getAuthenticatedUser } from '@/middleware/auth';
import Job from '@/models/job';
import sequelize from '@/lib/db';
import { Job as JobType } from '@/types/job';
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

// export async function PUT(request: NextRequest) {
//   try {
//     const authResponse = await authenticate(request);
//     if (authResponse) return authResponse;

//     const user = await getAuthenticatedUser(request);
//     const { id, ...updateData } = await request.json();

//     if (!id) {
//       return NextResponse.json(
//         { message: 'Job ID is required' },
//         { status: 400 }
//       );
//     }

//     // Find the existing job
//     const existingJob = await Job.findByPk(id);
//     if (!existingJob) {
//       return NextResponse.json(
//         { message: 'Job not found' },
//         { status: 404 }
//       );
//     }

//     // Verify the user is the job owner
//     if (existingJob.employerId !== user.id) {
//       return NextResponse.json(
//         { message: 'You can only update your own jobs' },
//         { status: 403 }
//       );
//     }

//     // Prepare update data
//     const updatePayload: Partial<JobType> = {};
//     if (updateData.title) updatePayload.title = updateData.title;
//     if (updateData.description) updatePayload.description = updateData.description;
//     if (updateData.location) updatePayload.location = updateData.location;
//     if (updateData.skills) {
//       updatePayload.skills = Array.isArray(updateData.skills) 
//         ? updateData.skills 
//         : [updateData.skills];
//     }

//     // Update the job
//     await existingJob.update(updatePayload);

//     // Fetch the updated job with employer data
//     const updatedJob = await Job.findByPk(id, {
//       include: ['employer']
//     });

//     return NextResponse.json(updatedJob);
//   } catch (error) {
//     console.error('PUT /api/jobs error:', error);
//     return NextResponse.json(
//       { 
//         message: 'Failed to update job',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const authResponse = await authenticate(request);
//     if (authResponse) return authResponse;

//     const user = await getAuthenticatedUser(request);
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json(
//         { message: 'Job ID is required' },
//         { status: 400 }
//       );
//     }

//     // Find the existing job
//     const existingJob = await Job.findByPk(id);
//     if (!existingJob) {
//       return NextResponse.json(
//         { message: 'Job not found' },
//         { status: 404 }
//       );
//     }

//     // Verify the user is the job owner or admin
//     if (existingJob.employerId !== user.id && user.role !== 'admin') {
//       return NextResponse.json(
//         { message: 'You can only delete your own jobs' },
//         { status: 403 }
//       );
//     }

//     // Delete the job
//     await existingJob.destroy();

//     return NextResponse.json(
//       { message: 'Job deleted successfully' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('DELETE /api/jobs error:', error);
//     return NextResponse.json(
//       { 
//         message: 'Failed to delete job',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }