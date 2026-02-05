import { defineDb, defineTable, column } from 'astro:db';

const Likes = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    slug: column.text({ unique: true }),
    count: column.number({ default: 0 }),
  },
});

const UserLikes = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    visitorId: column.text(),
    slug: column.text(),
  },
  indexes: [
    { on: ['visitorId', 'slug'], unique: true },
  ],
});

const Views = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    slug: column.text({ unique: true }),
    count: column.number({ default: 0 }),
  },
});

export default defineDb({
  tables: { Likes, UserLikes, Views },
});
