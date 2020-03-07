export default async synchronizer => {
  await synchronizer.$store.dispatch('wallet/getBalances')
}
