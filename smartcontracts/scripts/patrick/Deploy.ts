import { deployVotes, deployBallot } from "./_deploy";

async function main() {
  const votesContract = await deployVotes();
  console.log(votesContract.address);

  const ballotContract = await deployBallot(votesContract);
  console.log(ballotContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
