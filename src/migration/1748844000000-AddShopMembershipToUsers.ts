import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddShopMembershipToUsers1748844000000 implements MigrationInterface {
  name = 'AddShopMembershipToUsers1748844000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasShopIdColumn = await queryRunner.hasColumn('users', 'shopId');

    if (!hasShopIdColumn) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'shopId',
          type: 'uuid',
          isNullable: true,
        }),
      );

      await queryRunner.createForeignKey(
        'users',
        new TableForeignKey({
          columnNames: ['shopId'],
          referencedTableName: 'shops',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }),
      );
    }

    await queryRunner.query(`
      UPDATE "users"
      SET "shopId" = "shops"."id"
      FROM "shops"
      WHERE "shops"."ownerId" = "users"."id"
        AND "users"."shopId" IS NULL
    `);

    await queryRunner.changeColumn(
      'users',
      'password',
      new TableColumn({
        name: 'password',
        type: 'character varying',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'users',
      'contactNumber',
      new TableColumn({
        name: 'contactNumber',
        type: 'character varying',
        isNullable: true,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'contactNumber',
      new TableColumn({
        name: 'contactNumber',
        type: 'character varying',
        isNullable: false,
        isUnique: true,
      }),
    );

    await queryRunner.changeColumn(
      'users',
      'password',
      new TableColumn({
        name: 'password',
        type: 'character varying',
        isNullable: false,
      }),
    );

    const usersTable = await queryRunner.getTable('users');
    const shopForeignKey = usersTable?.foreignKeys.find((foreignKey) =>
      foreignKey.columnNames.includes('shopId'),
    );

    if (shopForeignKey) {
      await queryRunner.dropForeignKey('users', shopForeignKey);
    }

    const hasShopIdColumn = await queryRunner.hasColumn('users', 'shopId');
    if (hasShopIdColumn) {
      await queryRunner.dropColumn('users', 'shopId');
    }
  }
}
