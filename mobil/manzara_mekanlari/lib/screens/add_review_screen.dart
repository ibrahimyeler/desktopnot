import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:share_plus/share_plus.dart';
import 'dart:io';
import '../models/place.dart';
import '../models/review.dart';
import '../services/place_service.dart';

class AddReviewScreen extends StatefulWidget {
  final Place place;

  const AddReviewScreen({super.key, required this.place});

  @override
  State<AddReviewScreen> createState() => _AddReviewScreenState();
}

class _AddReviewScreenState extends State<AddReviewScreen> {
  final _formKey = GlobalKey<FormState>();
  final _commentController = TextEditingController();
  final PlaceService _placeService = PlaceService();
  final ImagePicker _imagePicker = ImagePicker();

  double _rating = 0.0;
  List<File> _selectedImages = [];
  String _userName = 'Kullanıcı'; // Gerçek uygulamada auth'dan gelecek

  @override
  void initState() {
    super.initState();
    _loadUserName();
  }

  Future<void> _loadUserName() async {
    // Gerçek uygulamada SharedPreferences veya auth'dan gelecek
    setState(() {
      _userName = 'Kullanıcı ${DateTime.now().millisecondsSinceEpoch % 1000}';
    });
  }

  Future<void> _pickImages() async {
    try {
      final List<XFile> images = await _imagePicker.pickMultiImage();
      if (images.isNotEmpty) {
        setState(() {
          _selectedImages = images.map((xFile) => File(xFile.path)).toList();
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Görsel seçilirken hata: $e')),
        );
      }
    }
  }

  Future<void> _pickImageFromCamera() async {
    try {
      final XFile? image = await _imagePicker.pickImage(
        source: ImageSource.camera,
      );
      if (image != null) {
        setState(() {
          _selectedImages.add(File(image.path));
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Kamera hatası: $e')),
        );
      }
    }
  }

  Future<void> _shareToSocialMedia() async {
    if (_selectedImages.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Paylaşmak için en az bir görsel gerekli')),
      );
      return;
    }

    try {
      final XFile firstImage = XFile(_selectedImages.first.path);
      await Share.shareXFiles(
        [firstImage],
        text: '${widget.place.name} - ${_commentController.text}',
        subject: 'Manzara Mekanları',
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Paylaşım hatası: $e')),
        );
      }
    }
  }

  Future<void> _saveReview() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_rating == 0.0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lütfen bir puan verin')),
      );
      return;
    }

    // Görselleri base64'e çevir (gerçek uygulamada Firebase Storage kullanılmalı)
    final imageUrls = <String>[];
    // Şimdilik görselleri kaydetmiyoruz, gerçek uygulamada Firebase Storage kullanılmalı

    final review = Review(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      placeId: widget.place.id,
      userId: _userName,
      userName: _userName,
      comment: _commentController.text,
      rating: _rating,
      imageUrls: imageUrls,
      createdAt: DateTime.now(),
    );

    await _placeService.addReview(review);

    if (mounted) {
      Navigator.pop(context, true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Yorumunuz başarıyla eklendi!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.place.name),
        actions: [
          if (_selectedImages.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.share),
              onPressed: _shareToSocialMedia,
              tooltip: 'Sosyal Medyada Paylaş',
            ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Puanlama
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    const Text(
                      'Puanınız',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    RatingBar.builder(
                      initialRating: _rating,
                      minRating: 1,
                      direction: Axis.horizontal,
                      allowHalfRating: true,
                      itemCount: 5,
                      itemSize: 40,
                      itemPadding: const EdgeInsets.symmetric(horizontal: 4.0),
                      itemBuilder: (context, _) => const Icon(
                        Icons.star,
                        color: Colors.amber,
                      ),
                      onRatingUpdate: (rating) {
                        setState(() {
                          _rating = rating;
                        });
                      },
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _rating > 0 ? '${_rating.toStringAsFixed(1)} / 5.0' : 'Puan verin',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Görseller
            if (_selectedImages.isNotEmpty)
              SizedBox(
                height: 150,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _selectedImages.length,
                  itemBuilder: (context, index) {
                    return Stack(
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.file(
                              _selectedImages[index],
                              width: 150,
                              height: 150,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                        Positioned(
                          top: 4,
                          right: 12,
                          child: IconButton(
                            icon: const Icon(Icons.close, color: Colors.white),
                            onPressed: () {
                              setState(() {
                                _selectedImages.removeAt(index);
                              });
                            },
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            const SizedBox(height: 16),
            // Görsel ekle butonları
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _pickImages,
                    icon: const Icon(Icons.photo_library),
                    label: const Text('Galeriden Seç'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _pickImageFromCamera,
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Kamera'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            // Yorum
            TextFormField(
              controller: _commentController,
              decoration: const InputDecoration(
                labelText: 'Yorumunuz',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.comment),
                hintText: 'Bu mekan hakkındaki düşüncelerinizi paylaşın...',
              ),
              maxLines: 5,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Lütfen yorum girin';
                }
                return null;
              },
            ),
            const SizedBox(height: 32),
            // Kaydet butonu
            ElevatedButton(
              onPressed: _saveReview,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Yorumu Kaydet'),
            ),
            const SizedBox(height: 16),
            // Uygulama içinde paylaş butonu
            OutlinedButton.icon(
              onPressed: () {
                _saveReview();
                // Yorum kaydedildikten sonra uygulama içinde paylaşım yapılabilir
              },
              icon: const Icon(Icons.share),
              label: const Text('Uygulama İçinde Paylaş'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }
}

