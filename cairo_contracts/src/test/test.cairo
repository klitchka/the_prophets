
mod test{
    use starknet::syscalls::deploy_syscall;
    use result::ResultTrait;
    use array::{ArrayTrait, SpanTrait};
    use betting::erc20::ERC20;
    use betting::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::{SyscallResultTrait, ContractAddress, contract_address_const};
    use integer::BoundedInt;

    use debug::PrintTrait;

    #[test]
    #[available_gas(2000000)]
    fn unit_test() {
     
    let admin_address: ContractAddress = 'admin'.try_into().unwrap();
    
    let erc_20 = deploy_erc20('VAUTT', 'VAU', BoundedInt::max(), contract_address_const::<'owner'>());
    
    let balance = erc_20.balance_of(contract_address_const::<'owner'>());
    'balance'.print();
    balance.print();
    // assert(admin_address == contract0.name(), 'Not the owner');
    }

    fn deploy_erc20(
        name: felt252, symbol: felt252, initial_supply: u256, recipent: ContractAddress
    ) -> IERC20Dispatcher {
        let mut calldata = array![name, symbol];
        Serde::serialize(@initial_supply, ref calldata);
        calldata.append(recipent.into());

        let (address, _) = deploy_syscall(
            ERC20::TEST_CLASS_HASH.try_into().unwrap(), 0, calldata.span(), true
        )
            .unwrap_syscall();

        return IERC20Dispatcher { contract_address: address };
    }
}