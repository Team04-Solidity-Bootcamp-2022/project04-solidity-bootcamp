import { getVotesContract, getBallotContract } from "./_helper";

async function main() {
  const votesContract = await getVotesContract();
  const ballotContract = await getBallotContract();

  //ROLES FOR MINTING
  const MINTER_ROLE = await votesContract.MINTER_ROLE();
  const grantRoleTx = await votesContract.grantRole(
    MINTER_ROLE,
    ballotContract.address
  );
  await grantRoleTx.wait();
  console.log("Assign Role");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
