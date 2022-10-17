import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { VotingTokenDto } from './dtos/VotingTokenDto';
import { CastVotesDto } from './dtos/CastVotesDto';
import { DelegateDto } from './dtos/DelegateDto';
import { ContractReaderDto } from './dtos/ContractReader.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-contract-address')
  getContractAddress() {
    const result = this.appService.getContractAddress();
    return { result };
  }

  @Get('query-results')
  queryResults(): string {
    return this.appService.queryResults();
  }

  @Get('recent-votes')
  recentVotes(): string {
    return this.appService.recentVotes();
  }

  @Post('voting-token')
  votingToken(@Body() body: VotingTokenDto): string {
    return this.appService.votingToken(body);
  }

  @Post('cast-votes')
  castVotes(@Body() body: CastVotesDto): string {
    return this.appService.castVotes(body);
  }

  @Post('delegate')
  delegate(@Body() body: DelegateDto): string {
    return this.appService.delegate(body);
  }

  @Post('claim-tokens')
  claimTokens(@Body() body: VotingTokenDto) {
    return this.appService.claimTokens(body);
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
