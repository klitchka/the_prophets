use starknet::{ContractAddress};
use array::{ SpanTrait, SpanSerde };
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
    fn takeBet(ref self: TContractState, amount: u256); //bool to check if the withdraw has been made
    fn claimBet(ref self: TContractState); //bool to check if the withdraw has been made
}

#[starknet::contract]
mod BettingTime {

    use array::{ SpanTrait, SpanSerde };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use traits::{Into, TryInto};
    // use super::IBet;
    // use super::{IERC20Dispatcher, IERC20DispatcherTrait};
    use test::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};

    #[storage]
    struct Storage {
        token: ContractAddress,
        bet_id: u256,
        betOwner: ContractAddress,
        game_id: u256,
        amount: u256,
        choice: bool,
        total_players: u256,
        players_list: LegacyMap<u256, ContractAddress>, // list of all players
        balances: LegacyMap<ContractAddress, u256>, // bet taker balances
        betConcluded: bool, // Flag that the event finished
        betResult: bool, // Side of the bet that won

    }

    /// @notice initializes a bet and depositing the bet amount by the bet creator
    /// @param token (ContractAddress): Address of the liquidity token
    /// @param game_id (u256): id of the game for the bet
    /// @param amount (u256): amount to place the bet
    /// @param choice (bool): side of the bet to take by bet owner
    #[constructor]
    fn constructor(
      ref self: ContractState,
      bet_id: u256,
      token: ContractAddress,
      game_id: u256,
      amount: u256,
      choice: bool,
    ) {
      assert(amount > 0, 'Amount must be > 0');
      // TODO: not caller but factory
      let caller = get_caller_address();

      IERC20Dispatcher { contract_address:token }.transfer_from(caller, get_contract_address(), amount);

      self.token.write(token);
      self.betOwner.write(caller);
      self.bet_id.write(bet_id);
      self.game_id.write(game_id);
      self.amount.write(amount.into());
      self.choice.write(choice);
      self.balances.write(caller, amount);
      self.players_list.write(self.total_players.read(), caller);
      self.total_players.write(self.total_players.read() + 1);

    }

    fn readOracle(bet_id:u256) -> bool {
      if bet_id % 2 == 0 {
        return true;
      }

      return false;
    }

    #[external(v0)]
    impl BettingTimeImpl of super::BettingTimeTrait<ContractState> {

      /// @notice lets a user to take a proposed bet
      /// @param amount (u256): amount to take for the bet
      fn takeBet(ref self: ContractState, amount: u256) {
        // TODO: validate amount limits
        assert(amount > 0, 'Amount must be > 0');
        // assert(amount < 0, 'Amount must be > 0');

        let caller = get_caller_address();
        assert(self.betOwner.read() != caller, 'Owner can not enter bet twice');

        IERC20Dispatcher { contract_address:self.token.read() }
          .transfer_from(caller, get_contract_address(), amount);
        let mut startingBalance = self.balances.read(caller);

        if startingBalance == 0 {
          self.balances.write(caller, amount);
          self.players_list.write(self.total_players.read(), caller);
          self.total_players.write(self.total_players.read() + 1);

        } else {
          self.balances.write(caller, startingBalance + amount);
        }

      }

      fn claimBet(ref self: ContractState ) {

        let caller = get_caller_address();
        let bet_id = self.bet_id.read();

        if ! self.betConcluded.read()  {
          // TODO: Emit event, bet result
          self.betResult.write(readOracle(bet_id));
          self.betConcluded.write(true);
        }

        let mut claimerSide = self.choice.read();

        if self.betOwner.read() != caller {
          claimerSide = !claimerSide;
        }

        assert(self.betResult.read() == claimerSide, 'claimer did not win');

        // TODO: calculate earnings
        // TODO: transfer earnings to caller

        // betConcluded: bool, // Flag that the event finished
        // betResult: bool, // Side of the bet that won

      }
    }

}
// TODO: todo buisness rules for propose
// guardar en arreglo de bets
// emitir evento con el idice de bets
// tranferir tokens al contrato








// mod BettingVault {
//     use super::{IERC20Dispatcher,IERC20DispatcherTrait};
//     use starknet::{ContractAddress, get_caller_address, get_contract_address};

//     enum EventStatus {
//         NotStarted,
//         InProgress,
//         Finished,
//     }

//     #[storage]
//     struct Storage {
//         token: IERC20Dispatcher,
//         total_supply: u256,
//         balance_of: LegacyMap<ContractAddress, u256>,
//         betting_contract: ContractAddress,
//         event_status: EventStatus,
//     }

//     #[constructor]
//     fn constructor(ref self: ContractState, token: ContractAddress, betting_contract: ContractAddress) {
//         self.token.write(IERC20Dispatcher { contract_address: token });
        
//         self.betting_contract.write(betting_contract);
//         self.event_status.write(EventStatus::NotStarted);
//     }


// }




