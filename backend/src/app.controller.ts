import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { VotingTokenDto } from './dtos/VotingTokenDto';
import { AddToWhitelistDto } from './dtos/AddToWhitelistDto';
import { ContractReaderDto } from './dtos/ContractReader.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("get-contract-address")
  getContractAddress() {
    const result = this.appService.getContractAddress();
    return { result };
  }
  @Post("add-whitelist")
  addToWhitelist(
    @Body() body: AddToWhitelistDto) {
      return this.appService.addToWhitelist(body);
  }
  @Post("claim-tokens")
  claimTokens(
    @Body() body: VotingTokenDto) {
    return this.appService.claimTokens(body);
  }

  @Get('query-results')
  queryResults(): string {
    return this.appService.queryResults();
  }

  @Get('recent-votes')
  recentVotes(): string {
    return this.appService.recentVotes();
  }

  @Post('read-contract')
  @ApiResponse({
    status: 200,
    description: 'Generic Contract Reader',
    content: {
      'application/json': {
        examples: {
          Name: { value: { cmd: 'name' } },
          Symbol: { value: { cmd: 'symbol' } },
          TotalSupply: { value: { cmd: 'totalSupply' } },
          BalanceOf: {
            value: { cmd: 'balanceOf', args: ['contract-address'] },
          },
        },
      },
    },
  })
  readContract(@Body() body: ContractReaderDto): object {
    return this.appService.readContract(body);
  }
}
