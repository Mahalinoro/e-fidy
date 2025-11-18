import CandidateRegistry from './CandidateRegistry.json';
import ElectionFactory from './ElectionFactory.json';
import VoterRegistry from './VoterRegistry.json';
import Election from './Election.json';

export const CANDIDATE_REGISTRY_NAME = 'CandidateRegistry';
export const CANDIDATE_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_CANDIDATE_REGISTRY_C0NTRACT_ADDRESS || '';
export const CANDIDATE_REGISTRY_ABI = CandidateRegistry.abi;

export const VOTER_REGISTRY_NAME = 'VoterRegistry';
export const VOTER_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_VOTER_REGISTRY_C0NTRACT_ADDRESS || '';
export const VOTER_REGISTRY_ABI = VoterRegistry.abi;

export const ELECTION_FACTORY_NAME = 'ElectionFactory';
export const ELECTION_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_ELECTION_FACTORY_C0NTRACT_ADDRESS || '';
export const ELECTION_FACTORY_ABI = ElectionFactory.abi;

export const ELECTION_ABI = Election.abi;