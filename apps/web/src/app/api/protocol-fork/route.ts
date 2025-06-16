// apps/web/src/app/api/protocol-fork/route.ts
/**
 * API route for managing Protocol Fork proposals and voting.
 * Players can submit proposals for game rule changes, and vote on active ones.
 * Approved proposals (potentially after AI/Admin review) can modify globalGameRules.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { verifyUser } from '@/lib/auth/server-auth';
// import { saveProposalToDB, getProposalsFromDB, recordVoteInDB, getProposalByIdFromDB } from '@/lib/db/firestore'; // Example DB functions
// import type { ProtocolForkProposalDoc, Vote } from '@packages/common-types/db'; // Assuming types

interface ProtocolForkProposal {
    proposalId: string;
    proposerId: string;
    proposerName?: string; // Denormalized
    title: string;
    description: string; // Detailed description of the proposed change
    targetRuleKey?: string; // e.g., "globalGameRules.pvpDamageModifier.aicore_vs_hacker"
    suggestedChangeValue?: string; // e.g., "set_value: 0.9" or "increase_by_percentage: 0.05"
    category: 'game_balance' | 'new_feature' | 'lore_adjustment' | 'ai_behavior_tweak' | 'economic_change';
    status: 'draft' | 'voting' | 'pending_review' | 'approved' | 'rejected' | 'merged' | 'archived';
    votes: {
        up: number;
        down: number;
        voters: Record<string, 'up' | 'down' | 'neutral'>; // playerId: voteType
    };
    createdAt: string; // ISO Date string
    votingEndsAt?: string; // ISO Date string
    discussionLink?: string; // Link to a forum thread for this proposal
    adminNotes?: string; // Notes from admin review
}

// Mock database for proposals
let mockProposals: ProtocolForkProposal[] = [
    {
        proposalId: "pf_001_assimilation_cooldown",
        proposerId: "player_innovator_1",
        proposerName: "InnovatorOne",
        title: "Reduce Assimilation Protocol Cooldown",
        description: "To promote more dynamic faction warfare and increase the stakes of PvP, I propose reducing the 'safe' cooldown period after being assimilated before a player can be targeted for assimilation again. Current: 24 hours. Proposed: 12 hours.",
        targetRuleKey: "gameplayRules.faction.assimilation.cooldownHours",
        suggestedChangeValue: "12",
        category: 'game_balance',
        status: "voting",
        votes: { up: 15, down: 3, voters: {} },
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        votingEndsAt: new Date(Date.now() + 86400000 * 5).toISOString(), // In 5 days
        discussionLink: "/forums/thread/pf_001_assimilation_cooldown_discussion"
    },
    {
        proposalId: "pf_002_hacker_buff_zone_capture",
        proposerId: "player_shadow_agent_7",
        proposerName: "ShadowAgent7",
        title: "Increase Sync Point Gain for Hackers in Contested Zones",
        description: "Hackers often struggle to secure zones against AI Core's organized efforts. Suggesting a +15% bonus to Synchronization Point gain for Hacker faction members actively participating in contested zones.",
        targetRuleKey: "gameplayRules.zoneControl.syncPointModifier.Hacker.contestedZone",
        suggestedChangeValue: "1.15",
        category: 'faction_balance',
        status: "pending_review", // Awaiting admin/AI governance check
        votes: { up: 28, down: 5, voters: {} },
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    }
];

export async function GET(request: NextRequest) {
  // Fetch all active/votable proposals, or a specific proposal
  const { searchParams } = new URL(request.url);
  const proposalId = searchParams.get('proposalId');
  const statusFilter = searchParams.get('status');

  // const proposalsFromDB = await getProposalsFromDB({ status: statusFilter || undefined });
  let results = mockProposals;

  if (proposalId) {
    const proposal = results.find(p => p.proposalId === proposalId);
    return proposal ? NextResponse.json(proposal) : NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  if (statusFilter) {
    results = results.filter(p => p.status === statusFilter);
  }
  
  console.log(`API /api/protocol-fork: GET request - returning ${results.length} proposals.`);
  return NextResponse.json(results.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function POST(request: NextRequest) {
  // Submit a new proposal or vote on an existing one
  // const user = await verifyUser(request);
  // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // const userId = user.uid;
  // const userName = user.displayName || user.uid; // Example
  const userId = "mock_player_id_" + Math.floor(Math.random()*1000);
  const userName = "MockPlayer" + Math.floor(Math.random()*100);

  const body = await request.json();
  const { action, proposalId, voteDirection, title, description, category, targetRuleKey, suggestedChangeValue, discussionLink } = body;

  if (action === 'submit_proposal') {
    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Title, description, and category are required for new proposals.' }, { status: 400 });
    }
    const newProposal: ProtocolForkProposal = {
      proposalId: `pf_${category.substring(0,3)}_${Date.now()}`,
      proposerId: userId,
      proposerName: userName,
      title,
      description,
      category,
      targetRuleKey,
      suggestedChangeValue,
      status: 'voting', // Or 'pending_review' if moderation is needed first
      votes: { up: 0, down: 0, voters: {} },
      createdAt: new Date().toISOString(),
      votingEndsAt: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days voting period
      discussionLink,
    };
    mockProposals.unshift(newProposal);
    // await saveProposalToDB(newProposal);
    console.log(`API /api/protocol-fork: New proposal submitted by ${userId}: ${newProposal.proposalId}`);
    return NextResponse.json(newProposal, { status: 201 });

  } else if (action === 'vote' && proposalId && ['up', 'down', 'neutral'].includes(voteDirection)) {
    const proposalIndex = mockProposals.findIndex(p => p.proposalId === proposalId);
    if (proposalIndex === -1) {
      return NextResponse.json({ error: 'Proposal not found.' }, { status: 404 });
    }
    const proposal = mockProposals[proposalIndex];
    if (proposal.status !== 'voting') {
        return NextResponse.json({ error: 'This proposal is not currently open for voting.' }, { status: 400 });
    }
    if (new Date(proposal.votingEndsAt || 0) < new Date()) {
        proposal.status = 'pending_review'; // Auto-close voting if ended
        // await updateProposalInDB(proposalId, { status: 'pending_review' });
        return NextResponse.json({ error: 'Voting period has ended for this proposal.' }, { status: 400 });
    }

    // Remove previous vote if exists, then add new vote
    const previousVote = proposal.votes.voters[userId];
    if (previousVote === 'up') proposal.votes.up--;
    else if (previousVote === 'down') proposal.votes.down--;

    proposal.votes.voters[userId] = voteDirection;
    if (voteDirection === 'up') proposal.votes.up++;
    else if (voteDirection === 'down') proposal.votes.down++;
    
    // await recordVoteInDB(proposalId, userId, voteDirection);
    console.log(`API /api/protocol-fork: Player ${userId} voted '${voteDirection}' on proposal ${proposalId}`);
    return NextResponse.json(proposal);
  }

  return NextResponse.json({ error: 'Invalid action or missing parameters for Protocol Fork.' }, { status: 400 });
}

// PATCH could be used by admins/AI Governance to change proposal status (approve, reject, merge)
export async function PATCH(request: NextRequest) {
    // const isAdmin = await verifyAdmin(request); // Or check for AI governance service identity
    // if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const body = await request.json();
    const { proposalId, newStatus, adminNotes } = body;

    if (!proposalId || !newStatus) {
        return NextResponse.json({ error: "Proposal ID and new status are required." }, { status: 400 });
    }
    const validStatuses: ProtocolForkProposal['status'][] = ['draft', 'voting', 'pending_review', 'approved', 'rejected', 'merged', 'archived'];
    if (!validStatuses.includes(newStatus)) {
        return NextResponse.json({ error: "Invalid new status provided." }, { status: 400 });
    }

    const proposalIndex = mockProposals.findIndex(p => p.proposalId === proposalId);
    if (proposalIndex === -1) {
      return NextResponse.json({ error: 'Proposal not found.' }, { status: 404 });
    }
    
    mockProposals[proposalIndex].status = newStatus;
    if (adminNotes) mockProposals[proposalIndex].adminNotes = adminNotes;
    
    // If 'merged', trigger game rule update via game-rules-engine.ts
    if (newStatus === 'merged') {
        // const proposal = mockProposals[proposalIndex];
        // await gameRulesEngine.applyProtocolFork(proposal.targetRuleKey, proposal.suggestedChangeValue);
        console.log(`API /api/protocol-fork: Proposal ${proposalId} MERGED. Game rules engine to be invoked (simulated).`);
    }
    
    console.log(`API /api/protocol-fork: Admin/AI changed status of proposal ${proposalId} to ${newStatus}.`);
    return NextResponse.json(mockProposals[proposalIndex]);
}
