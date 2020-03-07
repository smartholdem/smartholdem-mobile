export default async synchronizer => {
  await synchronizer.$store.dispatch('blockchain/getStatus')
}
