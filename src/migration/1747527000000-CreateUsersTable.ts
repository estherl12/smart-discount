import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1747527000000 implements MigrationInterface {
  name = 'CreateUsersTable1747527000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'MANAGER', 'STAFF')`,
    );
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "fullName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "contactNumber" character varying NOT NULL,
        "role" "public"."users_role_enum" NOT NULL,
        "resetOtp" character varying,
        "otpExpiresAt" date,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_contact_number" UNIQUE ("contactNumber"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
