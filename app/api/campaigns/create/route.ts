import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaignData = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
        }
      }
    );

    // Create the campaign
    const { data, error } = await supabase
      .from('crowdfunding_campaigns')
      .insert([
        {
          user_id: userId,
          title: campaignData.title,
          short_description: campaignData.shortDescription,
          full_description: campaignData.fullDescription,
          industry: campaignData.industry,
          target_amount: parseInt(campaignData.targetAmount),
          lightning_address: campaignData.lightningAddress,
          image_url: campaignData.imageUrl || null,
          linkedin_url: campaignData.linkedinUrl,
          email: campaignData.email,
          website_url: campaignData.websiteUrl || null,
          team_members: campaignData.teamMembers.split('\n').filter(Boolean),
          risks_challenges: campaignData.risksAndChallenges,
          timeline: JSON.stringify({
            milestones: campaignData.timeline.split('\n').filter(Boolean)
          }),
          status: 'active',
          current_amount: 0,
          investor_count: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
} 