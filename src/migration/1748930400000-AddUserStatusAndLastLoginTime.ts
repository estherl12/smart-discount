import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserStatusAndLastLoginTime1748930400000 implements MigrationInterface {
  name = 'AddUserStatusAndLastLoginTime1748930400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasIsActiveColumn = await queryRunner.hasColumn('users', 'isActive');

    if (!hasIsActiveColumn) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'isActive',
          type: 'boolean',
          default: true,
        }),
      );
    }

    const hasLastLoginTimeColumn = await queryRunner.hasColumn(
      'users',
      'lastLoginTime',
    );

    if (!hasLastLoginTimeColumn) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'lastLoginTime',
          type: 'timestamp',
          isNullable: true,
        }),
      );
    }

    await queryRunner.query(`
      UPDATE "users"
      SET "isActive" = true
      WHERE "isActive" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasLastLoginTimeColumn = await queryRunner.hasColumn(
      'users',
      'lastLoginTime',
    );
    if (hasLastLoginTimeColumn) {
      await queryRunner.dropColumn('users', 'lastLoginTime');
    }

    const hasIsActiveColumn = await queryRunner.hasColumn('users', 'isActive');
    if (hasIsActiveColumn) {
      await queryRunner.dropColumn('users', 'isActive');
    }
  }
}
