import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  date,
  numeric,
  bigint,
} from 'drizzle-orm/pg-core'

// Better Auth tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refreshToken: text('refreshToken'),
  accessToken: text('accessToken'),
  expiresAt: bigint('expiresAt', { mode: 'number' }),
  tokenType: text('tokenType'),
  scope: text('scope'),
  idToken: text('idToken'),
  sessionState: text('sessionState'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Rental system tables
export const rentals = pgTable('rentals', {
  id: text('id').primaryKey(),
  // Auth user (optional — null for guest checkouts)
  userId: text('userId').references(() => user.id, { onDelete: 'set null' }),
  // Guest / contact info
  customerName: text('customerName'),
  customerEmail: text('customerEmail'),
  customerPhone: text('customerPhone'),
  customerCompany: text('customerCompany'),
  customerCIF: text('customerCIF'),
  notes: text('notes'),
  // Groups all items from the same Stripe checkout session
  orderGroupId: text('orderGroupId'),
  // Product + rental period
  productId: text('productId').notNull(),
  status: text('status').notNull().default('pending'),
  // pending | confirmed | ready | picked | returned | cancelled
  startDate: text('startDate').notNull(),
  endDate: text('endDate').notNull(),
  quantity: integer('quantity').notNull().default(1),
  totalPrice: numeric('totalPrice', { precision: 10, scale: 2 }).notNull(),
  // Stripe
  stripePaymentId: text('stripePaymentId'),
  paymentStatus: text('paymentStatus').default('pending'),
  // pending | paid
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const rental_documents = pgTable('rental_documents', {
  id: text('id').primaryKey(),
  rentalId: text('rentalId')
    .notNull()
    .references(() => rentals.id, { onDelete: 'cascade' }),
  documentType: text('documentType').notNull(),
  documentUrl: text('documentUrl').notNull(),
  status: text('status').default('pending'),
  uploadedAt: timestamp('uploadedAt').notNull().defaultNow(),
})

export const rental_agreements = pgTable('rental_agreements', {
  id: text('id').primaryKey(),
  rentalId: text('rentalId')
    .notNull()
    .references(() => rentals.id, { onDelete: 'cascade' }),
  agreementUrl: text('agreementUrl'),
  signedAt: timestamp('signedAt'),
  signatureUrl: text('signatureUrl'),
  status: text('status').default('pending'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const product_edits = pgTable('product_edits', {
  id: text('id').primaryKey(),
  productId: text('productId').notNull(),
  editedBy: text('editedBy')
    .notNull()
    .references(() => user.id, { onDelete: 'set null' }),
  changes: jsonb('changes').notNull(),
  changeType: text('changeType').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const stock_log = pgTable('stock_log', {
  id: text('id').primaryKey(),
  productId: text('productId').notNull(),
  previousStock: integer('previousStock'),
  newStock: integer('newStock'),
  reason: text('reason'),
  rentalId: text('rentalId').references(() => rentals.id, { onDelete: 'set null' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const email_logs = pgTable('email_logs', {
  id: text('id').primaryKey(),
  rentalId: text('rentalId').references(() => rentals.id, { onDelete: 'cascade' }),
  emailType: text('emailType').notNull(),
  recipientEmail: text('recipientEmail').notNull(),
  status: text('status').default('sent'),
  sentAt: timestamp('sentAt').notNull().defaultNow(),
})
