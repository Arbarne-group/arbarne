import { customAlphabet } from "nanoid";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Shareable referral code, e.g. FF-8F3K2A. */
export function newReferralCode(): string {
  return `FF-${customAlphabet(CODE_ALPHABET, 6)()}`;
}
