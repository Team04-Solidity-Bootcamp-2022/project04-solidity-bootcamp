import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { VotingTokenDto } from './dtos/VotingTokenDto';
import { CastVotesDto } from './dtos/CastVotesDto';
import { DelegateDto } from './dtos/DelegateDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("voting-token")
  votingToken(
    @Body() body: VotingTokenDto): string {
    return this.appService.votingToken(body);
  }

  @Post("cast-votes")
  castVotes(
    @Body() body: CastVotesDto): string {
    return this.appService.castVotes(body);
  }

  @Post("delegate")
  delegate(
    @Body() body: DelegateDto): string {
    return this.appService.delegate(body);
  }

  @Get("query-results")
  queryResults(): string {
    return this.appService.queryResults();
  }

  @Get("recent-votes")
  recentVotes(): string {
    return this.appService.recentVotes();
  }
}
