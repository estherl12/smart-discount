import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateShopOwnedInventoryTables1748210000000 implements MigrationInterface {
  name = 'CreateShopOwnedInventoryTables1748210000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasShopsTable = await queryRunner.hasTable('shops');
    if (!hasShopsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'shops',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'gen_random_uuid()',
            },
            {
              name: 'name',
              type: 'character varying',
            },
            {
              name: 'ownerId',
              type: 'uuid',
              isNullable: false,
              isUnique: true,
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'shops',
        new TableForeignKey({
          columnNames: ['ownerId'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    const hasCategoriesTable = await queryRunner.hasTable('categories');
    if (!hasCategoriesTable) {
      await queryRunner.createTable(
        new Table({
          name: 'categories',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'gen_random_uuid()',
            },
            {
              name: 'name',
              type: 'character varying',
              isNullable: false,
            },
            {
              name: 'shopId',
              type: 'uuid',
              isNullable: false,
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'categories',
        new TableForeignKey({
          columnNames: ['shopId'],
          referencedTableName: 'shops',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    const hasProductsTable = await queryRunner.hasTable('products');
    if (!hasProductsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'products',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'gen_random_uuid()',
            },
            {
              name: 'name',
              type: 'character varying',
              isNullable: false,
            },
            {
              name: 'categoryId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'price',
              type: 'decimal',
              precision: 10,
              scale: 2,
              isNullable: false,
            },
            {
              name: 'stockQty',
              type: 'int',
              default: 0,
              isNullable: false,
            },
            {
              name: 'shopId',
              type: 'uuid',
              isNullable: false,
            },
          ],
        }),
      );

      await queryRunner.createForeignKeys('products', [
        new TableForeignKey({
          columnNames: ['categoryId'],
          referencedTableName: 'categories',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          columnNames: ['shopId'],
          referencedTableName: 'shops',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      ]);
    }

    const hasSalesTable = await queryRunner.hasTable('sales');
    if (!hasSalesTable) {
      await queryRunner.createTable(
        new Table({
          name: 'sales',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true,
            },
            {
              name: 'amount',
              type: 'decimal',
              precision: 10,
              scale: 2,
              isNullable: false,
            },
            {
              name: 'qty',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'date',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
            {
              name: 'productId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'shopId',
              type: 'uuid',
              isNullable: false,
            },
          ],
        }),
      );

      await queryRunner.createForeignKeys('sales', [
        new TableForeignKey({
          columnNames: ['productId'],
          referencedTableName: 'products',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          columnNames: ['shopId'],
          referencedTableName: 'shops',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('sales')) {
      await queryRunner.dropTable('sales', true);
    }

    if (await queryRunner.hasTable('products')) {
      await queryRunner.dropTable('products', true);
    }

    if (await queryRunner.hasTable('categories')) {
      await queryRunner.dropTable('categories', true);
    }

    if (await queryRunner.hasTable('shops')) {
      await queryRunner.dropTable('shops', true);
    }
  }
}
