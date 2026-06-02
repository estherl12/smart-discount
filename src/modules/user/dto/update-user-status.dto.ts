import { IsEnum } from 'class-validator';

export enum USER_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class UpdateUserStatusDto {
  @IsEnum(USER_STATUS, {
    message: 'Status must be ACTIVE, INACTIVE or SUSPENDED',
  })
  status: USER_STATUS;
}
