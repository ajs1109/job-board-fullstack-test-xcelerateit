import { NextRequest, NextResponse } from 'next/server';
import { authenticate, getAuthenticatedUser } from '@/middleware/auth';
import Job from '@/models/job';
import { Job as JobType } from '@/types/job';
import { getUserFromToken } from '@/utils/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    const job = await Job.findByPk(params.id, {
    //   include: ['employer']
    });

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('GET /api/jobs/[id] error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch job',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    const user = await getAuthenticatedUser(request);
    const updateData = await request.json();

    // Find the existing job
    const existingJob = await Job.findByPk(params.id);
    if (!existingJob) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    // Verify the user is the job owner
    if (existingJob.dataValues.employerId !== user.id) {
      return NextResponse.json(
        { message: 'You can only update your own jobs' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updatePayload: Partial<JobType> = {};
    if (updateData.title) updatePayload.title = updateData.title;
    if (updateData.description) updatePayload.description = updateData.description;
    if (updateData.location) updatePayload.location = updateData.location;
    if (updateData.skills) {
      updatePayload.skills = Array.isArray(updateData.skills) 
        ? updateData.skills 
        : [updateData.skills];
    }

    // Update the job
    await existingJob.update(updatePayload);

    // Fetch the updated job with employer data
    const updatedJob = await Job.findByPk(params.id, {
      //include: ['employer']
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('PUT /api/jobs/[id] error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to update job',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('auth_token')?.value ?? '';
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    const { user } = await getUserFromToken(token);

    // Find the existing job
    const existingJob = await Job.findByPk(params.id);
    if (!existingJob) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    // Verify the user is the job owner or admin
    if (existingJob.dataValues.employerId !== user?.dataValues.id && user?.dataValues.role !== 'employer') {
      return NextResponse.json(
        { message: 'You can only delete your own jobs' },
        { status: 403 }
      );
    }

    // Delete the job
    await existingJob.destroy();

    return NextResponse.json(
      { message: 'Job deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/jobs/[id] error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to delete job',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}