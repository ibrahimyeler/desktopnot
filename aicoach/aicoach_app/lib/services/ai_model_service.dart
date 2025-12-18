import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/ai_model.dart';
import 'ai_provider.dart';
import 'openai_provider.dart';
import 'anthropic_provider.dart';
import 'google_provider.dart';
import 'langchain_provider.dart';

/// Service to manage AI models and providers
class AIModelService {
  static const String _modelsKey = 'ai_models';
  final Map<String, AIProvider> _providers = {};

  /// Get all saved AI models
  Future<List<AIModel>> getModels() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString(_modelsKey);
    if (jsonString == null) {
      return getDefaultModels();
    }

    final List<dynamic> jsonList = jsonDecode(jsonString);
    return jsonList.map((json) => AIModel.fromJson(json)).toList();
  }

  /// Save AI models
  Future<void> saveModels(List<AIModel> models) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = models.map((model) => model.toJson()).toList();
    await prefs.setString(_modelsKey, jsonEncode(jsonList));
  }

  /// Add a new AI model
  Future<void> addModel(AIModel model) async {
    final models = await getModels();
    if (!models.any((m) => m.id == model.id)) {
      models.add(model);
      await saveModels(models);
    }
  }

  /// Update an existing AI model
  Future<void> updateModel(AIModel model) async {
    final models = await getModels();
    final index = models.indexWhere((m) => m.id == model.id);
    if (index != -1) {
      models[index] = model;
      await saveModels(models);
    }
  }

  /// Delete an AI model
  Future<void> deleteModel(String modelId) async {
    final models = await getModels();
    models.removeWhere((m) => m.id == modelId);
    await saveModels(models);
  }

  /// Get AI provider for a model
  AIProvider? getProvider(AIModel model) {
    if (_providers.containsKey(model.id)) {
      return _providers[model.id];
    }

    // Get API key from model config
    final apiKey = model.config['apiKey'] as String? ?? '';

    switch (model.provider) {
      case 'openai':
        final provider = OpenAIProvider(apiKey: apiKey);
        _providers[model.id] = provider;
        return provider;
      case 'anthropic':
        final provider = AnthropicProvider(apiKey: apiKey);
        _providers[model.id] = provider;
        return provider;
      case 'google':
        final provider = GoogleProvider(apiKey: apiKey);
        _providers[model.id] = provider;
        return provider;
      case 'langchain':
        final baseUrl = model.config['baseUrl'] as String? ?? 'http://localhost:8000/api/langchain';
        final provider = LangChainProvider(apiKey: apiKey, baseUrl: baseUrl);
        _providers[model.id] = provider;
        return provider;
      default:
        return null;
    }
  }

  /// Get default models
  List<AIModel> getDefaultModels() {
    return [
      AIModel(
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'Most capable OpenAI model',
        provider: 'openai',
        config: {'apiKey': ''},
      ),
      AIModel(
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and affordable OpenAI model',
        provider: 'openai',
        config: {'apiKey': ''},
      ),
      AIModel(
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Most capable Anthropic model',
        provider: 'anthropic',
        config: {'apiKey': ''},
      ),
      AIModel(
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        description: 'Balanced Anthropic model',
        provider: 'anthropic',
        config: {'apiKey': ''},
      ),
      AIModel(
        id: 'gemini-pro',
        name: 'Gemini Pro',
        description: 'Google\'s most capable model',
        provider: 'google',
        config: {'apiKey': ''},
      ),
      AIModel(
        id: 'langchain-default',
        name: 'LangChain',
        description: 'LangChain with tools and agents',
        provider: 'langchain',
        config: {
          'apiKey': '',
          'baseUrl': 'http://localhost:8000/api/langchain',
        },
      ),
    ];
  }
}

