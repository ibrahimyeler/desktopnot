import 'package:flutter/foundation.dart';

class CardsViewModel extends ChangeNotifier {
  final List<Map<String, dynamic>> _cards = [];

  List<Map<String, dynamic>> get cards => _cards;

  void addCard(Map<String, dynamic> cardData) {
    _cards.add({
      ...cardData,
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
      'isDefault': _cards.isEmpty, // İlk kart varsayılan olur
    });
    notifyListeners();
  }

  void deleteCard(String cardId) {
    _cards.removeWhere((card) => card['id'] == cardId);
    // Eğer silinen kart varsayılan kart ise, ilk kartı varsayılan yap
    if (_cards.isNotEmpty && _cards.every((card) => card['isDefault'] != true)) {
      _cards[0]['isDefault'] = true;
    }
    notifyListeners();
  }

  void setDefaultCard(String cardId) {
    for (var card in _cards) {
      card['isDefault'] = card['id'] == cardId;
    }
    notifyListeners();
  }
}

