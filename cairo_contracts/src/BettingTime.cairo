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
trait IERC20<T> {
    fn name(self: @T) -> felt252;
    fn totalSupply(self: @T) -> u256;
    fn symbol(self: @T) -> felt252;
    fn balanceOf(self: @T, account: ContractAddress) -> u256;
    fn transfer_from(
        ref self: T, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
    fn transfer(ref self: T, recipient: ContractAddress, amount: u256) -> bool;
}

#[starknet::interface]
trait BettingTimeTrait<TContractState> {
    fn takeBet(ref self: TContractState, amount: u256);//bool to check if the withdraw has been made
    // fn withdraw(ref self: @TContractState) -> bool;//bool to check if the withdraw has been made
}

#[starknet::contract]
mod BettingTime {

    use array::{ SpanTrait, SpanSerde };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use traits::{Into, TryInto};
    // use super::IBet;
    use super::{IERC20Dispatcher, IERC20DispatcherTrait};

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
      assert(amount > 0, 'Amount must be > 0');
      let caller = get_caller_address();

      IERC20Dispatcher { contract_address:token }.transfer_from(caller, get_contract_address(), amount);

      self.token.write(token);
      self.betOwner.write(caller);
      self.game_id.write(game_id);
      self.amount.write(amount.into());
      self.choice.write(choice);
      self.balances.write(caller, amount);
      self.players_list.write(self.total_players.read(), caller);
      self.total_players.write(self.total_players.read() + 1);

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

    }

    // #[external(v0)]
    // impl BetImpl of IBet<ContractState> {
    //     fn deposit(ref self: ContractState, list: Span<felt252>) -> bool {
    //         let caller = get_caller_address();
    //         let token_contract = self.token.read(); // Asumiendo que tienes un ITokenLocal en tu almacenamiento

    //     let bet = BetStruct {
    //         user: caller,
    //         game: game_id,
    //         bet_ammount: amount,
    //         election: election,
    //     }

    //     fn withdraw(ref self: @ContractState) -> bool {
    //         self.content_array.read()
    //         true
    //     }
    // }
}











// #[starknet::interface]
// trait ITokenLoca<T> {
//     fn name(self: @T) -> felt252;
//     fn totalSupply(self: @T) -> u256;
//     fn symbol(self: @T) -> felt252;
//     fn balanceOf(self: @T, account: ContractAddress) -> u256;
//     fn transfer_from(
//         ref self: T, sender: ContractAddress, recipient: ContractAddress, amount: u256
//     ) -> bool;
//     fn transfer(ref self: T, recipient: ContractAddress, amount: u256) -> bool;
// 		fn get_faucet(ref self: T, receiver: ContractAddress) -> bool;
// }

// #[starknet::interface]
// trait Bet<TContractState> {
//     fn deposit(ref self: TContractState, amount: u256);
//     fn withdraw(ref self: TContractState, shares: u256);
// }

// #[derive(Copy, Drop, Serde, storage_access::StorageAccess)]
// struct BetStruct {
//     user: ContractAddress,
//     game: felt252,
//     bet_ammount: usize,
//     choice: u8,
// }

// #[starknet::contract]
// mod ProposeBet {
// use super::{ContractAddress, ITokenLocal, BetStruct};
//     use starknet::{
//         get_caller_address, get_contract_address,
//         ContractAddressIntoFelt252
//     };
//     use zeroable::Zeroable;
//     use traits::{Into, TryInto};
//     #[derive(Copy, Serde, Drop, starknet::Store)]
//     struct BetInfo {
//         sender: ContractAddress,
//         gameID: felt252,
//         amount: usize,
//         choice: u8,
//         is_betting: LegacyMap<ContractAddress, bool>,
//         balances: LegacyMap<ContractAddress, usize>,
//         players_list: ArrayTrait::<u32>,

//     }
//     #[event]
//     #[derive(Drop, starknet::Event)]
//     enum Event {
//         StoredBet: StoredBet,
//     }

//     #[derive(Drop, starknet::Event)]
//     struct StoredBet {
//         #[key]
//         betId: felt252,
//     }
//     #[storage]
//     struct Storage {
//         bet: LegacyMap<(ContractAddress, felt252), bool>,



//     }
//     #[external(v0)]
//     impl propose_bet of Ipropose_bet{
//         fn deposit(ref self: BetInfo, game_id: felt252, amount: usize, sender: ContractAddress) -> felt252:
//         let bet_id = get_caller_address();
//         self.sender.write(sender);
//         self.gameID.write(game_id);
//         self.amount.write(amount);
//         self.is_betting.write(true);
//         self.balances.write(amount);
//         self.players_list.push(bet_id);
//         self.emit(StoredBet{bet_id});

//         return bet_id;
        
//     }


    
// }

// proposebet(gameid, amount, sender) 
// poblar betinfo
// todo buisness rules for propose
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

//     mod Escrow {
//         fn deposit(ref self: ContractState, amount: u256) {
//             assert(self.event_status == EventStatus::NotStarted , '');(self.event_status.read(), EventStatus::NotStarted);

//             let caller = get_caller_address();

//             let mut shares = 0;
//             if self.total_supply.read() == 0 {
//                 shares = amount;
//             } else {
//                 let balance = self.token.read().balance_of(this);
//                 shares = (amount * self.total_supply.read()) / balance;
//             }

//             PrivateFunctions::_mint(ref self, caller, shares);
//             self.token.read().transfer_from(caller, this, amount);
//         }
//     }

//     mod Withdraw {
//         fn withdraw(ref self: ContractState, shares: u256) {
//             assert_eq!(self.event_status.read(), EventStatus::Finished);

//             let caller = get_caller_address();

//             let balance = self.token.read().balance_of(this);
//             let amount = (shares * balance) / self.total_supply.read();
//             PrivateFunctions::_burn(ref self, caller, shares);
//             self.token.read().transfer(caller, amount);
//         }
//     }

//     // Rest of the contract...
// }


// #[starknet::interface]
// trait IBetting<TContractState> {
//     fn escrow(ref self: TContractState);
//     fn shuttle(ref self: TContractState);
// }

// #[starknet::contract]
// mod BettingContract {
//     use starknet::get_caller_address;
//     use starknet::ContractAddress;

//     enum Result<W, L, D> {
//         Win: W,
//         Loose: L,
//         Draw: D,
//     }
//     #[storage]
//     struct Bet {
//         user: ContractAddress
//         amount: usize,
//         game: felt252,
//         election: u16,
//     }
//     #[constructor]
//     fn constructor(ref self: ContractState) {
        
//     }


// }

// EventContract
// Data_structures:
//     Name
//     Description
//     Outcomes
//     CurrentOutcome
    

// BetContract

// use starknet::ContractAddress;

// #[starknet::interface]
// trait IRegistration<T> {
//     fn store_name(ref self: T, name: felt252);
//     fn get_name(self: @T, address: ContractAddress) -> felt252;
// }

// #[starknet::contract]
// mod Registration{

//     use super::IRegistration;
//     use starknet::{ContractAddress, get_caller_address};

//     #[storage]
//     struct Storage {
//         names: LegacyMap::<ContractAddress, felt252>,
//         total_names: u128,
//         owner: Person, 
//     }
