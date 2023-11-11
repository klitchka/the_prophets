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
trait IBet<TContractState> {
    fn deposit(ref self: TContractState, list: Span<felt252>) -> bool;//bool to check if the withdraw has been made
    fn withdraw(ref self: @TContractState) -> bool;//bool to check if the withdraw has been made
}

#[starknet::contract]
mod BettingTime {
    use test::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use array::{ SpanTrait, SpanSerde };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use super::IBet;
    // use super::{IERC20Dispatcher, IERC20DispatcherTrai

    #[storage]
    struct Storage {
        token: ContractAddress,
        betOwner: ContractAddress,
        game_id: u256,
        amount: u256,
        choice: u8,
        total_players: u256,
        players_list: LegacyMap<u256, ContractAddress>, // list of all players
        balances: LegacyMap<ContractAddress, u256>, // bet taker balances

    }

    /// @notice initializes a bet and depositing the bet amount by the bet creator
    /// @param token (ContractAddress): Address of the liquidity token
    /// @param game_id (u256): id of the game for the bet
    /// @param amount (u256): amount to place the bet
    /// @param choice (u8): side of the bet to take by bet owner
    #[constructor]
    fn constructor(
      ref self: ContractState,
      token: ContractAddress,
      game_id: u256,
      amount: u256,
      choice: u8,
    ) {

      let caller = get_caller_address();

      IERC20Dispatcher { contract_address:token }.transfer_from(caller, get_contract_address(), amount);

      self.token.write(token);
      self.betOwner.write(caller);
      self.game_id.write(game_id);
      self.amount.write(amount);
      self.choice.write(choice);
      self.balances.write(caller, amount);
      self.players_list.write(self.total_players.read(), caller);
      self.total_players.write(self.total_players.read() + 1);

    }
}
