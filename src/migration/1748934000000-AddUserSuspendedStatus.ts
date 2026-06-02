import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserSuspendedStatus1748934000000 implements MigrationInterface {
  name = 'AddUserSuspendedStatus1748934000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasIsSuspendedColumn = await queryRunner.hasColumn(
      'users',
      'isSuspended',
    );

    if (!hasIsSuspendedColumn) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'isSuspended',
          type: 'boolean',
          default: false,
        }),
      );
    }

    await queryRunner.query(`
      UPDATE "users"
      SET "isSuspended" = false
      WHERE "isSuspended" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasIsSuspendedColumn = await queryRunner.hasColumn(
      'users',
      'isSuspended',
    );

    if (hasIsSuspendedColumn) {
      await queryRunner.dropColumn('users', 'isSuspended');
    }
  }
}
