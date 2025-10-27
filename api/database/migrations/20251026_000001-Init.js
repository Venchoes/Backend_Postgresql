"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init20251026000001 = void 0;
class Init20251026000001 {
    constructor() {
        this.name = 'Init20251026000001';
    }
    async up(queryRunner) {
        // users table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(120) NOT NULL,
        "email" VARCHAR(150) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL
      )
    `);
        // tasks table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "title" VARCHAR(120) NOT NULL,
        "description" VARCHAR(2000),
        "status" VARCHAR(20) NOT NULL DEFAULT 'todo',
        "priority" VARCHAR(20) NOT NULL DEFAULT 'medium',
        "dueDate" TIMESTAMP NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        // indexes
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tasks_user_status" ON "tasks" ("userId", "status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tasks_user_priority" ON "tasks" ("userId", "priority")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tasks_user_createdAt" ON "tasks" ("userId", "createdAt")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_user_createdAt"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_user_priority"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_user_status"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}
exports.Init20251026000001 = Init20251026000001;
