class WalletState {
  final bool isLoading;
  final String? error;
  final double balance;
  final List<Map<String, dynamic>> transactions;

  const WalletState({
    this.isLoading = false,
    this.error,
    this.balance = 0.0,
    this.transactions = const [],
  });

  WalletState copyWith({
    bool? isLoading,
    String? error,
    double? balance,
    List<Map<String, dynamic>>? transactions,
  }) {
    return WalletState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      balance: balance ?? this.balance,
      transactions: transactions ?? this.transactions,
    );
  }
}

