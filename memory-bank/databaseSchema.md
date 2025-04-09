# Database Schema Design

## Overview

This document outlines the database schema design for AwesomeEvent using SQLite for development and prototyping, with a planned migration to Turso for production. The schema is designed to be flat and avoid circular dependencies while supporting the platform's core features, particularly the enhanced categorization system.

## Design Principles

1. **Flat Structure**: Avoid nested schemas that can lead to circular dependencies
2. **Junction Tables**: Use junction tables for many-to-many relationships
3. **SQLite Compatibility**: Ensure all schema elements work with SQLite and Turso
4. **Type Safety**: Leverage Drizzle ORM for type-safe database access
5. **Scalability**: Design with future growth in mind
6. **Performance**: Optimize for common query patterns
7. **Migration Path**: Ensure smooth transition from SQLite to Turso

## Core Tables

### Users

```typescript
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImage: text("profile_image"),
  preferences: text("preferences", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### Organizations

```typescript
export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  website: text("website"),
  contactEmail: text("contact_email"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
```

### UserOrganizations (Junction)

```typescript
export const userOrganizations = sqliteTable("user_organizations", {
  id: text("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // member, admin, owner
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export type UserOrganization = typeof userOrganizations.$inferSelect;
export type NewUserOrganization = typeof userOrganizations.$inferInsert;
```

### Categories

```typescript
export const categoryTypes = sqliteTable("category_types", {
  id: text("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  typeId: text("type_id").notNull().references(() => categoryTypes.id),
  parentId: text("parent_id").references(() => categories.id),
  path: text("path").notNull(), // Simulated LTREE path (e.g., "root.parent.child")
  icon: text("icon"),
  color: text("color"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export type CategoryType = typeof categoryTypes.$inferSelect;
export type NewCategoryType = typeof categoryTypes.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
```

### Events

```typescript
export const events = sqliteTable("events", {
  id: text("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  organizerId: text("organizer_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  locationName: text("location_name"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  timezone: text("timezone").notNull(),
  format: text("format").notNull().default("in-person"), // in-person, virtual, hybrid
  featuredImage: text("featured_image"),
  website: text("website"),
  maxAttendees: integer("max_attendees"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
```

### EventCategories (Junction)

```typescript
export const eventCategories = sqliteTable("event_categories", {
  id: text("id").primaryKey().defaultRandom(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export type EventCategory = typeof eventCategories.$inferSelect;
export type NewEventCategory = typeof eventCategories.$inferInsert;
```

### Tickets

```typescript
export const ticketTypes = sqliteTable("ticket_types", {
  id: text("id").primaryKey().defaultRandom(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // In cents
  quantity: integer("quantity"),
  startSaleDate: integer("start_sale_date", { mode: "timestamp" }),
  endSaleDate: integer("end_sale_date", { mode: "timestamp" }),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const tickets = sqliteTable("tickets", {
  id: text("id").primaryKey().defaultRandom(),
  ticketTypeId: text("ticket_type_id").notNull().references(() => ticketTypes.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  orderReference: text("order_reference").notNull(),
  status: text("status").notNull().default("reserved"), // reserved, purchased, checked-in, cancelled, refunded
  purchaseDate: integer("purchase_date", { mode: "timestamp" }),
  checkinDate: integer("checkin_date", { mode: "timestamp" }),
  qrCode: text("qr_code"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export type TicketType = typeof ticketTypes.$inferSelect;
export type NewTicketType = typeof ticketTypes.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
```

### Rewards

```typescript
export const pointTransactions = sqliteTable("point_transactions", {
  id: text("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventId: text("event_id").references(() => events.id, { onDelete: "set null" }),
  points: integer("points").notNull(),
  reason: text("reason").notNull(), // registration, attendance, referral, review
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const rewards = sqliteTable("rewards", {
  id: text("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  pointCost: integer("point_cost").notNull(),
  type: text("type").notNull(), // discount, merchandise, vip, feature
  value: text("value").notNull(), // Depends on type: discount amount, merchandise ID, feature ID
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const rewardRedemptions = sqliteTable("reward_redemptions", {
  id: text("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rewardId: text("reward_id").notNull().references(() => rewards.id, { onDelete: "cascade" }),
  pointsSpent: integer("points_spent").notNull(),
  status: text("status").notNull().default("redeemed"), // redeemed, used, expired, cancelled
  redeemedAt: integer("redeemed_at", { mode: "timestamp" }).notNull().defaultNow(),
  usedAt: integer("used_at", { mode: "timestamp" }),
});

export type PointTransaction = typeof pointTransactions.$inferSelect;
export type NewPointTransaction = typeof pointTransactions.$inferInsert;
export type Reward = typeof rewards.$inferSelect;
export type NewReward = typeof rewards.$inferInsert;
export type RewardRedemption = typeof rewardRedemptions.$inferSelect;
export type NewRewardRedemption = typeof rewardRedemptions.$inferInsert;
```

### Resources

```typescript
export const resources = sqliteTable("resources", {
  id: text("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  summary: text("summary"),
  type: text("type").notNull(), // guide, template, best-practice, tutorial
  featuredImage: text("featured_image"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export const resourceCategories = sqliteTable("resource_categories", {
  id: text("id").primaryKey().defaultRandom(),
  resourceId: text("resource_id").notNull().references(() => resources.id, { onDelete: "cascade" }),
  categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
});

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type ResourceCategory = typeof resourceCategories.$inferSelect;
export type NewResourceCategory = typeof resourceCategories.$inferInsert;
```

## Indexes and Constraints

### Indexes for Performance

```typescript
// User indexes
export const userEmailIndex = sqliteIndex("user_email_idx").on(users).column(users.email);

// Event indexes
export const eventSlugIndex = sqliteIndex("event_slug_idx").on(events).column(events.slug);
export const eventStartDateIndex = sqliteIndex("event_start_date_idx").on(events).column(events.startDate);
export const eventCityIndex = sqliteIndex("event_city_idx").on(events).column(events.city);

// Category indexes
export const categorySlugIndex = sqliteIndex("category_slug_idx").on(categories).column(categories.slug);
export const categoryPathIndex = sqliteIndex("category_path_idx").on(categories).column(categories.path);

// Junction table indexes
export const eventCategoryEventIdIndex = sqliteIndex("event_category_event_id_idx").on(eventCategories).column(eventCategories.eventId);
export const eventCategoryCategoryIdIndex = sqliteIndex("event_category_category_id_idx").on(eventCategories).column(eventCategories.categoryId);
```

### Unique Constraints

```typescript
export const userOrganizationUniqueIndex = sqliteIndex("user_organization_unique_idx")
  .on(userOrganizations)
  .columns([userOrganizations.userId, userOrganizations.organizationId])
  .unique();

export const eventCategoryUniqueIndex = sqliteIndex("event_category_unique_idx")
  .on(eventCategories)
  .columns([eventCategories.eventId, eventCategories.categoryId])
  .unique();

export const resourceCategoryUniqueIndex = sqliteIndex("resource_category_unique_idx")
  .on(resourceCategories)
  .columns([resourceCategories.resourceId, resourceCategories.categoryId])
  .unique();
```

## LTREE Path Simulation for Hierarchical Categories

Since SQLite doesn't have native LTREE support like PostgreSQL, we'll simulate the hierarchical structure using string paths:

```typescript
// Helper functions for path management
export const getCategoryPath = async (db: Database, categoryId: string): Promise<string> => {
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  });
  
  return category?.path || "";
};

export const getChildCategories = async (db: Database, path: string): Promise<Category[]> => {
  return db.query.categories.findMany({
    where: sql`${categories.path} LIKE ${path + '.%'}`,
  });
};

export const getAncestorCategories = async (db: Database, path: string): Promise<Category[]> => {
  const ancestors: Category[] = [];
  const parts = path.split('.');
  let currentPath = '';
  
  for (let i = 0; i < parts.length - 1; i++) {
    currentPath += (i > 0 ? '.' : '') + parts[i];
    const ancestor = await db.query.categories.findFirst({
      where: eq(categories.path, currentPath),
    });
    if (ancestor) ancestors.push(ancestor);
  }
  
  return ancestors;
};
```

## Database Migration Strategy

When migrating from SQLite to Turso:

1. **Generate Schema Script**: Use Drizzle to generate the schema for both databases
2. **Test Compatibility**: Ensure all SQLite queries work with Turso
3. **Data Migration**: Export data from SQLite and import to Turso
4. **Switch Connection**: Update the application to use the Turso connection
5. **Verify**: Test all functionality with the new database

## Query Examples

### Multi-dimensional Event Filtering

```typescript
export const getFilteredEvents = async (
  db: Database,
  filters: {
    eventTypes?: string[];
    industries?: string[];
    formats?: string[];
    location?: string;
    startDate?: Date;
    endDate?: Date;
    priceMin?: number;
    priceMax?: number;
  },
  pagination: { page: number; limit: number }
): Promise<{ events: Event[]; total: number }> => {
  const { eventTypes, industries, formats, location, startDate, endDate, priceMin, priceMax } = filters;
  const { page, limit } = pagination;
  
  const whereConditions: SQL<unknown>[] = [
    eq(events.isPublished, true),
  ];
  
  // Add filter conditions
  if (formats && formats.length > 0) {
    whereConditions.push(inArray(events.format, formats));
  }
  
  if (location) {
    whereConditions.push(
      or(
        like(events.city, `%${location}%`),
        like(events.state, `%${location}%`),
        like(events.country, `%${location}%`)
      )
    );
  }
  
  if (startDate) {
    whereConditions.push(gte(events.startDate, startDate.getTime()));
  }
  
  if (endDate) {
    whereConditions.push(lte(events.startDate, endDate.getTime()));
  }
  
  // Get category IDs for event types and industries
  let eventTypeIds: string[] = [];
  let industryIds: string[] = [];
  
  if (eventTypes && eventTypes.length > 0) {
    const eventTypeCategories = await db.query.categories.findMany({
      where: and(
        eq(categories.typeId, 'event_type'),
        inArray(categories.slug, eventTypes)
      ),
    });
    eventTypeIds = eventTypeCategories.map(c => c.id);
  }
  
  if (industries && industries.length > 0) {
    const industryCategories = await db.query.categories.findMany({
      where: and(
        eq(categories.typeId, 'industry'),
        inArray(categories.slug, industries)
      ),
    });
    industryIds = industryCategories.map(c => c.id);
  }
  
  // Build query for events
  const query = db.query.events.findMany({
    where: and(...whereConditions),
    orderBy: [desc(events.startDate)],
    offset: (page - 1) * limit,
    limit,
  });
  
  // Then filter by categories with a separate query to handle
  // the many-to-many relationship
  let filteredEvents = await query;
  
  if (eventTypeIds.length > 0 || industryIds.length > 0) {
    // Get all event IDs that match the category filters
    const eventCategoryMatches = await db.query.eventCategories.findMany({
      where: or(
        eventTypeIds.length > 0 ? inArray(eventCategories.categoryId, eventTypeIds) : undefined,
        industryIds.length > 0 ? inArray(eventCategories.categoryId, industryIds) : undefined
      ),
    });
    
    const matchingEventIds = new Set(eventCategoryMatches.map(ec => ec.eventId));
    filteredEvents = filteredEvents.filter(event => matchingEventIds.has(event.id));
  }
  
  // Handle price filtering
  if (priceMin !== undefined || priceMax !== undefined) {
    // For price filtering, we need to look at the ticket types for each event
    const eventIds = filteredEvents.map(e => e.id);
    const ticketTypesByEvent = await db.query.ticketTypes.findMany({
      where: inArray(ticketTypes.eventId, eventIds),
    });
    
    // Group ticket types by event
    const eventTicketMap = new Map<string, TicketType[]>();
    for (const ticket of ticketTypesByEvent) {
      if (!eventTicketMap.has(ticket.eventId)) {
        eventTicketMap.set(ticket.eventId, []);
      }
      eventTicketMap.get(ticket.eventId)!.push(ticket);
    }
    
    // Filter events based on their ticket prices
    filteredEvents = filteredEvents.filter(event => {
      const eventTickets = eventTicketMap.get(event.id) || [];
      if (eventTickets.length === 0) return false;
      
      // Find the lowest price ticket for this event
      const lowestPrice = Math.min(...eventTickets.map(t => t.price));
      
      if (priceMin !== undefined && lowestPrice < priceMin * 100) return false;
      if (priceMax !== undefined && lowestPrice > priceMax * 100) return false;
      
      return true;
    });
  }
  
  // Get total count for pagination
  const total = filteredEvents.length;
  
  return { events: filteredEvents, total };
};
```

## Scalability Considerations

1. **Index Optimization**: Create indexes for frequently queried fields
2. **Connection Pooling**: Implement connection pooling for Turso
3. **Query Optimization**: Monitor and optimize slow queries
4. **Caching Strategy**: Implement Redis caching for frequent queries
5. **Pagination**: Enforce pagination on all list endpoints
6. **Relation Loading**: Implement selective loading of relations

## Next Steps

1. **Create Database Setup Script**: Initialize SQLite database with schema
2. **Implement Seed Data**: Create test data for development
3. **Build Initial Migrations**: Set up Drizzle migrations
4. **Create Type Interfaces**: Ensure type safety across the application
5. **Implement Repository Pattern**: Abstract database access
6. **Test Query Performance**: Optimize queries with real data
7. **Design Turso Migration Plan**: Document migration steps in detail 