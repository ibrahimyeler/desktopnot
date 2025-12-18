import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/coach.dart';
import 'ai_provider.dart';
import 'openai_provider.dart';

/// Service to manage AI coaches
class CoachService {
  static const String _coachesKey = 'ai_coaches';

  /// Get all coaches with mock data
  Future<List<Coach>> getCoaches() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Get all coaches (default + custom)
    final defaultCoaches = _getDefaultCoaches();
    final customCoaches = _getCustomCoaches();
    final allCoaches = [...defaultCoaches, ...customCoaches];
    
    // Save to SharedPreferences
    final jsonList = allCoaches.map((coach) => coach.toJson()).toList();
    await prefs.setString(_coachesKey, jsonEncode(jsonList));
    
    return allCoaches;
  }

  /// Save coaches
  Future<void> saveCoaches(List<Coach> coaches) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = coaches.map((coach) => coach.toJson()).toList();
    await prefs.setString(_coachesKey, jsonEncode(jsonList));
  }

  /// Get AI provider for a coach
  AIProvider? getProviderForCoach(Coach coach) {
    // For now, use OpenAI for all coaches
    // You can extend this to support different providers per coach
    final apiKey = coach.config['apiKey'] as String? ?? '';
    if (apiKey.isEmpty) {
      return null;
    }
    return OpenAIProvider(apiKey: apiKey);
  }

  /// Get default coaches
  List<Coach> _getDefaultCoaches() {
    return [
      Coach(
        id: 'focus-planning-coach',
        name: 'Odak ve Planlama Koçu',
        category: 'productivity',
        description: 'Odaklanmanızı artırın, hedeflerinizi planlayın ve verimliliğinizi maksimize edin',
        icon: '🎯',
        config: {
          'apiKey': '',
          'systemPrompt': 'Sen bir odak ve planlama koçusun. Kullanıcıların odaklanma becerilerini geliştirmesine, hedeflerini belirlemesine ve planlamasına, zaman yönetimini iyileştirmesine, verimliliğini artırmasına ve günlük rutinlerini optimize etmesine yardımcı ol. Pomodoro tekniği, zaman bloklama, görev önceliklendirme gibi teknikler öner.',
          'model': 'gpt-4',
        },
      ),
      Coach(
        id: 'english-coach',
        name: 'İngilizce Koçu',
        category: 'language',
        description: 'İngilizce öğrenme ve geliştirme yolculuğunuzda size rehberlik eder, pratik yapmanıza yardımcı olur',
        icon: '🇬🇧',
        config: {
          'apiKey': '',
          'systemPrompt': 'Sen bir İngilizce öğrenme koçusun. Kullanıcıların İngilizce öğrenme hedeflerine ulaşmasına yardımcı ol. İngilizce dil öğrenme teknikleri, kelime ezberleme stratejileri, gramer açıklamaları, konuşma pratiği, okuma ve dinleme alıştırmaları, yazma becerileri, motivasyon desteği ve kişiselleştirilmiş öğrenme planları sun. Kullanıcının seviyesine göre (başlangıç, orta, ileri) uygun içerik ve alıştırmalar öner. İngilizce öğrenmeyi eğlenceli ve etkili hale getir. Kullanıcıyla İngilizce konuşarak pratik yapmasına yardımcı ol.',
          'model': 'gpt-4',
        },
      ),
      Coach(
        id: 'finance-coach',
        name: 'Finans Koçu',
        category: 'finance',
        description: 'Finansal hedeflerinize ulaşmanızda size rehberlik eder, bütçe yönetimi ve yatırım stratejileri sunar',
        icon: '💰',
        config: {
          'apiKey': '',
          'systemPrompt': 'Sen bir finans koçusun. Kullanıcıların finansal hedeflerine ulaşmasına yardımcı ol. Bütçe yönetimi, tasarruf stratejileri, yatırım önerileri, borç yönetimi, emeklilik planlaması, finansal okuryazarlık, gelir artırma yöntemleri ve kişiselleştirilmiş finansal planlar sun. Kullanıcının finansal durumuna göre uygun önerilerde bulun. Finansal kararlarını daha bilinçli almasına yardımcı ol. Finansal güvenlik ve bağımsızlık hedeflerine ulaşması için rehberlik et.',
          'model': 'gpt-4',
        },
      ),
    ];
  }

  /// Get custom coaches (user created)
  List<Coach> _getCustomCoaches() {
    return [
      Coach(
        id: 'custom-fitness-coach-001',
        name: 'Kişisel Fitness Koçum',
        category: 'fitness',
        description: 'Benim için özel olarak tasarlanmış fitness koçu. Antrenman programımı ve beslenme planımı yönetiyor',
        icon: '💪',
        config: {
          'apiKey': '',
          'systemPrompt': 'Sen kullanıcının kişisel fitness koçusun. Antrenman programları, beslenme önerileri ve motivasyon desteği sun.',
          'model': 'gpt-4',
        },
        // Başlangıçta market'te değil, kullanıcı fiyat belirleyip ekleyecek
        isMarketplace: false,
      ),
    ];
  }

  /// Get marketplace coaches (custom coaches available for sale/rent)
  Future<List<Coach>> getMarketplaceCoaches() async {
    final allCoaches = await getCoaches();
    // Sadece market'te satışa sunulmuş koçları döndür
    return allCoaches.where((coach) => coach.isMarketplace).toList();
  }
}

