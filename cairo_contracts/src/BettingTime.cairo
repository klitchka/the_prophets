use starknet::ContractAddress;
use array::{ArrayTrait, SpanSerde};
use starknet::{
  Store,
  storage_address_from_base_and_offset,
  storage_read_syscall,
  storage_write_syscall,
  SyscallResult,
  StorageBaseAddress,
};

#[starknet::interface]
trait BettingTimeTrait<TContractState> {
    fn createBet(ref self: TContractState, game_id: u256, amount: u256, choice: bool);
    fn takeBet(ref self: TContractState, bet_id: u256, amount: u256);
    fn claimBet(ref self: TContractState, bet_id: u256);
}

#[starknet::contract]
mod BettingTime {
    use array::{ SpanTrait, SpanSerde };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use traits::{Into, TryInto};
    use bettingTime::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};

    #[storage]
    struct Storage {
        bets: LegacyMap<u256, Bet>,
        next_bet_id: u256,
        token: ContractAddress,
        players_list: LegacyMap::<(u256, u256), ContractAddress>,
        balances: LegacyMap::<(u256, ContractAddress), u256>,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct Bet {
        betOwner: ContractAddress,
        game_id: u256,
        amount: u256,
        first_bet: u256,
        total_bet_allocation: u256,
        choice: bool,
        total_players: u256,
        betConcluded: bool,
        betResult: bool,
    }

    #[constructor]
    fn constructor(ref self: ContractState, tokenAddress: ContractAddress) {
        self.next_bet_id.write(0);
        self.token.write(tokenAddress);
    }

    fn read_oracle(bet_id:u256) -> bool {
      if bet_id % 2 == 0 {
        return true;
      }
      return false;
    }

    #[external(v0)]
    impl BettingTimeImpl of super::BettingTimeTrait<ContractState> {
        fn createBet(ref self: ContractState, game_id: u256, amount: u256, choice: bool) {
            let bet_id = self.next_bet_id.read();
            self.next_bet_id.write(bet_id + 1);

            let bet = Bet {
                betOwner: get_caller_address(),
                game_id: game_id,
                first_bet: 0,
                amount: amount,
                total_bet_allocation: 0,
                choice: choice,
                total_players: 0,
                betConcluded: false,
                betResult: false,
            };

            self.bets.write(bet_id, bet);
        }

        fn takeBet(ref self: ContractState, bet_id: u256, amount: u256) {
            let mut bet = self.bets.read(bet_id);
            assert(amount > 0, 'Amount must be > 0');
            let caller = get_caller_address();
            assert(bet.betOwner != caller, 'Owner can not enter bet twice');

            IERC20Dispatcher { contract_address:self.token.read() }
              .transfer_from(caller, get_contract_address(), amount);
            let mut startingBalance = self.balances.read((bet_id, caller));

            if startingBalance == 0 {
              self.balances.write((bet_id, caller), amount);
              self.players_list.write((bet_id,bet.total_players), caller);
              bet.first_bet = bet.amount;
              bet.total_players += 1;
              bet.total_bet_allocation += amount;
            } else {
              self.balances.write((bet_id,caller), startingBalance + amount);
            }

            self.bets.write(bet_id, bet);
        }

        fn claimBet(ref self: ContractState, bet_id: u256) {
            let mut bet = self.bets.read(bet_id);
            let caller = get_caller_address();

            if !bet.betConcluded {
              bet.betResult = read_oracle(bet_id);
              bet.betConcluded = true;
            }

            let mut claimerSide = bet.choice;

            if bet.betOwner != caller {
              if claimerSide {
                claimerSide = false;
              } else {
                claimerSide = true;
              }
            }

            assert(bet.betResult == claimerSide, 'claimer did not win');

            // TODO: calculate earnings
            let winner_pool = bet.total_bet_allocation;
            let looser_pool = bet.total_bet_allocation - winner_pool;
            let user_winnings = bet.amount + ( bet.amount / winner_pool) * looser_pool;
            // TODO: transfer earnings to caller
            self.bets.write(bet_id, bet);
        }
    }
}
//we need to add total