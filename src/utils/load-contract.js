import contract from "@truffle/contract"

export const loadContract = async (name,provider) => {
  const res = await fetch(`/contracts/${name}.json`)
  const Artifact = await res.json()
  const _contract=contract(Artifact)
  _contract.setProvider(provider)
let deployedContract;
try{
    deployedContract=await _contract.deployed()
} catch{
    console.error("connected to wrong network")
}

  return deployedContract
}