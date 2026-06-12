-- Migration: 0001_guest_checkout
-- Run this in your Neon SQL console before testing checkout

-- 1. Make userId nullable (guest checkout doesn't require auth)
ALTER TABLE rentals ALTER COLUMN "userId" DROP NOT NULL;

-- 2. Add guest / contact info columns
ALTER TABLE rentals
  ADD COLUMN IF NOT EXISTS "customerName"    text,
  ADD COLUMN IF NOT EXISTS "customerEmail"   text,
  ADD COLUMN IF NOT EXISTS "customerPhone"   text,
  ADD COLUMN IF NOT EXISTS "customerCompany" text,
  ADD COLUMN IF NOT EXISTS "customerCIF"     text,
  ADD COLUMN IF NOT EXISTS "notes"           text,
  ADD COLUMN IF NOT EXISTS "orderGroupId"    text;

-- 3. Change startDate / endDate to text (was date, now we store ISO strings directly)
--    Skip if you already have these as text in your DB.
-- ALTER TABLE rentals ALTER COLUMN "startDate" TYPE text;
-- ALTER TABLE rentals ALTER COLUMN "endDate" TYPE text;

-- 4. Fix IDs: remove the literal string default and let app generate UUIDs
ALTER TABLE rentals ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE rental_documents ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE rental_agreements ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE product_edits ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE stock_log ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE email_logs ALTER COLUMN "id" DROP DEFAULT;
