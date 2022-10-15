import {
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';

export class ContractReaderDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['name', 'totalSupply', 'symbol', 'balanceOf'])
  public cmd: string;

  @IsOptional()
  @MaxLength(50, {
    each: true,
  })
  args: string[];
}
